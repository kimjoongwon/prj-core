'use client';

import React from 'react';
import { CategoryCard, Container, List } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { uniqueId } from 'lodash-es';
import { useCategoriesPage } from './_hooks';
import { categoriesPage } from './_state';

const CategoriesPage = observer(() => {
  const {
    onClickCard,
    onClickDetail,
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
          console.log('categoryId', categoryId);
          return (
            <List
              className="gap-2"
              key={categoryId}
              data={categoriesGroupedByParentId?.[categoryId] || []}
              renderItem={category => (
                <CategoryCard
                  key={uniqueId()}
                  selected={
                    categoriesPage.state.openedCategory.id === category.id
                  }
                  category={category}
                  onClickCard={onClickCard}
                  onClickDetail={onClickDetail}
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
