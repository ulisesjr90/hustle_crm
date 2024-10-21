import prisma from '@/lib/prisma';

export async function POST(req, res) {
  try {
    const { uid, newPlan } = await req.json(); // Destructure uid and newPlan from the request body

    // Validate incoming data
    if (!uid || !newPlan) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Update the user's plan (stored in the role field)
    const updatedUser = await prisma.user.update({
      where: { uid },
      data: { role: newPlan }, // Assuming 'role' is where the plan is stored (e.g., "Solo", "Sales Manager")
    });

    return res.status(200).json({ message: 'Plan updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating plan:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
