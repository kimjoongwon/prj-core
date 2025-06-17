import { addToast, ToastProps } from '@heroui/react';
import { isAxiosError } from 'axios';
import { ButtonResponse, Mutation, Navigator } from '@shared/types';
import { APIManager } from '@shared/api-client';
import { Plate, usePageState } from '@shared/frontend';
import { get } from 'lodash-es';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { PathUtil } from '@shared/utils';

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
  const queryClient = useQueryClient();
  const pageState = usePageState();
  const navigate = useNavigate();
  // Handle navigation based on navigator configuration
  const handleNavigation = (nav: Navigator) => {
    const navigatorService = Plate.navigation.getNavigator();

    // paramsPath와 params를 모두 활용하여 최종 파라미터 구성
    let finalParams: object = {};

    // 1. paramsPath가 있으면 pageState에서 값을 추출
    if (nav.route?.paramsPath) {
      const paramsFromPath = get(pageState, nav.route.paramsPath);
      if (paramsFromPath) {
        finalParams = { ...finalParams, ...paramsFromPath };
      }
    }

    // 2. params가 있으면 추가 (params가 우선순위를 가짐)
    if (nav.route?.params) {
      finalParams = { ...finalParams, ...nav.route.params };
    }

    // 파라미터가 빈 객체가 아닌 경우에만 전달
    const hasParams = Object.keys(finalParams).length > 0;
    const paramsToPass = hasParams ? finalParams : undefined;
    console.log('📦 Final navigation params:', paramsToPass);
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
          navigatorService.replace(nav.route.fullPath, paramsToPass);
        } else {
          navigatorService.push(nav.route.fullPath, paramsToPass);
        }
      }
      // 2. relativePath가 있으면 relativePath 사용
      else if (nav.route.relativePath) {
        if (nav.type === 'replace') {
          navigatorService.replace(nav.route.relativePath, paramsToPass);
        } else {
          const url = PathUtil.getUrlWithParamsAndQueryString(
            nav.route.relativePath,
            paramsToPass,
          );
          navigate(url);
        }
      }
      // 3. name이 있으면 name으로 라우트 검색
      else if (nav.route.name) {
        if (nav.type === 'replace') {
          // For replace navigation
          const pathname = Plate.navigation.getPathByName(nav.route.name);
          if (pathname) {
            navigatorService.replace(pathname, paramsToPass);
          }
        } else {
          // Default to push navigation
          navigatorService.pushByName(nav.route.name, paramsToPass);
        }
      }
    }
  };

  const handleApiCall = async () => {
    console.log('🚀 handleApiCall started');

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
      console.log('📝 Initial data:', { mutation, navigator, state, id });

      // Handle mutation if provided
      if (mutation?.name) {
        console.log('🔧 Processing mutation:', mutation.name);

        // APIManager에서 함수 가져오기
        console.log('🔍 Looking for API function in APIManager...');
        const apiFunction =
          APIManager[mutation.name as keyof typeof APIManager];

        if (!apiFunction) {
          console.error(
            `❌ API function with key "${mutation.name}" not found in APIManager`,
          );
          console.log('Available API functions:', Object.keys(APIManager));

          // 에러 토스트 표시
          addToast({
            title: errorToast.title,
            description: `API 함수를 찾을 수 없습니다: ${mutation.name}`,
            color: 'danger',
          });

          return;
        }

        console.log('✅ API function found:', mutation.name);

        // API 함수 호출시 mutation.params와 로컬 state 값을 병합
        console.log('📊 Processing parameters...');
        const serverParams = mutation?.params;
        const localParams =
          mutation?.path && state ? get(state, mutation.path) : undefined;

        console.log('📋 Parameter details:', {
          serverParams,
          localParams,
          mutationPath: mutation?.path,
          stateExists: !!state,
        });

        // 두 객체를 병합 (서버 파라미터가 우선순위)
        let apiParams;
        try {
          if (serverParams && localParams) {
            console.log('🔄 Merging server and local params');
            // 둘 다 있으면 병합
            apiParams = { ...localParams, ...serverParams };
          } else if (serverParams) {
            console.log('📤 Using server params only');
            // 서버 파라미터만 있으면 사용
            apiParams = serverParams;
          } else if (localParams) {
            console.log('📥 Using local params only');
            // 로컬 파라미터만 있으면 사용
            apiParams = localParams;
          } else {
            console.log('🚫 No params available');
            // 둘 다 없으면 빈 객체로 초기화 (API 함수가 파라미터를 요구할 수 있음)
            apiParams = undefined;
          }
        } catch (paramError) {
          console.error('❌ Error processing parameters:', paramError);
          throw new Error(`Parameter processing failed: ${paramError}`);
        }

        console.log('📋 Final API params:', apiParams);

        // API 함수 호출 - useParams에서 id가 있으면 첫 번째 파라미터로 제공
        console.log('🏗️ Building API arguments...');
        const apiArgs: unknown[] = [];
        if (id && mutation.hasId) {
          console.log('🆔 Adding ID to args:', id);
          apiArgs.push(id);
        }

        // apiParams가 있을 때만 추가 (undefined면 추가하지 않음)
        if (apiParams !== undefined) {
          console.log('📦 Adding params to args');
          apiArgs.push(apiParams);
        }

        console.log('🎯 Final API args:', apiArgs);

        console.log('🚀 Calling API function...');
        const response = await (apiFunction as Function).apply(null, apiArgs);
        console.log('✅ API call successful, response:', response);

        // 응답 데이터 추출
        console.log('📤 Processing response data...');
        const responseData = response?.data as ButtonResponse;
        setResponse(responseData);
        console.log('📋 Response data:', responseData);

        // 성공적인 뮤테이션 후 queryKey가 있으면 쿼리 무효화
        if (mutation?.queryKey) {
          try {
            console.log(`🔄 Invalidating query with key: ${mutation.queryKey}`);
            await queryClient.invalidateQueries({
              queryKey: [mutation.queryKey],
            });
            console.log('✅ Query invalidated successfully');
          } catch (invalidateError) {
            console.warn('⚠️ Query invalidation failed:', invalidateError);
          }
        }

        // 토스트 처리
        if (responseData?.toast) {
          console.log('🍞 Showing response toast');
          addToast({
            title: responseData.toast.title || successToast.title,
            description:
              responseData.toast.description || successToast.description,
            color: responseData.toast.color || successToast.color,
          });
        }

        // 라우트 이름이 있으면 해당 경로로 이동
        if (responseData?.routeName) {
          console.log('🧭 Navigating by route name:', responseData.routeName);
          Plate.navigation.getNavigator().pushByName(responseData.routeName);
        }

        if (response?.state) {
          console.log('💾 Updating state form');
          state.form = response.state.form;
        }

        // Handle navigation after successful API call
        if (navigator) {
          console.log('🧭 Handling navigation after API success');
          handleNavigation(navigator);
        }
      } else if (navigator) {
        console.log('🧭 Handling navigation without mutation');
        // Handle navigation when there's no mutation
        handleNavigation(navigator);
      }

      console.log('✅ handleApiCall completed successfully');
    } catch (error: unknown) {
      console.error('❌ API call error occurred:', error);
      console.error(
        '📍 Error stack:',
        error instanceof Error ? error.stack : 'No stack available',
      );

      let errorMessage = errorToast.description;

      // 에러 처리
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const apiErrorMessage = error.response?.data?.message;
        const errorMessages = error.response?.data?.data?.message;

        console.log('🔍 Error details:', {
          status,
          apiErrorMessage,
          errorMessages,
          responseData: error.response?.data,
        });

        // HTTP 상태 코드별 에러 처리
        switch (status) {
          case 409:
            // Conflict 에러 - 중복 데이터나 제약 조건 위반
            errorMessage =
              apiErrorMessage ||
              '데이터 충돌이 발생했습니다. 이미 존재하는 데이터이거나 제약 조건에 위반됩니다.';
            addToast({
              title: '데이터 충돌',
              description: errorMessage,
              color: 'warning',
            });
            break;

          case 400:
            // Bad Request - 잘못된 요청
            errorMessage =
              apiErrorMessage ||
              '잘못된 요청입니다. 입력 데이터를 확인해주세요.';
            addToast({
              title: '잘못된 요청',
              description: errorMessage,
              color: 'danger',
            });
            break;

          case 401:
            // Unauthorized - 인증 실패
            errorMessage = '인증이 필요합니다. 로그인을 확인해주세요.';
            addToast({
              title: '인증 실패',
              description: errorMessage,
              color: 'danger',
            });
            break;

          case 403:
            // Forbidden - 권한 없음
            errorMessage = '접근 권한이 없습니다.';
            addToast({
              title: '권한 없음',
              description: errorMessage,
              color: 'danger',
            });
            break;

          case 404:
            // Not Found - 리소스 없음
            errorMessage = '요청한 데이터를 찾을 수 없습니다.';
            addToast({
              title: '데이터 없음',
              description: errorMessage,
              color: 'warning',
            });
            break;

          case 422:
            // Unprocessable Entity - 유효성 검사 실패
            if (Array.isArray(errorMessages) && errorMessages.length > 0) {
              const combinedMessages = errorMessages.join('\n• ');
              errorMessage = `• ${combinedMessages}`;
            } else {
              errorMessage =
                apiErrorMessage || '입력 데이터의 유효성 검사에 실패했습니다.';
            }
            addToast({
              title: '유효성 검사 실패',
              description: errorMessage,
              color: 'danger',
            });
            break;

          case 500:
            // Internal Server Error
            errorMessage =
              '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            addToast({
              title: '서버 오류',
              description: errorMessage,
              color: 'danger',
            });
            break;

          default:
            // 기타 에러들
            if (Array.isArray(errorMessages) && errorMessages.length > 0) {
              const combinedMessages = errorMessages.join('\n• ');
              errorMessage = `• ${combinedMessages}`;
            } else if (apiErrorMessage) {
              errorMessage = apiErrorMessage;
            } else {
              errorMessage = `오류가 발생했습니다 (${status || '알 수 없음'})`;
            }
            addToast({
              title: errorToast.title,
              description: errorMessage,
              color: 'danger',
            });
            break;
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
