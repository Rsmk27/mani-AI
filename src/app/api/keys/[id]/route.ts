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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getAuthPayload();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, status, rateLimit } = await request.json();

    // Verify key ownership
    const existingKey = await db.apiKey.findUnique({
      where: { id },
    });

    if (!existingKey || existingKey.userId !== payload.userId) {
      return NextResponse.json({ error: 'Key not found' }, { status: 404 });
    }

    const updatedKey = await db.apiKey.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(status !== undefined && { status }),
        ...(rateLimit !== undefined && { rateLimit: parseInt(rateLimit, 10) }),
      },
    });

    return NextResponse.json({ apiKey: updatedKey });
  } catch (error) {
    console.error('Update key error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getAuthPayload();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify key ownership
    const existingKey = await db.apiKey.findUnique({
      where: { id },
    });

    if (!existingKey || existingKey.userId !== payload.userId) {
      return NextResponse.json({ error: 'Key not found' }, { status: 404 });
    }

    await db.apiKey.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete key error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
