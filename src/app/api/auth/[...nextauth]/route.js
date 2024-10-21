// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';

export const GET = async (req) => {
  // Handle GET requests for NextAuth
  return NextAuth(req);
};

export const POST = async (req) => {
  // Handle POST requests for NextAuth
  return NextAuth(req);
};
