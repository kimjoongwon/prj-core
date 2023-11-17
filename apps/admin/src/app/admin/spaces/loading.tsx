'use client';

import { DashboardSkeleton } from '@skeletons';
import { usePathname } from 'next/navigation';

export default function Loading() {
  const pathname = usePathname();

  if (pathname.includes('edit')) {
    return null;
  }
  return <DashboardSkeleton />;
}
