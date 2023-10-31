import { gql } from '@__generated__';

export const GET_CATEGORY_FORM = gql(`
  #graphql
  query GetCategoryForm($id: String!) {
    categoryForm(id: $id) {
      name
      categoryItemId
      serviceId
      categoryItemOptions {
        name
        value
      }
      serviceOptions {
        name
        value
      }
    }
  }
`);
