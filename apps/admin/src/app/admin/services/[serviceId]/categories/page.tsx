'use client';

import React from 'react';
import { CategoryCard, Container, List } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { useCategoriesPage } from './hook';
import { uniqueId } from 'lodash-es';

function Page() {
  return <CategoriesPage />;
}

export default observer(Page);

export const CategoriesPage = observer(() => {
  const {
    state,
    handlers: { onClickCard, onClickDetail },
  } = useCategoriesPage();

  return (
    <Container>
      <List
        horizontal
        data={state.categoryIds}
        renderItem={categoryId => (
          <List
            key={categoryId}
            data={state.categoriesGroupedByParentId?.[categoryId] || []}
            renderItem={category => (
              <CategoryCard
                key={uniqueId()}
                category={category}
                onClickCard={onClickCard}
                onClickDetail={onClickDetail}
              />
            )}
          />
        )}
      />
    </Container>
  );
});
