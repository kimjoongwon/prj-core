'use client';

import { ButtonProps } from '@nextui-org/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  CategoryDto,
  CategoryForm,
  CreateCategoryDto,
  FormLayout,
} from '@shared/frontend';

import { usePage } from './_hooks/usePage';

const CategoryDetailPage = observer(() => {
  const {
    state,
    handlers: { onClickCancel, onClickSave },
  } = usePage();

  const leftButtons: ButtonProps[] = [
    {
      onClick: onClickCancel,
      children: '취소',
    },
  ];

  const rightButtons: ButtonProps[] = [
    {
      children: '저장',
      onClick: onClickSave,
    },
  ];

  return (
    <FormLayout
      title="카테고리"
      leftButtons={leftButtons}
      rightButtons={rightButtons}
    >
      <CategoryForm type="create" state={state.category!} />
    </FormLayout>
  );
});

export default CategoryDetailPage;
