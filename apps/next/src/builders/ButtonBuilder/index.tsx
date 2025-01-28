'use client';

import {
  Button as BaseButton,
  APIManager,
  ButtonViewProps,
} from '@shared/frontend';
import { ButtonBuilder as ButtonBuilderProps } from '@shared/types';
import { PathUtil } from '@shared/utils';
import { isAxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import { cloneDeep, get, isEmpty } from 'lodash-es';
import { usePageState } from '../Page/PageBuilder';
import { useParams, useRouter } from 'next/navigation';

interface ButtonProps extends ButtonViewProps {
  row?: unknown & { id: string };
  buttonBuilder: ButtonBuilderProps;
  icon?: React.ReactNode;
}

export const ButtonBuilder = observer((props: ButtonProps) => {
  const { buttonBuilder, row, icon, ...rest } = props;
  const state = usePageState();
  const params = useParams();
  const router = useRouter();
  // const queryClient = useQueryClient();

  // pathParam(serviceId) is the serviceId from the URL
  // row is the data from the row of the table
  // form is the form data
  // dataGrid is the data from the table
  const makeContext = (): any => {
    const clonedState = cloneDeep(state);
    return {
      ...row,
      ...params,
      ...clonedState?.form?.data,
      ...clonedState?.dataGrid,
    };
  };

  const onPress = async () => {
    const button = cloneDeep(buttonBuilder);
    const context = makeContext();
    const args = [];
    const formData = cloneDeep(state?.form?.data) || {};

    let resourceId = null;
    if (button.mutation?.idMapper) {
      resourceId = get(context, button.mutation.idMapper);
      args.push(resourceId);
    }

    if (button.mutation?.mapper) {
      Object.keys(button.mutation?.mapper).map(key => {
        const value = get(context, key);
        const mapperKey = button.mutation?.mapper?.[key];
        console.log('mapperKey', mapperKey);
        console.log('value', value);
        if (value && mapperKey) {
          Object.assign(formData, {
            [mapperKey]: value,
          });
        }
      });
    }
    if (!isEmpty(formData)) args.push(formData);

    const navigator = button.navigator;

    try {
      if (button.mutation?.name) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await APIManager[button.mutation.name].apply(null, args);
        // queryClient?.refetchQueries();
      }

      if (button.alert) {
        console.log('ha');
        // alert(button.alert?.message);
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
          router.back();
          return;
        }

        router.push(pathname);
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.log('error', error);
        // alert(error.response?.data?.message || '');
      }
    }
  };

  return (
    <BaseButton
      {...rest}
      isIconOnly={!!icon}
      onPress={onPress}
      color={buttonBuilder?.color || 'primary'}
    >
      {icon ? icon : buttonBuilder?.name}
    </BaseButton>
  );
});
