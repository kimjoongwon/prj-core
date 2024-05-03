'use client';

import { Spinner } from '@nextui-org/react';
import { Text, FormLayout } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { useCategoryPage } from './_hooks';

const CategoryPage = observer(() => {
  const { leftButtons, rightButtons, isLoading, category } = useCategoryPage();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <FormLayout
      title="카테고리"
      leftButtons={leftButtons}
      rightButtons={rightButtons}
    >
      <Text>{category?.name}</Text>
    </FormLayout>
  );
});

export default CategoryPage;
