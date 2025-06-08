import { addToast, ToastProps } from '@heroui/react';
import { isAxiosError } from 'axios';
import { ButtonResponse } from '@shared/types';
import { APIManager } from '@shared/api-client';
import { Plate } from '@shared/frontend';

interface UseButtonLogicProps {
  apiKey?: string;
  state?: any;
}

interface ToastConfig {
  color: ToastProps['color'];
  title: string;
  description: string;
}

export const useButtonLogic = ({ apiKey, state }: UseButtonLogicProps) => {
  const handleApiCall = async () => {
    // 기본 성공/에러 토스트 설정
    const successToast: ToastConfig = {
      color: 'success',
      title: '성공',
      description: '작업이 완료되었습니다.',
    };
    const errorToast: ToastConfig = {
      color: 'danger',
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
        const response = await (apiFunction as Function)(state?.form?.inputs);

        // 응답 데이터 추출
        const responseData = response?.data as ButtonResponse;
        if (responseData?.toast) {
          addToast({
            title: responseData.toast.title || successToast.title,
            description:
              responseData.toast.description || successToast.description,
            color: responseData.toast.color || successToast.color,
          });
        }

        // 라우트 이름이 있으면 해당 경로로 이동
        if (responseData?.routeName) {
          Plate.navigation.pushByName(responseData.routeName);
        }

        if (response?.state) {
          state.form = response.state.form;
        }
      }
    } catch (error: unknown) {
      console.error('API call error:', error);

      // 에러 처리
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        const errorMessages = error.response?.data?.data?.message;

        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
          // 에러 메시지들을 문자열로 합쳐서 표시
          const combinedMessages = errorMessages.join('\n• ');
          addToast({
            title: errorToast.title,
            description: `• ${combinedMessages}`,
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

  return { handleApiCall };
};
