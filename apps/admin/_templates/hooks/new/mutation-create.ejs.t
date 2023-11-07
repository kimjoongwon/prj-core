---
to: src/app/shared/hooks/mutations/<%= name %>s/useCreate<%= Name %>.ts
---

import { useMutation } from '@apollo/client';
import { CREATE_<%= h.changeCase.upper(name) %>, GET_<%= h.changeCase.upper(name) %>S } from '@gqls';
import { MutationOptions } from '@types';

export const useCreate<%= Name %> = (options?: MutationOptions) => {
  return useMutation(CREATE_<%= h.changeCase.upper(name) %>, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_<%= h.changeCase.upper(name) %>S, '<%= Name %>'],
  });
};
