import prisma from '@/lib/prisma'; // Make sure Prisma is correctly set up
import { auth } from 'firebase-admin'; // Admin SDK for Firebase

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { uid, mapPreference, theme, newEmail, newPassword, syncCalendar, reminderTime } = req.body;

    try {
      // 1. Update Firebase user email and password if provided
      if (newEmail || newPassword) {
        const user = await auth().getUser(uid);
        if (newEmail) {
          await auth().updateUser(uid, { email: newEmail });
        }
        if (newPassword) {
          await auth().updateUser(uid, { password: newPassword });
        }
      }

      // 2. Update user settings in MySQL
      const updatedUser = await prisma.userPreference.update({
        where: { userId: uid },
        data: {
          mapPreference,
          theme,
          syncCalendar,
          reminderTime,
        },
      });

      res.status(200).json({ message: 'Settings updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating user settings:', error);
      res.status(500).json({ error: 'Error updating settings' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
