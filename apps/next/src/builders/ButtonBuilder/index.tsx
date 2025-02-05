'use client';

import {
  Button as BaseButton,
  APIManager,
  ButtonViewProps,
  getQueryClient,
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

  const onPress = async () => {
    const button = cloneDeep(buttonBuilder);
    const formData = get(state, button.mutation?.payloadPath || '');
    const args = [];

    if (button.mutation?.id) {
      args.push(button.mutation.id);
    }

    if (!isEmpty(formData)) {
      args.push(formData);
    }

    try {
      if (button.mutation?.name) {
        // @ts-ignore
        await APIManager[button.mutation.name].apply(null, args);

        getQueryClient().invalidateQueries({
          queryKey: [button.mutation?.invalidationKey || ''],
        });
      }

      if (button.alert) {
        console.log('success');
      }

      const navigator = button.navigator;
      if (navigator) {
        if (navigator.type === 'back') {
          router.back();
          return;
        }
        const pathname = PathUtil.getUrlWithParamsAndQueryString(
          navigator?.pathname || '',
          params,
        );

        router.push(pathname);
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.log('error', error);
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
