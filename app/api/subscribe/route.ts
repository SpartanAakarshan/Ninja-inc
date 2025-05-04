import { NextResponse } from 'next/server';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = emailSchema.parse(body);

    // Here you would typically:
    // 1. Store the email in your database
    // 2. Send a confirmation email
    // 3. Add to your email marketing service

    // For now, we'll just log it and return success
    console.log('New subscription:', email);

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while processing your subscription' },
      { status: 500 }
    );
  }
}
