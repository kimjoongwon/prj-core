import { addToast, ToastProps } from '@heroui/react';
import { isAxiosError } from 'axios';
import { ButtonResponse, Mutation, Navigator } from '@shared/types';
import { Plate, usePage } from '@shared/frontend';
import { get } from 'lodash-es';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { PathUtil, LoggerUtil } from '@shared/utils';
import { toJS } from 'mobx';
import { executeMutation } from '../../../hooks/useMutation';

// 🎯 Debug logger utility for useButtonLogic
const logger = LoggerUtil.create('[useButtonLogic]');

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
  logger.info('🎬 Initializing useButtonLogic', {
    hasMutation: !!mutation,
    hasNavigator: !!navigator,
    hasState: !!state,
    mutationName: mutation?.name
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ButtonResponse | null>(null);
  const queryClient = useQueryClient();
  const page = usePage();
  const pageState = page.state;
  const navigate = useNavigate();
  // Handle navigation based on navigator configuration
  const handleNavigation = (nav: Navigator) => {
    logger.info('🧭 Starting navigation handling');
    const navigatorService = Plate.navigation.getNavigator();

    let finalParams: object = {};
    let finalPath: string | undefined;

    // 1. pathParams가 있으면 라우트 패턴 파싱 및 파라미터 치환 처리
    if (nav.route?.pathParams && nav.route?.relativePath) {
      logger.debug('🔄 Processing pathParams', nav.route.pathParams);
      logger.debug('📍 Route pattern', nav.route.relativePath);

      // 라우트 패턴에서 파라미터 키 추출 (예: :groundId, :tenantId)
      const paramKeys = nav.route.relativePath.match(/:(\w+)/g)?.map(param => param.slice(1)) || [];
      logger.debug('🔍 Extracted param keys from route', paramKeys);

      let processedPath = nav.route.relativePath;

      // 각 파라미터 키에 대해 pathParams 매핑을 확인하고 값 치환
      for (const paramKey of paramKeys) {
        const pageStatePath = nav.route.pathParams[paramKey];
        if (pageStatePath) {
          const value = get(pageState, pageStatePath);
          if (value !== undefined) {
            // 라우트 패턴에서 :paramKey를 실제 값으로 치환
            processedPath = processedPath.replace(`:${paramKey}`, String(value));
            logger.success(`✅ Replaced :${paramKey} with ${value} from path: ${pageStatePath}`);
          } else {
            logger.warning(`⚠️ No value found at path: ${pageStatePath} for param: ${paramKey}`);
          }
        } else {
          logger.warning(`⚠️ No pathParams mapping found for param: ${paramKey}`);
        }
      }

      finalPath = processedPath;
      logger.success('🎯 Final processed path', finalPath);
    }
    // 2. 기존 방식: params가 있으면 추가
    else if (nav.route?.params) {
      finalParams = { ...nav.route.params };
    }

    // 파라미터가 빈 객체가 아닌 경우에만 전달
    const hasParams = Object.keys(finalParams).length > 0;
    const paramsToPass = hasParams ? finalParams : undefined;
    logger.debug('📦 Final navigation params', paramsToPass);
    
    if (nav.type === 'back') {
      logger.info('🔙 Navigating back');
      navigatorService.goBack();
    } else if (nav.type === 'href') {
      // window.location.href로 이동 (외부 링크 또는 페이지 새로고침을 통한 이동)
      if (nav.route?.fullPath) {
        logger.info('🌐 Navigating to external URL (fullPath)', nav.route.fullPath);
        window.location.href = nav.route.fullPath;
      } else if (nav.route?.relativePath) {
        logger.info('🌐 Navigating to external URL (relativePath)', nav.route.relativePath);
        window.location.href = nav.route.relativePath;
      }
    } else if (nav.route) {
      // 1. finalPath가 있으면 finalPath를 우선 사용 (pathParams 처리 결과)
      if (finalPath) {
        if (nav.type === 'replace') {
          logger.info('🔄 Replacing with finalPath', finalPath);
          navigatorService.replace(finalPath, paramsToPass);
        } else {
          logger.info('➡️ Navigating to finalPath', finalPath);
          navigate(finalPath);
        }
      }
      // 2. fullPath가 있으면 fullPath 사용
      else if (nav.route.fullPath) {
        if (nav.type === 'replace') {
          logger.info('🔄 Replacing with fullPath', nav.route.fullPath);
          navigatorService.replace(nav.route.fullPath, paramsToPass);
        } else {
          logger.info('➡️ Navigating to fullPath', nav.route.fullPath);
          navigatorService.push(nav.route.fullPath, paramsToPass);
        }
      }
      // 3. relativePath가 있으면 relativePath 사용
      else if (nav.route.relativePath) {
        if (nav.type === 'replace') {
          logger.info('🔄 Replacing with relativePath', nav.route.relativePath);
          navigatorService.replace(nav.route.relativePath, paramsToPass);
        } else {
          const url = PathUtil.getUrlWithParamsAndQueryString(
            nav.route.relativePath,
            paramsToPass,
          );
          logger.info('➡️ Navigating to processed relativePath', url);
          navigate(url);
        }
      }
      // 4. name이 있으면 name으로 라우트 검색
      else if (nav.route.name) {
        if (nav.type === 'replace') {
          // For replace navigation
          const pathname = Plate.navigation.getPathByName(nav.route.name);
          if (pathname) {
            logger.info('🔄 Replacing with route name', { name: nav.route.name, pathname });
            navigatorService.replace(pathname, paramsToPass);
          }
        } else {
          // Default to push navigation
          logger.info('➡️ Navigating by route name', nav.route.name);
          navigatorService.pushByName(nav.route.name, paramsToPass);
        }
      }
    }
  };

  const handleApiCall = async () => {
    logger.info('🚀 API call started');

    // mutation이 없고 navigator만 있는 경우 바로 네비게이션 처리
    if (!mutation?.name && navigator) {
      logger.info('🧭 Navigation-only button: handling navigation directly');
      handleNavigation(navigator);
      return;
    }

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
      logger.debug('📝 Initial data', {
        mutation,
        navigator,
        state: toJS(state),
        pageState: toJS(pageState),
      });

      // Handle mutation if provided
      if (mutation?.name) {
        logger.info('🔧 Processing mutation with improved handler', mutation.name);

        try {
          // 🚀 새로운 mutation 처리 함수 사용 (URL params 없이 pageState만 사용)
          const response = await executeMutation(mutation, pageState);
          
          logger.success('✅ Mutation executed successfully', response);

          // 응답 데이터 추출
          const responseData = response?.data as ButtonResponse;
          setResponse(responseData);

          // 성공적인 뮤테이션 후 queryKey가 있으면 쿼리 무효화
          if (mutation?.queryKey) {
            try {
              logger.info('🔄 Invalidating query with key', mutation.queryKey);
              await queryClient.invalidateQueries({
                queryKey: [mutation.queryKey],
              });
              logger.success('✅ Query invalidated successfully');
            } catch (invalidateError) {
              logger.warning('⚠️ Query invalidation failed', invalidateError);
            }
          }

          // 토스트 처리
          if (responseData?.toast) {
            logger.debug('🍞 Showing response toast');
            addToast({
              title: responseData.toast.title || successToast.title,
              description:
                responseData.toast.description || successToast.description,
              color: responseData.toast.color || successToast.color,
            });
          }

          // 라우트 이름이 있으면 해당 경로로 이동
          if (responseData?.routeName) {
            logger.info('🧭 Navigating by route name', responseData.routeName);
            Plate.navigation.getNavigator().pushByName(responseData.routeName);
          }

          if (response?.state) {
            logger.info('💾 Updating state form');
            state.form = response.state.form;
          }

          // Handle navigation after successful API call
          if (navigator) {
            logger.info('🧭 Handling navigation after API success');
            handleNavigation(navigator);
          }
          
        } catch (mutationError) {
          logger.error('❌ Mutation execution failed', mutationError);
          // 에러는 executeMutation에서 이미 처리됨 (토스트 표시 등)
          throw mutationError;
        }
      } else {
        logger.warning('⚠️ No mutation found, but handleApiCall was called');
      }

      logger.success('✅ API call completed successfully');
    } catch (error: unknown) {
      logger.error('❌ API call error occurred', error);
      logger.error('📍 Error stack', 
        error instanceof Error ? error.stack : 'No stack available'
      );

      let errorMessage = errorToast.description;

      // 에러 처리
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const apiErrorMessage = error.response?.data?.message;
        const errorMessages = error.response?.data?.data?.message;

        logger.debug('🔍 Error details', {
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

/**
 * useButtonLogic Hook
 *
 * @description 버튼의 mutation과 navigation 로직을 처리합니다.
 *
 * @example
 * // pathParams 사용 예시:
 * // pageState에 { groundId: "123", tenantId: "456" } 가 있을 때
 * const mutation = {
 *   name: "updateGround",
 *   pathParams: {
 *     groundId: 'groundId' // pageState.groundId에서 값을 가져옴
 *   },
 *   queryKey: "grounds"
 * };
 *
 * // 복수 pathParams 예시:
 * const mutationWithMultipleParams = {
 *   name: "updateTenant",
 *   pathParams: {
 *     groundId: 'selectedRow.groundId',  // pageState.selectedRow.groundId
 *     tenantId: 'selectedRow.id'         // pageState.selectedRow.id
 *   },
 *   queryKey: "tenants"
 * };
 */

/**
 * Navigator Route pathParams 사용 예시:
 *
 * @example
 * // 새로운 pathParams 방식:
 * const navigator = {
 *   route: {
 *     relativePath: ':groundId/detail/tenants/:tenantId',
 *     pathParams: {
 *       'groundId': 'selectedRow.groundId',  // 라우트의 :groundId 파라미터
 *       'tenantId': 'selectedRow.id'         // 라우트의 :tenantId 파라미터
 *     }
 *   }
 * };
 *
 * // page.state 예시:
 * {
 *   selectedRow: {
 *     id: '123',
 *     groundId: '456',
 *     name: 'My Tenant'
 *   }
 * }
 *
 * // 결과: '456/detail/tenants/123'
 */
