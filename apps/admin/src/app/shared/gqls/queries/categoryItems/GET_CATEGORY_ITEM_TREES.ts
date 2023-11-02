import { gql } from '@__generated__';

export const GET_CATEGORY_ITEM_TREES = gql(`#graphql
  query GetCategoryItemTrees($parentIds: [String!]) {
    categoryItemTrees(parentIds: $parentIds) {
      id
      name
      parentId
      createdAt
      updatedAt
      deletedAt
    }
  }
`);
