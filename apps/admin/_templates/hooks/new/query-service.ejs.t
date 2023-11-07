---
to: src/app/shared/hooks/queries/<%= h.inflection.pluralize(name) %>/use<%= Name %>Query.ts
---
import { Get<%= Name %>QueryVariables } from '@__generated__/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client';
import { GET_<%= h.changeCase.upper(name) %> } from '@gqls';

export const use<%= Name %>Query = (variables: Get<%= Name %>QueryVariables) => {
  return useSuspenseQuery(
    GET_<%= h.changeCase.upper(name) %>,
    variables.id === 'new' ? skipToken : { variables },
  );
};
