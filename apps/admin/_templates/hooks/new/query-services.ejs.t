---
to: src/app/shared/hooks/queries/<%= h.inflection.pluralize(name) %>/use<%= Name %>sQuery.ts
---
import { Get<%= Name %>sQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client';
import { GET_<%= h.changeCase.upper(name) %>S } from '@gqls';

export const use<%= Name %>sQuery = (variables: Get<%= Name %>sQueryVariables) => {
  return useSuspenseQuery(GET_<%= h.inflection.pluralize(name).toUpperCase() %>, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};