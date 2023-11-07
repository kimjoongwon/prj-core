---
to: src/app/shared/hooks/mutations/<%= name %>s/useDelete<%= Name %>.ts
---

import { useMutation } from '@apollo/client';
import { DELETE_<%= h.changeCase.upper(name) %>, GET_<%= h.changeCase.upper(name) %>S } from '@gqls';
import { MutationOptions } from '@types';

export const useDelete<%= Name %> = (options?: MutationOptions) => {
  return useMutation(DELETE_<%= h.changeCase.upper(name) %>, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_<%= h.changeCase.upper(name) %>S, '<%= Name %>'],
  });
};
