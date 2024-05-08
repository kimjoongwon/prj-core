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
import { useCategoriesPage } from './_hooks';
import { v4 } from 'uuid';
import { isEmpty } from 'lodash-es';

const CategoriesPage = observer(() => {
  const {
    onClickCard,
    onClickCreate,
    onClickDelete,
    categoriesGroupedByParentId,
    relatedCategoryIds,
  } = useCategoriesPage();

  console.log('relatedCategoryIds', relatedCategoryIds);

  return (
    <VStack className="w-full p-4 border-1">
      {isEmpty(categoriesGroupedByParentId) && (
        <HStack className="flex-grow-0 basis-16 items-center justify-end px-2">
          <Button onClick={() => onClickCreate()}>생성</Button>
        </HStack>
      )}
      <List
        horizontal
        data={relatedCategoryIds}
        renderItem={categoryId => {
          return (
            <List
              key={v4()}
              placeholder={<Placeholder />}
              data={categoriesGroupedByParentId?.[categoryId] || []}
              renderItem={category => (
                <CategoryCard
                  key={v4()}
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
