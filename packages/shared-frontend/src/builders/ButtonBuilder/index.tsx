'use client';

import {
  Button as BaseButton,
  APIManager,
  getQueryClient,
} from '@shared/frontend';
import { ButtonBuilder as ButtonBuilderProps } from '@shared/types';
import { addToast, Alert } from '@heroui/react';
import { PathUtil } from '@shared/utils';
import { isAxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import { cloneDeep, defaultsDeep, isEmpty } from 'lodash-es';
import { usePageState } from '../Page/PageBuilder';
import { useQueryClient } from '@tanstack/react-query';
import { v4 } from 'uuid';
import { useNavigate } from 'react-router';

interface ButtonProps {
  row?: unknown & { id: string };
  buttonBuilder: ButtonBuilderProps;
  icon?: React.ReactNode;
}

export const ButtonBuilder = observer((props: ButtonProps) => {
  const { buttonBuilder, row, icon, ...rest } = props;
  const { buttonProps } = buttonBuilder;
  const state = usePageState();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const onPress = async () => {
    const button = cloneDeep(buttonBuilder);
    const params = button.mutation?.params;
    const formData = defaultsDeep(state?.form?.elements, params);
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
          color: 'success',
        });
      }

      const navigator = button.navigator;

      if (navigator) {
        if (navigator.type === 'back') {
          navigate(-1);
          return;
        }
        const pathname = PathUtil.getUrlWithParamsAndQueryString(
          navigator?.pathname || '',
          params,
        );

        navigate(window.location.pathname + '/' + pathname);
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
    <>
      <BaseButton
        {...rest}
        {...buttonProps}
        isIconOnly={!!icon}
        onPress={onPress}
        color={buttonBuilder?.color || 'primary'}
        isDisabled={
          state?.form?.button?.errorMessages &&
          (state?.form?.button?.errorMessages?.length > 0 ||
            state.form.button.errorMessages.length === 0)
        }
      >
        {icon ? icon : buttonBuilder?.name}
      </BaseButton>
      <Alert
        className="absolute bottom-10 w-[80%]"
        color="danger"
        isVisible={!!state?.form?.button?.errorMessages?.length}
      >
        <ol>
          {state?.form?.button?.errorMessages?.map(message => (
            <li key={v4()}>- {message}</li>
          ))}
        </ol>
      </Alert>
    </>
  );
});
