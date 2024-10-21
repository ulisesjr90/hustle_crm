import prisma from '@/lib/prisma';  // Assuming you have Prisma set up for MySQL

export default async function handler(req, res) {
  const { uid } = req.query;  // Get UID from the request

  try {
    const user = await prisma.user.findUnique({
      where: {
        uid: uid,  // Match the Firebase UID with MySQL UID
      },
      include: {
        preferences: true,  // Include user preferences
      },
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user from MySQL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
