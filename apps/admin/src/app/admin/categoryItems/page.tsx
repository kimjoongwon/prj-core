'use client';

import { Button } from '@coc/ui';
import { useCategoryItemsPage } from './hooks';
import { CategoryItemGroupSection } from './components';

export default function Page() {
  const { categoryItemGroupSection } = useCategoryItemsPage();
  return (
    <div className="flex">
      <CategoryItemGroupSection
        categoryItemGroupSection={categoryItemGroupSection}
        depth={0}
      />
      <CategoryItemGroupSection
        categoryItemGroupSection={categoryItemGroupSection}
        depth={1}
      />
      <CategoryItemGroupSection
        categoryItemGroupSection={categoryItemGroupSection}
        depth={2}
      />
    </div>
  );
}
