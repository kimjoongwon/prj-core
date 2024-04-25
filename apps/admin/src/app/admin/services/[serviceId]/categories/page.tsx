'use client';

import React from 'react';
import { CategoryCard, Container, HStack, List } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { useCategoriesPage } from './hook';

function Page() {
  return <CategoriesPage />;
}

export default observer(Page);

export const CategoriesPage = observer(() => {
  const {
    state,
    handlers: { onClickCard },
  } = useCategoriesPage();

  return (
    <Container>
      <List
        horizontal
        data={state.categoryIds}
        renderItem={categoryId => (
          <HStack className="gap-2">
            <List
              data={state.categoriesGroupedByParentId?.[categoryId] || []}
              renderItem={category => (
                <CategoryCard category={category} onClick={onClickCard} />
              )}
            />
          </HStack>
        )}
      />
    </Container>
  );
});
