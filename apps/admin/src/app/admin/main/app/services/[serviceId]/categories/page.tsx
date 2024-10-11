'use client';

import { observer } from 'mobx-react-lite';
import { CategoriesTable } from '@shared/frontend';
import { useCategoriesPage } from './_hooks/useCategoriesPage';

const CategoriesPage = observer(() => {
  const {
    state,
    queries: { categories, totalCount },
  } = useCategoriesPage();
  console.log('CategoriesPage');
  return (
    <CategoriesTable
      categories={categories}
      totalCount={totalCount}
      state={state}
    />
  );
});

export default CategoriesPage;
