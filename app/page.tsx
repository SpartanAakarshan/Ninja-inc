'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';

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
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center gap-12 w-full">
        <Image
          src="/ninja-image.PNG"
          alt="Ninja Logo"
          width={250}
          height={250}
          priority
        />
        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-12 py-4 bg-white text-black text-xl font-bold rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Joining...' : 'Join'}
            </button>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </form>
        ) : (
          <div className="p-4 bg-white/10 text-white rounded-full">
            <p className="text-lg font-medium">
              Thank you for joining!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
