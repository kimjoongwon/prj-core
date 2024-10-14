'use client';

import { Card } from '@mui/material';
import { Divider, Spacer } from '@nextui-org/react';
import { Button, ClassificationsTable, Meta, Text } from '@shared/frontend';
import { useCategoryPage } from './_hooks/useCategoryPage';

const CategoryPage = () => {
  const {
    queries: { category, service },
    handlers: { onClickCategoryAssignments },
  } = useCategoryPage();

  return (
    <Card variant="outlined" className="p-4 space-y-4">
      <Text variant="h3">{service?.label} 카테고리</Text>
      <Spacer y={8} />
      <Meta name={'카테고리 리'} value={category?.name || ''} />
      <Divider />
      <Button color="primary" onClick={onClickCategoryAssignments}>
        카테고리 할당
      </Button>
      <ClassificationsTable classifications={[]} />
    </Card>
  );
};

export default CategoryPage;
