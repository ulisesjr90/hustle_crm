import prisma from '@/lib/prisma'; // Make sure Prisma is set up correctly

export async function DELETE(req) {
  try {
    const { userId } = await req.json(); // Extract user ID from request body

    // Perform a soft delete by setting `deletedAt` to the current timestamp
    const deletedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        deletedAt: new Date(), // Set the deletedAt timestamp
      },
    });

    return new Response(JSON.stringify({ success: true, deletedUser }), {
      status: 200, // HTTP status for "OK"
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ error: 'Error deleting user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
