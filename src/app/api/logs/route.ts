import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

async function getAuthPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';
  if (!token) return null;
  return verifyJWT(token);
}

export async function GET(request: Request) {
  try {
    const payload = await getAuthPayload();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const apiKeyId = searchParams.get('apiKeyId') || undefined;
    const statusCodeStr = searchParams.get('statusCode') || undefined;
    const endpoint = searchParams.get('endpoint') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    const statusCode = statusCodeStr ? parseInt(statusCodeStr, 10) : undefined;

    // Get list of key IDs belonging to this user
    const userKeys = await db.apiKey.findMany({
      where: { userId: payload.userId },
      select: { id: true },
    });
    const userKeyIds = userKeys.map((k: { id: string }) => k.id);

    // Build query conditions
    const where: any = {
      apiKeyId: { in: userKeyIds },
    };

    if (apiKeyId && userKeyIds.includes(apiKeyId)) {
      where.apiKeyId = apiKeyId;
    }

    if (statusCode !== undefined && !isNaN(statusCode)) {
      where.statusCode = statusCode;
    }

    if (endpoint) {
      where.endpoint = { contains: endpoint };
    }

    const logs = await db.apiLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: skip,
      include: {
        apiKey: {
          select: {
            name: true,
            keyDisplay: true,
          },
        },
      },
    });

    const totalLogs = await db.apiLog.count({ where });

    return NextResponse.json({
      logs,
      pagination: {
        total: totalLogs,
        page,
        limit,
        totalPages: Math.ceil(totalLogs / limit),
      },
    });
  } catch (error) {
    console.error('List logs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
