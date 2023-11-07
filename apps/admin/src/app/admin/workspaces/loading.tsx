'use client';

import { DashboardSkeleton } from '@skeletons';
import { usePathname } from 'next/navigation';

export default function Loading() {
  const pathname = usePathname();
  const isEdit = pathname.includes('/edit');

  return isEdit ? null : <DashboardSkeleton />;
}
