---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/[<%= name %>Id]/edit/hooks/useMutations.ts
---
import {
  useCoCRouter,
  useCreate<%= Name %>,
  useUpdate<%= Name %>,
} from '@hooks';

export const useMutations = () => {
  const router = useCoCRouter();
  return {
    create<%= Name %>: useCreate<%= Name %>({
      onCompleted: () => {
        router.back();
      },
    }),
    update<%= Name %>: useUpdate<%= Name %>({
      onCompleted: () => {
        router.back();
      },
    }),
  };
};
