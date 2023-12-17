'use client';

import { usePathname } from 'next/navigation';

export default function Loading() {
  const pathname = usePathname();

  if (pathname.includes('edit')) {
    return null;
  }
  return <div>loading</div>;
}
