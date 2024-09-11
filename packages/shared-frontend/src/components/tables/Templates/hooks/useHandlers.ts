import { useState } from './useState';
import { useContext } from './useContext';
import { toJS } from 'mobx';
import { galaxy } from '../../../../providers/App';
import { useMutations } from './useMutations';
import { revalidatePathGetTemplatesByQuery } from '../../../../actions';

export const useHandlers = (props: {
  state: ReturnType<typeof useState>;
  context: ReturnType<typeof useContext>;
  data: ReturnType<typeof useMutations>;
}) => {
  const {
    state,
    context: {
      params: { serviceId },
    },
    data: { removeTemplates },
  } = props;

  const onClickCreate = () => {
    galaxy.router.push({
      url: '/admin/main/services/:serviceId/templates/:templateId/edit',
      params: {
        serviceId,
        templateId: 'new',
      },
    });
  };

  const onClickRemove = () => {
    const templateIds = toJS(state.selectedKeys);
    removeTemplates.mutateAsync({ data: templateIds });

    revalidatePathGetTemplatesByQuery();
  };

  return {
    onClickCreate,
    onClickRemove,
  };
};
