import { gql } from '@__generated__';

export const UPDATE_SERVICE = gql(`
  mutation UpdateService($updateServiceInput: UpdateServiceInput!) {
    updateService(updateServiceInput: $updateServiceInput) {
      id
      name
    }
  }
`);
