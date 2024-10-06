'use client';

import { observer } from 'mobx-react-lite';
import { usePage } from './_hooks/usePage';
import { CategoriesTable } from '@shared/frontend';

const CategoriesPage = observer(() => {
  const {
    meta: { onClickCard, onClickCreate, onClickDelete, onClickDetail },
    categories,
  } = usePage();

  return <CategoriesTable categories={categories} />;
});

export default CategoriesPage;
