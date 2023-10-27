import { gql } from '@__generated__';

export const CREATE_SERVICE = gql(`
  mutation CreateService($createServiceInput: CreateServiceInput!) {
    createService(createServiceInput: $createServiceInput) {
      id
      name
    }
  }
`);
