import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import crypto from 'crypto';

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

    const keys = await db.apiKey.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ keys });
  } catch (error) {
    console.error('List keys error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getAuthPayload();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, rateLimit } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Key name is required' }, { status: 400 });
    }

    // Generate secure API key: mani_live_ + 48 hex characters
    const secretToken = crypto.randomBytes(24).toString('hex');
    const rawKey = `mani_live_${secretToken}`;
    
    // Hash key with SHA-256 for secure DB storage
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    
    // Display metadata (prefix and censored string)
    const keyPrefix = rawKey.substring(0, 16); // e.g. "mani_live_a1b2c3"
    const keyDisplay = `${keyPrefix}...${rawKey.substring(rawKey.length - 4)}`;

    const apiKey = await db.apiKey.create({
      data: {
        userId: payload.userId,
        name,
        keyHash,
        keyPrefix,
        keyDisplay,
        rateLimit: rateLimit ? parseInt(rateLimit, 10) : 100,
      },
    });

    return NextResponse.json({
      apiKey: {
        ...apiKey,
        rawKey, // Returned exactly once upon generation
      }
    });
  } catch (error) {
    console.error('Create key error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
