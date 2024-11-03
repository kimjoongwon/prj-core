'use client'; // Error boundaries must be Client Components

import { galaxy } from '@shared/frontend';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (error.message.includes('401')) {
      galaxy.router.push({
        url: '/admin/auth/login',
      });
    }
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
