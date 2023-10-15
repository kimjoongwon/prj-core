---
to: src/app/admin/(dashboard)/<%= h.inflection.pluralize(name) %>/loading.tsx
unless_exists: true
---
import { DashboardSkeleton } from '@skeletons';

export default function Loading() {
  return <DashboardSkeleton />;
}
