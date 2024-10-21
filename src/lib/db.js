import prisma from './prisma';

// Function to get a user by email
export async function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

// Function to create a new user
export async function createUser(userData) {
  return prisma.user.create({
    data: userData,
  });
}

// Function to get all leads for a user
export async function getLeadsForUser(userId) {
  return prisma.lead.findMany({
    where: { ownerId: userId },
  });
}

// Add more database utility functions as needed
