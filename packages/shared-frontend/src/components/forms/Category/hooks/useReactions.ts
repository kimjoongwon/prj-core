import { reaction } from 'mobx';
import { useEffect } from 'react';
import { CategoryFormProps } from '..';
import { getCategoryById } from '../../../../apis';

export const useReactions = (props: CategoryFormProps) => {
  const { state } = props;

  useEffect(() => {
    const disposer = reaction(
      () => state.parentId,
      async parentId => {
        const res = await getCategoryById(parentId);
        state.ancestorIds = res.data.ancestorIds;
        state.ancestorIds.push(parentId);
      },
    );

    return disposer;
  }, []);
};
