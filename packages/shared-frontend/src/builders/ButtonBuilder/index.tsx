'use client';

import { Button as BaseButton, APIManager } from '@shared/frontend';
import { ButtonBuilder as ButtonBuilderProps } from '@shared/specs';
import { addToast } from '@heroui/react';
import { PathUtil } from '@shared/utils';
import { isAxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router';

export const ButtonBuilder = observer((props: ButtonBuilderProps) => {
  const navigate = useNavigate();
  const { apiKey, state, toast: buttonToast } = props;

  const onPress = async () => {
    // 기본 성공/에러 토스트 설정
    const successToast = buttonToast || {
      title: '성공',
      description: '작업이 완료되었습니다.',
    };
    const errorToast = {
      title: '오류',
      description: '작업 중 오류가 발생했습니다.',
    };

    try {
      // Handle apiKey if provided
      if (apiKey) {
        // APIManager에서 함수 가져오기
        const apiFunction = APIManager[apiKey as keyof typeof APIManager];

        if (!apiFunction) {
          console.error(
            `API function with key "${apiKey}" not found in APIManager`,
          );

          // 에러 토스트 표시
          addToast({
            title: errorToast.title,
            description: `API 함수를 찾을 수 없습니다: ${apiKey}`,
            color: 'danger',
          });

          return;
        }

        // API 함수 호출
        const response = await (apiFunction as Function)(state.form.inputs);

        // 응답 데이터 추출
        const responseData = response?.data;

        // 성공 토스트 표시
        addToast({
          title: successToast.title,
          description: successToast.description,
        });

        // 라우트 이름이 있으면 해당 경로로 이동
        if (responseData?.routeName && navigate) {
          const pathname = PathUtil.getUrlWithParamsAndQueryString(
            responseData.routeName,
            {}, // 파라미터 없음
          );

          navigate(window.location.pathname + '/' + pathname);
        }

        state.form = response.state.form;
      }
      // apiKey가 없는 경우 성공 토스트만 표시
      else if (buttonToast) {
        addToast({
          title: buttonToast.title,
          description: buttonToast.description,
        });
      }
    } catch (error: unknown) {
      console.error('API call error:', error);

      // 에러 처리
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        const errorMessages = error.response?.data?.data?.message;

        let description = errorToast.description;

        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
          // 리스트로 정렬하여 표시
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

  return (
    <BaseButton
      {...props}
      onPress={onPress}
      isDisabled={
        state?.form?.button?.errorMessages &&
        (state?.form?.button?.errorMessages?.length > 0 ||
          state.form.button.errorMessages.length === 0)
      }
    >
      {props.children}
    </BaseButton>
  );
});
