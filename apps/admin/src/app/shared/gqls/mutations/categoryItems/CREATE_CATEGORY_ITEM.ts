import { gql } from '@__generated__';

export const CREATE_CATEGORY_ITEM = gql(`
  mutation CreateCategoryItem($createCategoryItemInput: CreateCategoryItemInput!) {
    createCategoryItem(createCategoryItemInput: $createCategoryItemInput) {
      id
      name
      parentId
    }
  }
`);
