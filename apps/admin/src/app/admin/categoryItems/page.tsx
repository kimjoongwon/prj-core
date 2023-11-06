'use client';

import { CategoryItemGroupSection } from './components';

export default function Page() {
  return (
    <div className="flex gap-2">
      <CategoryItemGroupSection depth={0} />
      <CategoryItemGroupSection depth={1} />
      <CategoryItemGroupSection depth={2} />
    </div>
  );
}
