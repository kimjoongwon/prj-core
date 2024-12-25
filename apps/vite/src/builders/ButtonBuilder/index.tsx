import { Button as BaseButton, APIManager } from '@shared/frontend';
import { ButtonBuilder as ButtonBuilderProps } from '@shared/types';
import { PathUtil } from '@shared/utils';
import { isAxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormState } from '../FormBuilder';
import { toast } from 'react-toastify';
import { cloneDeep } from 'lodash-es';
import { useQueryClient } from '@tanstack/react-query';

interface ButtonProps {
  row?: unknown & { id: string };
  buttonBuilder: ButtonBuilderProps;
}

export const ButtonBuilder = observer((props: ButtonProps) => {
  const { buttonBuilder, row } = props;
  const state = useFormState()!;
  const params = useParams();
  const serviceId = window.location.pathname.split('/')[4];
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onPress = async () => {
    const payload = cloneDeep(state?.payload);
    const button = cloneDeep(buttonBuilder);
    const args = [];
    if (button?.mutation?.hasResourceId) {
      args.push(params.resourceId);
    }

    if (button?.mutation?.hasServiceId) {
      payload.serviceId = serviceId;
    }

    if (button?.mutation?.hasParentId) {
      payload.parentId = params.parentId;
    }

    if (button.mutation?.hasPayload) {
      args.push(payload);
    }

    const navigator = button.navigator;
    try {
      if (button.mutation?.name) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await APIManager[button.mutation.name].apply(null, args);
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

  return <BaseButton onPress={onPress}>{buttonBuilder.name}</BaseButton>;
});
