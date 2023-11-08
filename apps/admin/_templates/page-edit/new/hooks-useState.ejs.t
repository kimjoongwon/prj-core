---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/[<%= name %>Id]/edit/hooks/useState.ts
---

import { <%= Name %>Form } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';

export const useState = ({
  queries,
}: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const { <%= name %>FormQuery } = queries;
  const <%= name %>Form = <%= name %>FormQuery?.data?.<%= name %>Form;

  const formState = useLocalObservable<<%= Name %>Form>(() => <%= name %>Form);
  return { form: formState };
};
