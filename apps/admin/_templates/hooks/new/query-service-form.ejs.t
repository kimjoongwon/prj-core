---
to: src/app/shared/hooks/queries/<%= h.inflection.pluralize(name) %>/use<%= Name %>FormQuery.ts
---
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_<%= h.changeCase.upper(name) %>_FORM } from '@gqls';

export const use<%= Name %>FormQuery = (variables: Get<%= Name %>FormQueryVariables) => {
  return useSuspenseQuery(GET_<%= h.changeCase.upper(name) %>_FORM, {
    fetchPolicy: 'cache-and-network',
  });
};


