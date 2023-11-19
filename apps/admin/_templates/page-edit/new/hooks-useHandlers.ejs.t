---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/[<%= name %>Id]/edit/hooks/useHandlers.ts
---
import { useCoCRouter } from '@hooks';
import { useMutations } from './useMutations';
import { useParams } from 'next/navigation';
import { useState } from './useState';

export const useHandlers = ({
  mutations,
  state,
}: {
  mutations: ReturnType<typeof useMutations>;
  state: ReturnType<typeof useState>;
}) => {
  const {
    create<%= Name %>: [create<%= Name %>],
    update<%= Name %>: [update<%= Name %>],
  } = mutations;  

  const router = useCoCRouter();
  const { <%= name %>Id } = useParams();

  const onClickSave = () => {
    if (<%= name %>Id === 'new') {
      create<%= Name %>({
        variables: {
          create<%= Name %>Input: state.form,
        },
      });
    } else {
      update<%= Name %>({
        variables: {
          update<%= Name %>Input: {
            id: <%= name %>Id as string,
            ...state.form,
          },
        },
      });
    }
  };

  const onClickCancel = () => {
    router.back();
  };

  return {
    onClickSave,
    onClickCancel,
  };
};

