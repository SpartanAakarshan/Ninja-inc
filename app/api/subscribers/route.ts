import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Initialize Neon client with environment variable
const sql = neon(process.env.NEON_DATABASE_URL || '');

export async function GET() {
  try {
    // Query all subscribers
    const result = await sql`
      SELECT email, created_at 
      FROM subscribers 
      ORDER BY created_at DESC;
    `;

    return NextResponse.json({ subscribers: result }, { status: 200 });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
} 