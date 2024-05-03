'use client';

import React from 'react';
import { CategoryCard, Container, List } from '@shared/frontend';
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
    <Container>
      <List
        className="gap-2"
        horizontal
        data={relatedCategoryIds}
        renderItem={categoryId => {
          return (
            <List
              className="gap-2"
              key={categoryId}
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
    </Container>
  );
});

export default CategoriesPage;
