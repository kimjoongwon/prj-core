'use client';

import { Button as BaseButton, APIManager } from '@shared/frontend';
import { CellButtonBuilder as ButtonBuilderProps } from '@shared/specs';
import { observer } from 'mobx-react-lite';
import { cloneDeep } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { Delete, Edit, List, Plus } from 'lucide-react';
import { addToast } from '@heroui/react';
import { isAxiosError } from 'axios';

interface ButtonProps {
  row?: unknown & { id: string };
  buttonBuilder: ButtonBuilderProps;
  icon?: React.ReactNode;
}

export const CellButtonBuilder = observer((props: ButtonProps) => {
  const { buttonBuilder, row, icon, ...rest } = props;
  const router = useRouter();

  const onPress = async () => {
    const button = cloneDeep(buttonBuilder);
    const successToast = button.toast || {
      title: '성공',
      description: '작업이 완료되었습니다.',
    };
    const errorToast = {
      title: '오류',
      description: '작업 중 오류가 발생했습니다.',
    };

    try {
      if (button.apiKey) {
        // APIManager에서 함수 가져오기
        const apiFunction =
          APIManager[button.apiKey as keyof typeof APIManager];

        if (!apiFunction) {
          console.error(
            `API function with key "${button.apiKey}" not found in APIManager`,
          );

          // 에러 토스트 표시
          addToast({
            title: errorToast.title,
            description: `API 함수를 찾을 수 없습니다: ${button.apiKey}`,
            color: 'danger',
          });

          return;
        }

        // API 함수 호출 (row.id를 파라미터로 전달)
        await (apiFunction as Function)(row?.id);

        // 성공 토스트 표시
        addToast({
          title: successToast.title,
          description: successToast.description,
          color: 'success',
        });
      } else if (button.toast) {
        // API 호출이 없으면 토스트만 표시
        addToast({
          title: button.toast.title || '성공',
          description: button.toast.description || '작업이 완료되었습니다.',
          color: 'success',
        });
      }
    } catch (error: unknown) {
      console.error('Button press error:', error);

      // 에러 처리
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        const errorMessages = error.response?.data?.data?.message;

        let description = errorToast.description;

        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
          addToast({
            title: errorToast.title,
            description: (
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {errorMessages.map((msg: string, idx: number) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            ),
            color: 'danger',
          });
        } else if (errorMessage) {
          addToast({
            title: errorToast.title,
            description: errorMessage,
            color: 'danger',
          });
        } else {
          addToast({
            title: errorToast.title,
            description: errorToast.description,
            color: 'danger',
          });
        }
      } else {
        addToast({
          title: errorToast.title,
          description: errorToast.description,
          color: 'danger',
        });
      }
    }
  };

  let buttonChildren: any = buttonBuilder.name;

  switch (buttonBuilder.icon) {
    case 'detail':
      buttonChildren = <List />;
      break;
    case 'add':
      buttonChildren = <Plus />;
      break;
    case 'edit':
      buttonChildren = <Edit />;
      break;
    case 'delete':
      buttonChildren = <Delete />;
      break;
    default:
      buttonChildren = buttonBuilder.name;
  }

  return (
    <BaseButton
      {...rest}
      onPress={onPress}
      color={buttonBuilder?.color || 'primary'}
    >
      {buttonChildren}
    </BaseButton>
  );
});
