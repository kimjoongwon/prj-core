import { addToast, ToastProps } from '@heroui/react';
import { isAxiosError } from 'axios';
import { ButtonResponse, Mutation, Navigator } from '@shared/types';
import { APIManager } from '@shared/api-client';
import { Plate } from '@shared/frontend';
import { get } from 'lodash-es';
import { useState } from 'react';
import { useParams } from 'react-router';

interface UseButtonLogicProps {
  mutation?: Mutation;
  navigator?: Navigator;
  state?: any;
}

interface ToastConfig {
  color: ToastProps['color'];
  title: string;
  description: string;
}

export const useButtonLogic = ({
  mutation,
  navigator,
  state,
}: UseButtonLogicProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ButtonResponse | null>(null);
  const { id } = useParams<{ id: string }>();
  // Handle navigation based on navigator configuration
  const handleNavigation = (nav: Navigator) => {
    const navigatorService = Plate.navigation.getNavigator();

    if (nav.type === 'back') {
      navigatorService.goBack();
    } else if (nav.type === 'href') {
      // window.location.href로 이동 (외부 링크 또는 페이지 새로고침을 통한 이동)
      if (nav.route?.fullPath) {
        window.location.href = nav.route.fullPath;
      } else if (nav.route?.relativePath) {
        window.location.href = nav.route.relativePath;
      }
    } else if (nav.route) {
      // 1. fullPath가 있으면 fullPath를 우선 사용
      if (nav.route.fullPath) {
        if (nav.type === 'replace') {
          navigatorService.replace(nav.route.fullPath, nav.route.params);
        } else {
          navigatorService.push(nav.route.fullPath, nav.route.params);
        }
      }
      // 2. relativePath가 있으면 relativePath 사용
      else if (nav.route.relativePath) {
        if (nav.type === 'replace') {
          navigatorService.replace(nav.route.relativePath, nav.route.params);
        } else {
          navigatorService.push(nav.route.relativePath, nav.route.params);
        }
      }
      // 3. name이 있으면 name으로 라우트 검색
      else if (nav.route.name) {
        if (nav.type === 'replace') {
          // For replace navigation
          const pathname = Plate.navigation.getPathByName(nav.route.name);
          if (pathname) {
            navigatorService.replace(pathname, nav.route.params);
          }
        } else {
          // Default to push navigation
          navigatorService.pushByName(nav.route.name, nav.route.params);
        }
      }
    }
  };

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

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Handle mutation if provided
      if (mutation?.name) {
        // APIManager에서 함수 가져오기
        const apiFunction =
          APIManager[mutation.name as keyof typeof APIManager];

        if (!apiFunction) {
          console.error(
            `API function with key "${mutation.name}" not found in APIManager`,
          );

          // 에러 토스트 표시
          addToast({
            title: errorToast.title,
            description: `API 함수를 찾을 수 없습니다: ${mutation.name}`,
            color: 'danger',
          });

          return;
        }

        // API 함수 호출시 mutation.params와 로컬 state 값을 병합
        const serverParams = mutation.params;
        const localParams = mutation.path
          ? get(state, mutation.path)
          : undefined;

        // 두 객체를 병합 (서버 파라미터가 우선순위)
        let apiParams;
        if (serverParams && localParams) {
          apiParams = { ...localParams, ...serverParams };
        } else if (serverParams) {
          apiParams = serverParams;
        } else if (localParams) {
          apiParams = localParams;
        }

        // API 함수 호출 - useParams에서 id가 있으면 첫 번째 파라미터로 제공
        const apiArgs: unknown[] = [];
        if (id) {
          apiArgs.push(id);
        }
        if (apiParams) {
          apiArgs.push(apiParams);
        }

        const response = await (apiFunction as Function).apply(null, apiArgs);

        // 응답 데이터 추출
        const responseData = response?.data as ButtonResponse;
        setResponse(responseData);
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
          Plate.navigation.getNavigator().pushByName(responseData.routeName);
        }

        if (response?.state) {
          state.form = response.state.form;
        }

        // Handle navigation after successful API call
        if (navigator) {
          handleNavigation(navigator);
        }
      } else if (navigator) {
        // Handle navigation when there's no mutation
        handleNavigation(navigator);
      }
    } catch (error: unknown) {
      console.error('API call error:', error);

      let errorMessage = errorToast.description;

      // 에러 처리
      if (isAxiosError(error)) {
        const apiErrorMessage = error.response?.data?.message;
        const errorMessages = error.response?.data?.data?.message;

        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
          // 에러 메시지들을 문자열로 합쳐서 표시
          const combinedMessages = errorMessages.join('\n• ');
          errorMessage = `• ${combinedMessages}`;
          addToast({
            title: errorToast.title,
            description: errorMessage,
            color: 'danger',
          });
        } else if (apiErrorMessage) {
          errorMessage = apiErrorMessage;
          addToast({
            title: errorToast.title,
            description: errorMessage,
            color: 'danger',
          });
        } else {
          addToast({
            title: errorToast.title,
            description: errorMessage,
            color: 'danger',
          });
        }
      } else {
        addToast({
          title: errorToast.title,
          description: errorMessage,
          color: 'danger',
        });
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleApiCall,
    isLoading,
    error,
    response,
    // 편의 메서드들
    clearError: () => setError(null),
    clearResponse: () => setResponse(null),
  };
};
