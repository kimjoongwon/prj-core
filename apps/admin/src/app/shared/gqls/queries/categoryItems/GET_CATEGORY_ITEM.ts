import { gql } from '@__generated__';

export const GET_CATEGORY_ITEM = gql(`
  #graphql
  query GetCategoryItem ($id: String!){
    categoryItem (id: $id) {
      id
      name
      parentId
    }
  }
`);
