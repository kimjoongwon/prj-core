'use client'; // Error components must be Client Components

import { Spinner } from '@nextui-org/react';
import { useEffect } from 'react';

export default function Error({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Spinner />
    </div>
  );
}
