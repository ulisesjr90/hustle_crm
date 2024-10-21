import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all leads, including owner info
    const leads = await prisma.lead.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        owner: {
          select: { name: true },
        },
        assignedTo: {
          select: { name: true }, // If you want to include who the lead is assigned to
        },
      },
    });

    return new Response(JSON.stringify(leads), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return new Response(JSON.stringify({ error: 'Error fetching leads' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    // Parse the incoming request
    const data = await req.json();

    // Perform basic validation (you can enhance this as needed)
    if (!data.leadName || !data.address || !data.ownerId) {
      return new Response(
        JSON.stringify({ error: 'Lead name, address, and owner are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new lead
    const newLead = await prisma.lead.create({
      data: {
        leadName: data.leadName,
        address: data.address,
        phone: data.phone || null,
        email: data.email || null,
        currentStatus: data.currentStatus || 'New',
        priority: data.priority || 'None',
        ownerId: data.ownerId,
        assignedToId: data.assignedToId || data.ownerId, // Default to owner if not assigned
        sharedWithId: data.sharedWithId || null, // Optional, might not always be set
        insulator: data.insulator || false,
        inShopSince: data.inShopSince || null,
        notes: data.notes || null,
      },
    });

    // Return the newly created lead
    return new Response(JSON.stringify(newLead), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return new Response(JSON.stringify({ error: 'Error creating lead' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
