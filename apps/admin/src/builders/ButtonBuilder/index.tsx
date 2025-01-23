import { Button as BaseButton, APIManager } from '@shared/frontend';
import { ButtonBuilder as ButtonBuilderProps } from '@shared/types';
import { PathUtil } from '@shared/utils';
import { isAxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { cloneDeep, get, isEmpty } from 'lodash-es';
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
  const serviceId = window.location.pathname.split('/')[5];
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // pathParam(serviceId) is the serviceId from the URL
  // row is the data from the row of the table
  // form is the form data
  // dataGrid is the data from the table
  const makeContext = (): any => {
    const clonedState = cloneDeep(state);
    return {
      ...row,
      serviceId,
      ...params,
      ...clonedState?.form?.data,
      ...clonedState?.dataGrid,
    };
  };

  const onPress = async () => {
    const button = cloneDeep(buttonBuilder);
    const context = makeContext();
    const args = [];
    const formData = cloneDeep(state?.form?.data);

    let resourceId = null;
    if (button.mutation?.idMapper) {
      resourceId = get(context, button.mutation.idMapper);
      args.push(resourceId);
    }

    if (button.mutation?.mapper) {
      Object.keys(button.mutation.mapper).map(key => {
        const value = get(context, key);

        Object.assign(formData, {
          [button.mutation?.mapper[key]]: value,
        });
      });
    }
    if (!isEmpty(formData)) args.push(formData);

    const navigator = button.navigator;

    try {
      if (button.mutation?.name) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await APIManager[button.mutation.name].apply(null, args);
        queryClient?.refetchQueries();
      }

      if (button.alert) {
        alert(button.alert?.message);
      }

      if (navigator) {
        let params = {};
        if (navigator.mapper) {
          Object.keys(navigator.mapper).map(key => {
            const value = get(context, key);
            params = {
              ...params,
              [navigator.mapper[key]]: value,
            };
          });
        }

        const pathname = PathUtil.getUrlWithParamsAndQueryString(
          navigator.pathname,
          params,
        );

        if (pathname === '..') {
          navigate(-1);
          return;
        }

        navigate(pathname);
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.message || '');
      }
    }
  };

  return (
    <BaseButton onPress={onPress} color={buttonBuilder?.color || 'primary'}>
      {buttonBuilder?.name}
    </BaseButton>
  );
});
