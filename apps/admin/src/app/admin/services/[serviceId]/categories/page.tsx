'use client';

import React, { useEffect } from 'react';
import { Spacer } from '@nextui-org/react';
import { Container, useGetCategories } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { state } from './state';
import { groupBy } from 'lodash-es';
import {
  CategoryCard,
  CategoryContainer,
  CategoryForm,
  CategorySection,
} from './_components';

function Page() {
  return <CategoriesPage />;
}

export default observer(Page);

export const CategoriesPage = observer(() => {
  const { data: queryData, isLoading, isFetching } = useGetCategories();
  const categories = queryData?.data || [];
  const ancestorIds = state.openedCategory?.ancestorIds || [];
  const categoryIds = ['null', ...ancestorIds, state.openedCategory.id];
  const categoriesGroupedByParentId = groupBy(state.categories, 'parentId');

  useEffect(() => {
    if (!isLoading) {
      state.categories = categories;
    }
  }, [isLoading, isFetching]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <CategoryForm />
      <Spacer y={2} />
      <CategoryContainer>
        {categoryIds?.map(categoryId => {
          return (
            <CategorySection>
              {categoriesGroupedByParentId?.[categoryId]?.map(category => {
                return <CategoryCard category={category} />;
              })}
            </CategorySection>
          );
        })}
      </CategoryContainer>
    </Container>
  );
});
