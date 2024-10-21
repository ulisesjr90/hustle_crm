// src/app/api/user/get/route.js
export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url); // Parse query parameters from the URL
      const userId = searchParams.get('userId'); // Assuming you're passing userId as a query param
  
      // Logic to fetch the user from the database
      const user = await getUserFromDatabase(userId); // Placeholder function for your database logic
  
      if (user) {
        return new Response(JSON.stringify(user), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404, // HTTP status for "Not Found"
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Error fetching user' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  
  // Placeholder function for fetching the user from the database
  async function getUserFromDatabase(userId) {
    // Add your logic to fetch the user data from the database
    return { id: userId, name: 'John Doe' }; // Example return with mock data
  }
  