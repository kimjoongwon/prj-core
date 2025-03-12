import { useParams } from 'next/navigation';
import { useHandlers } from './useHandlers';
import { useState } from './useState';
import { PageTypeParams } from '@shared/types';

export const useGymEditPage = () => {
  const state = useState();
  const { type } = useParams<PageTypeParams>();
  const { onPressSave, onPressList } = useHandlers({
    state,
  });

  return {
    read: type === 'read',
    form: {
      state: state.form,
      onPressSave,
      onPressList,
    },
  };
};
