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
        let errorMessage = 'Failed to subscribe';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setIsSubmitted(true);
    } catch (error) {
      console.error('Subscription error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Ninja.inc
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            v1.0.3 - CI/CD Enabled
          </p>
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/ninja-image.PNG"
              alt="Ninja Logo"
              width={500}
              height={500}
              className="mx-auto mb-8"
              priority
            />
            <div className="mt-4">
              {!isSubmitted ? (
                <>
                  {!showEmailInput ? (
                    <button
                      type="button"
                      onClick={() => setShowEmailInput(true)}
                      className="px-12 py-4 bg-white text-black text-xl font-bold rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Join
                    </button>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center space-y-4 max-w-md mx-auto">
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="Enter your email"
                        className="px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <div className="p-4 bg-white/10 rounded-full">
                  <p className="text-lg font-medium">
                    Thank you for joining!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
