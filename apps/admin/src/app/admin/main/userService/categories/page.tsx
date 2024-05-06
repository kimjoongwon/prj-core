'use client';

import React from 'react';
import {
  Button,
  CategoryCard,
  HStack,
  List,
  Placeholder,
  VStack,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { uniqueId } from 'lodash-es';
import { useCategoriesPage } from './_hooks';

const CategoriesPage = observer(() => {
  const {
    onClickCard,
    onClickCreate,
    onClickDelete,
    categoriesGroupedByParentId,
    relatedCategoryIds,
  } = useCategoriesPage();

  return (
    <VStack className="w-full">
      <HStack>
        <Button onClick={() => onClickCreate()}>생성</Button>
      </HStack>
      <List
        horizontal
        data={relatedCategoryIds}
        renderItem={categoryId => {
          return (
            <List
              placeholder={<Placeholder />}
              key={uniqueId()}
              data={categoriesGroupedByParentId?.[categoryId] || []}
              renderItem={category => (
                <CategoryCard
                  key={uniqueId()}
                  category={category}
                  onClickCard={onClickCard}
                  onClickCreate={onClickCreate}
                  onClickDelete={onClickDelete}
                />
              )}
            />
          );
        }}
      />
    </VStack>
  );
});

export default CategoriesPage;
