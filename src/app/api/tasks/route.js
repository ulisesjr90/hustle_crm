import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { dueDate: 'asc' },
      where: { completed: false },
      include: {
        lead: {
          select: { leadName: true }
        }
      }
    });
    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return new Response(JSON.stringify({ error: 'Error fetching tasks' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const newTask = await prisma.task.create({
      data: {
        description: data.description,
        dueDate: new Date(data.dueDate),
        leadId: data.leadId,
        userId: data.userId,
        // Add other fields as necessary
      }
    });
    return new Response(JSON.stringify(newTask), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return new Response(JSON.stringify({ error: 'Error creating task' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}