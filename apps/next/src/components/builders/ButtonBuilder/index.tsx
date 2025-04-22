'use client';

import {
  Button as BaseButton,
  APIManager,
  getQueryClient,
} from '@shared/frontend';
import { ButtonBuilder as ButtonBuilderProps } from '@shared/types';
import { addToast, ButtonProps as HeroUIButtonProps } from '@heroui/react';
import { PathUtil } from '@shared/utils';
import { isAxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import { cloneDeep, defaultsDeep, isEmpty } from 'lodash-es';
import { usePageState } from '../Page/PageBuilder';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

interface ButtonProps extends HeroUIButtonProps {
  row?: unknown & { id: string };
  buttonBuilder: ButtonBuilderProps;
  icon?: React.ReactNode;
}

export const ButtonBuilder = observer((props: ButtonProps) => {
  const { buttonBuilder, row, icon, ...rest } = props;
  const state = usePageState();
  const router = useRouter();
  const qc = useQueryClient();

  const onPress = async () => {
    const button = cloneDeep(buttonBuilder);
    const params = button.mutation?.params;
    const formData = defaultsDeep(state?.form?.inputs, params);
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

      if (button.toast) {
        addToast({
          title: '성공',
          description: '생성 완료',
        });
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

        router.push(window.location.pathname + '/' + pathname);
      }
      if (button.mutation?.invalidationKey) {
        qc.invalidateQueries({
          queryKey: [button.mutation?.invalidationKey || ''],
        });
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.data) {
          if (error.response?.data.message?.length > 0) {
            addToast({
              title: '오류',
              description: error.response?.data?.data?.message.join(', '),
              color: 'danger',
            });
          }
        }
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
