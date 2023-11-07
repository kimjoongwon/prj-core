---
to: src/app/shared/hooks/mutations/<%= name %>s/useUpdate<%= Name %>.ts
---
import { useMutation } from '@apollo/client';
import { UPDATE_<%= h.changeCase.upper(name) %>, GET_<%= h.changeCase.upper(name) %>S } from '@gqls';
import { MutationOptions } from '@types';

export const useUpdate<%= Name %> = (options?: MutationOptions) => {
  return useMutation(UPDATE_<%= h.changeCase.upper(name) %>, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_<%= h.changeCase.upper(name) %>S, '<%= Name %>'],
  });
};

