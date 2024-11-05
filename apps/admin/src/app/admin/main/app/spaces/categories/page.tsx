'use client';

import { observer } from 'mobx-react-lite';
import { CategoriesTable } from '@shared/frontend';
import { useCategoriesPage } from './_hooks/useCategoriesPage';

const CategoriesPage = observer(() => {
  const {
    state,
    queries: { categories, totalCount },
  } = useCategoriesPage();

  return (
    <CategoriesTable
      state={state}
      categories={categories}
      totalCount={totalCount}
    />
  );
});

export default CategoriesPage;
