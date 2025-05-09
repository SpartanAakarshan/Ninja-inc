import { NextResponse } from 'next/server';
import { z } from 'zod';
import { neon } from '@neondatabase/serverless';

const emailSchema = z.object({
  email: z.string().email(),
});

// Initialize Neon client with environment variable
const sql = neon(process.env.NEON_DATABASE_URL || 'postgresql://neondb_owner:npg_8F2BRTaYhAVk@ep-square-bonus-a4ydl9a1-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require');

export async function POST(request: Request) {
  try {
    // Log the request
    console.log('Received subscription request');

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
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database operation failed', details: dbError.message },
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
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      { error: 'An error occurred while processing your subscription' },
      { status: 500 }
    );
  }
}
