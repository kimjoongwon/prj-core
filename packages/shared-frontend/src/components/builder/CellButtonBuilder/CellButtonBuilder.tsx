import { Button as BaseButton } from '@shared/frontend';
import { IButtonBuilder as ButtonBuilderProps } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { cloneDeep } from 'lodash-es';
import { Delete, Edit, List, Plus } from 'lucide-react';
import { addToast } from '@heroui/react';
import { isAxiosError } from 'axios';
import { APIManager } from '@shared/api-client';

export const CellButtonBuilder = observer((props: ButtonBuilderProps) => {
  const { icon, ...rest } = props;

  const onPress = async () => {
    const button = cloneDeep(props);
    const successToast = button.toast || {
      title: '성공',
      description: '작업이 완료되었습니다.',
    };
    const errorToast = {
      title: '오류',
      description: '작업 중 오류가 발생했습니다.',
    };

    try {
      if (button.mutation?.name) {
        // APIManager에서 함수 가져오기
        const apiFunction =
          APIManager[button.mutation.name as keyof typeof APIManager];

        if (!apiFunction) {
          console.error(
            `API function with key "${button.mutation.name}" not found in APIManager`,
          );

          // 에러 토스트 표시
          addToast({
            title: errorToast.title,
            description: `API 함수를 찾을 수 없습니다: ${button.mutation.name}`,
            color: 'danger',
          });

          return;
        }

        // API 함수 호출 (row.id를 파라미터로 전달)
        await (apiFunction as Function)();

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

  let buttonChildren: any = props.name;

  switch (props.icon) {
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
      buttonChildren = props.name;
  }

  return (
    <BaseButton {...rest} onPress={onPress} color={props?.color || 'primary'}>
      {buttonChildren}
    </BaseButton>
  );
});
