'use client';
import { CategoryItemForm } from '@components';
import { usePage } from './_hooks';

export default function CategoryEditPage() {
  const {
    meta: { isEditMode, form },
  } = usePage();
  return (
    <CategoryItemForm
      state={
        isEditMode
          ? form.state.updateCategoryItemInput
          : form.state.createCategoryItemInput
      }
    />
  );
}
