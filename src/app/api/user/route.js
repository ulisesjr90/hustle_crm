import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');

  if (!uid) {
    return new Response(JSON.stringify({ error: 'UID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { uid: uid },
      select: { id: true, name: true, email: true, role: true }
    });

    if (user) {
      return new Response(JSON.stringify(user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response(JSON.stringify({ error: 'Error fetching user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}