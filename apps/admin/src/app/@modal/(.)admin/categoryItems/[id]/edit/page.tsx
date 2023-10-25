'use client';
import { CategoryItemForm } from '@components';
import { observer } from 'mobx-react-lite';
import { usePage } from '../../../../../admin/categoryItems/[id]/edit/_hooks';

function Page() {
  const {
    meta: {
      isEditMode,
      form: {
        state: { createCategoryItemInput, updateCategoryItemInput },
      },
    },
  } = usePage();
  return (
    <CategoryItemForm
      state={isEditMode ? updateCategoryItemInput : createCategoryItemInput}
    />
  );
}

export default observer(Page);
