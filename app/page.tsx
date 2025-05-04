'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to subscribe');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Subscription error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to <span className="text-primary">Ninja.inc</span>
        </h1>
        <p className="text-xl text-gray-600">
          The future of SaaS solutions is here. Join our waitlist to be the first to know when we launch.
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                {...register('email')}
                placeholder="Enter your email"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </form>
        ) : (
          <div className="mt-8 p-4 bg-green-100 text-green-700 rounded-md">
            <p className="text-lg font-medium">
              Thank you for joining our waitlist! We'll be in touch soon.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
