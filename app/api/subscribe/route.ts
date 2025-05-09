import { NextResponse } from 'next/server';
import { z } from 'zod';
import { neon } from '@neondatabase/serverless';

const emailSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    // Log the request
    console.log('Received subscription request');

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

    // Parse the request body
    const body = await request.json();
    console.log('Request body:', body);

    // Validate the email
    const { email } = emailSchema.parse(body);
    console.log('Validated email:', email);

    try {
      // Create table if it doesn't exist
      console.log('Creating table if not exists...');
      await sql`
        CREATE TABLE IF NOT EXISTS subscribers (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log('Table creation completed');

      // Insert the email
      console.log('Inserting email...');
      await sql`
        INSERT INTO subscribers (email)
        VALUES (${email})
        ON CONFLICT (email) DO NOTHING;
      `;
      console.log('Email inserted successfully');

      return NextResponse.json(
        { message: 'Successfully subscribed!' },
        { status: 200 }
      );
    } catch (dbError: unknown) {
      console.error('Database error:', dbError);
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error';
      return NextResponse.json(
        { error: 'Database operation failed', details: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Subscription error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Log the full error for debugging
    console.error('Full error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { error: 'An error occurred while processing your subscription' },
      { status: 500 }
    );
  }
}
