import { Button as BaseButton, APIManager } from '@shared/frontend';
import { ButtonBuilder as ButtonBuilderProps } from '@shared/types';
import { PathUtil } from '@shared/utils';
import { isAxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cloneDeep } from 'lodash-es';
import { useQueryClient } from '@tanstack/react-query';
import { usePageState } from '../Page/PageBuilder';

interface ButtonProps {
  row?: unknown & { id: string };
  buttonBuilder: ButtonBuilderProps;
}

export const ButtonBuilder = observer((props: ButtonProps) => {
  const { buttonBuilder, row } = props;
  const state = usePageState();
  const params = useParams();
  const serviceId = window.location.pathname.split('/')[4];
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const makeContext = (): any => {
    return {
      rowId: row?.id,
      serviceId,
      ...params,
    };
  };

  const onPress = async () => {
    const button = cloneDeep(buttonBuilder);
    const context = makeContext();
    const args = [];
    let formData = cloneDeep(state?.form?.data);
    let resourceId = null;

    if (button.mutation?.idMapper) {
      resourceId = context?.[button.mutation?.idMapper];
      args.push(resourceId);
    }

    if (button.mutation?.mapper) {
      Object.keys(button.mutation.mapper).map(key => {
        const value = context?.[key];
        formData = {
          ...formData,
          [button.mutation?.mapper[key]]: value,
        };
      });

      if (button.mutation.hasServiceId) {
        formData = {
          ...formData,
          serviceId,
        };
      }

      args.push(formData);
    }

    const navigator = button.navigator;

    try {
      if (button.mutation?.name) {
        console.log('formData', formData);
        console.log('args', args);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await APIManager[button.mutation.name].apply(null, args);
        queryClient?.refetchQueries();
      }

      if (button.alert) {
        toast(button.alert?.message);
      }

      if (navigator) {
        const resourceId = row?.id;
        if (navigator.params) {
          if (navigator.hasParentId) {
            navigator.params.parentId = resourceId;
          }

          if (navigator.hasResourceId) {
            navigator.params.resourceId = resourceId;
          }
        }

        const pathname = PathUtil.getUrlWithParamsAndQueryString(
          navigator.pathname,
          navigator.params,
        );

        queryClient.refetchQueries();

        if (pathname === '..') {
          navigate(-1);
          return;
        }

        navigate(pathname);
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast(error.response?.data?.message || '');
      }
    }
  };

  return (
    <BaseButton onPress={onPress} color={buttonBuilder?.color || 'primary'}>
      {buttonBuilder?.name}
    </BaseButton>
  );
});
