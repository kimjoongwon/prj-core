'use client';

import { Card } from '@mui/material';
import { Divider, Spacer } from '@nextui-org/react';
import { Button, ClassificationsTable, Meta, Text } from '@shared/frontend';
import { useCategoryPage } from './_hooks/useCategoryPage';

const CategoryPage = () => {
  const {
    queries: { category, service, ancestorCategories, classifications },
    handlers: { onClickCategoryAssignments },
  } = useCategoryPage();

  const ancestorCategoriesNames = ancestorCategories
    .map(c => c.name)
    .join(' > ');

  return (
    <Card variant="outlined" className="p-4 space-y-4">
      <Text variant="h3">{service?.label} 카테고리</Text>
      <Spacer y={8} />
      <Meta name={'카테고리명'} value={category?.name || ''} />
      <Divider />
      <Meta name={'상위 카테고리'} value={ancestorCategoriesNames} />
      <Divider />
      <Button color="primary" onClick={onClickCategoryAssignments}>
        카테고리 할당
      </Button>
      <ClassificationsTable classifications={classifications} />
    </Card>
  );
};

export default CategoryPage;
