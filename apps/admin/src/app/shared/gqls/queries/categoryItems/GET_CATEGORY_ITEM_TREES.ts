import { gql } from '@__generated__';

export const GET_CATEGORY_ITEM_TREES = gql(`#graphql
  query GetCategoryItemTrees {
    categoryItemTrees {
      id
      name
      tag
      ancestorIds
      parentId
      createdAt
      updatedAt
      deletedAt
    }
  }
`);
