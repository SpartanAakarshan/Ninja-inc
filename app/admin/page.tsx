'use client';

import { useEffect, useState } from 'react';

interface Subscriber {
  email: string;
  created_at: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
  type?: string;
}

export default function AdminPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorResponse | null>(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        console.log('Fetching subscribers...');
        const response = await fetch('/api/subscribers');
        const data = await response.json();
        
        if (response.ok) {
          console.log('Subscribers fetched successfully');
          setSubscribers(data.subscribers);
        } else {
          console.error('Error response:', data);
          setError(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError({
          error: 'An error occurred while fetching subscribers',
          details: err instanceof Error ? err.message : 'Unknown error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Loading subscribers...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Subscribers</h1>
            <div className="space-y-2">
              <p className="text-red-700 font-medium">{error.error}</p>
              {error.details && (
                <p className="text-red-600 text-sm">Details: {error.details}</p>
              )}
              {error.type && (
                <p className="text-red-600 text-sm">Type: {error.type}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Subscribers List</h1>
          <span className="text-sm text-gray-500">v1.0.2</span>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscribed At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.map((subscriber, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscriber.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 