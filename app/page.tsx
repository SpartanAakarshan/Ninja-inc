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
  const [showEmailInput, setShowEmailInput] = useState(false);

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
    <main className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-full h-screen flex flex-col items-center justify-center bg-black">
        <Image
          src="/ninja-image.PNG"
          alt="Ninja Logo"
          width={500}
          height={500}
          className="mx-auto"
          priority
        />
        <div className="mt-0 flex flex-col items-center justify-center w-full">
          {!isSubmitted ? (
            <>
              {!showEmailInput ? (
                <button
                  type="button"
                  onClick={() => setShowEmailInput(true)}
                  className="px-12 py-4 bg-white text-black text-xl font-bold rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 mt-1"
                >
                  Join
                </button>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center space-y-2 mt-4 w-full max-w-xs">
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-2 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 w-full"
                  >
                    {isLoading ? 'Joining...' : 'Submit'}
                  </button>
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}
                </form>
              )}
            </>
          ) : (
            <div className="p-4 bg-white/10 text-white rounded-full mt-4">
              <p className="text-lg font-medium">
                Thank you for joining!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
