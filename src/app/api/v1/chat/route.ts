import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

// Helper to write error logs and return standard error JSON
async function logAndReturnError(
  status: number,
  message: string,
  startTime: number,
  apiKeyId: string | null,
  userAgent: string,
  ipAddress: string,
  endpoint: string,
  systemError?: string
) {
  const responseTime = Date.now() - startTime;

  if (apiKeyId) {
    try {
      // Log the failure in DB
      await db.apiLog.create({
        data: {
          apiKeyId,
          endpoint,
          responseTime,
          statusCode: status,
          ipAddress,
          userAgent,
          errorMessage: systemError || message,
        },
      });
    } catch (dbError) {
      console.error('Error recording API error log:', dbError);
    }
  }

  return NextResponse.json(
    {
      error: {
        message,
        type: status === 401 ? 'invalid_request_error' : status === 429 ? 'rate_limit_error' : 'api_error',
        code: status,
      },
    },
    { status }
  );
}

export async function POST(request: Request) {
  const startTime = Date.now();
  
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const endpoint = '/api/v1/chat';

  let apiKeyRecord: any = null;

  try {
    // 1. Validate authorization header presence and prefix
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return logAndReturnError(
        401,
        'Unauthorized: Missing or invalid Authorization header. Expected Bearer token format.',
        startTime,
        null,
        userAgent,
        ipAddress,
        endpoint
      );
    }

    const rawKey = authHeader.substring(7).trim();
    if (!rawKey) {
      return logAndReturnError(
        401,
        'Unauthorized: API key token is empty.',
        startTime,
        null,
        userAgent,
        ipAddress,
        endpoint
      );
    }

    // 2. Hash raw key and look up in DB
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    apiKeyRecord = await db.apiKey.findUnique({
      where: { keyHash },
    });

    if (!apiKeyRecord) {
      return logAndReturnError(
        401,
        'Unauthorized: The provided API key is invalid.',
        startTime,
        null,
        userAgent,
        ipAddress,
        endpoint
      );
    }

    const apiKeyId = apiKeyRecord.id;

    // 3. Check status
    if (apiKeyRecord.status !== 'ACTIVE') {
      return logAndReturnError(
        403,
        'Forbidden: This API key has been disabled.',
        startTime,
        apiKeyId,
        userAgent,
        ipAddress,
        endpoint
      );
    }

    // 4. Rate limiting check (request count in the last 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const requestsLast24Hours = await db.apiLog.count({
      where: {
        apiKeyId,
        timestamp: { gte: twentyFourHoursAgo },
      },
    });

    if (requestsLast24Hours >= apiKeyRecord.rateLimit) {
      return logAndReturnError(
        429,
        `Too Many Requests: Daily rate limit of ${apiKeyRecord.rateLimit} requests exceeded for this key.`,
        startTime,
        apiKeyId,
        userAgent,
        ipAddress,
        endpoint
      );
    }

    // 5. Parse request body
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      return logAndReturnError(
        400,
        'Bad Request: Request body must be a valid JSON object.',
        startTime,
        apiKeyId,
        userAgent,
        ipAddress,
        endpoint
      );
    }

    const { messages, model, temperature } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return logAndReturnError(
        400,
        'Bad Request: "messages" parameter is required and must be a non-empty array of objects.',
        startTime,
        apiKeyId,
        userAgent,
        ipAddress,
        endpoint
      );
    }

    // 6. Contact real Mani AI backend
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const history = messages.slice(0, -1);
    const siteContext = body.siteContext || "Query routed through Mani AI Gateway.";

    let reply = '';
    let modelUsed = 'llama-3.3-70b-versatile';

    try {
      const backendRes = await fetch('https://project-mani-c0t3.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: lastUserMessage,
          siteContext,
          history,
        }),
      });

      if (!backendRes.ok) {
        const errText = await backendRes.text();
        return logAndReturnError(
          502,
          `Bad Gateway: Mani AI Core service returned status ${backendRes.status}.`,
          startTime,
          apiKeyId,
          userAgent,
          ipAddress,
          endpoint,
          `Mani Core error: ${errText}`
        );
      }

      const backendData = await backendRes.json();
      if (!backendData.success) {
        return logAndReturnError(
          502,
          `Bad Gateway: Mani AI Core service failed to process request.`,
          startTime,
          apiKeyId,
          userAgent,
          ipAddress,
          endpoint,
          `Mani Core success field is false: ${JSON.stringify(backendData)}`
        );
      }

      reply = backendData.response;
      modelUsed = backendData.model || modelUsed;
    } catch (fetchError: any) {
      console.error('Error contacting Mani AI backend:', fetchError);
      return logAndReturnError(
        504,
        'Gateway Timeout: Unable to reach Mani AI Core service backend.',
        startTime,
        apiKeyId,
        userAgent,
        ipAddress,
        endpoint,
        fetchError.message
      );
    }

    const responseTime = Date.now() - startTime;

    // 7. Update stats and log request
    await db.apiKey.update({
      where: { id: apiKeyId },
      data: {
        requestCount: { increment: 1 },
        lastUsed: new Date(),
      },
    });

    await db.apiLog.create({
      data: {
        apiKeyId,
        endpoint,
        responseTime,
        statusCode: 200,
        ipAddress,
        userAgent,
      },
    });

    // 8. Return standard OpenAI completion response schema
    return NextResponse.json({
      id: `chatcmpl-${crypto.randomBytes(8).toString('hex')}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: model || modelUsed,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: reply,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: Math.round(lastUserMessage.length / 4) + 10,
        completion_tokens: Math.round(reply.length / 4) + 5,
        total_tokens: Math.round((lastUserMessage.length + reply.length) / 4) + 15,
      },
    });
  } catch (error: any) {
    console.error('Gateway process exception:', error);
    const apiKeyId = apiKeyRecord?.id || null;
    return logAndReturnError(
      500,
      'Internal Server Error: An unexpected gateway error occurred.',
      startTime,
      apiKeyId,
      userAgent,
      ipAddress,
      endpoint,
      error.message
    );
  }
}
