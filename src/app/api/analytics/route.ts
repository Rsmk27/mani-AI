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

export async function GET() {
  try {
    const payload = await getAuthPayload();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch user's API keys
    const keys = await db.apiKey.findMany({
      where: { userId: payload.userId },
      select: { id: true, status: true, requestCount: true },
    });
    const keyIds = keys.map((k) => k.id);
    const activeKeysCount = keys.filter((k) => k.status === 'ACTIVE').length;

    // 2. Fetch logs for these keys
    const logs = await db.apiLog.findMany({
      where: { apiKeyId: { in: keyIds } },
      select: { statusCode: true, responseTime: true, timestamp: true },
    });

    const totalRequests = logs.length;
    
    // Calculate success rate (status codes < 400)
    const successfulRequests = logs.filter((l) => l.statusCode < 400).length;
    const successRate = totalRequests > 0 
      ? Math.round((successfulRequests / totalRequests) * 100) 
      : 100;

    // Calculate average response time
    const averageLatency = totalRequests > 0
      ? Math.round(logs.reduce((sum, l) => sum + l.responseTime, 0) / totalRequests)
      : 0;

    // 3. Generate chart trend data for the last 7 days
    const trendMap = new Map<string, { date: string; requests: number; errors: number }>();
    
    // Pre-fill last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      trendMap.set(dateString, { date: dateString, requests: 0, errors: 0 });
    }

    // Populate trend from logs
    logs.forEach((log) => {
      const dateString = log.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (trendMap.has(dateString)) {
        const dayData = trendMap.get(dateString)!;
        dayData.requests += 1;
        if (log.statusCode >= 400) {
          dayData.errors += 1;
        }
      }
    });

    const chartData = Array.from(trendMap.values());

    return NextResponse.json({
      stats: {
        totalRequests,
        activeKeys: activeKeysCount,
        successRate,
        averageLatency,
      },
      chartData,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
