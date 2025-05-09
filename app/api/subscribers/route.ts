import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    // Log the start of the request
    console.log('Starting to fetch subscribers...');
    
    // Check if database URL is configured
    if (!process.env.NEON_DATABASE_URL) {
      console.error('NEON_DATABASE_URL is not configured');
      return NextResponse.json(
        { error: 'Database configuration is missing' },
        { status: 500 }
      );
    }

    // Initialize database connection
    const sql = neon(process.env.NEON_DATABASE_URL);

    // Query all subscribers
    console.log('Executing database query...');
    const result = await sql`
      SELECT email, created_at 
      FROM subscribers 
      ORDER BY created_at DESC;
    `;
    console.log('Query executed successfully');

    return NextResponse.json({ subscribers: result }, { status: 200 });
  } catch (error: unknown) {
    // Enhanced error logging
    console.error('Detailed error in subscribers API:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined
    });

    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: 'Failed to fetch subscribers',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.name : 'Unknown'
      },
      { status: 500 }
    );
  }
} 