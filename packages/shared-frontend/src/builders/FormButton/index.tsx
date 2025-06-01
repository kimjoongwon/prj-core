'use client';

import React from 'react';
import { Button as BaseButton } from '@shared/frontend';
import { APIManager } from '@shared/frontend';
import { addToast } from '@heroui/react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';
import { ButtonProps } from '@heroui/react';
import { PathUtil } from '@shared/utils';

interface FormButtonProps extends Omit<ButtonProps, 'onPress'> {
  /**
   * APIManager에서 호출할 함수의 키
   */
  key: string;
  /**
   * API 호출에 전달할 파라미터
   */
  params?: any;
  /**
   * 성공 시 표시할 토스트 메시지
   */
  successToast?: {
    title: string;
    description: string;
  };
  /**
   * 에러 시 표시할 토스트 메시지
   */
  errorToast?: {
    title: string;
    description: string;
  };
  /**
   * 버튼 텍스트
   */
  children: React.ReactNode;
}

export const FormButton = observer((props: FormButtonProps) => {
  const {
    key: apiKey,
    params,
    successToast = { title: '성공', description: '작업이 완료되었습니다.' },
    errorToast = { title: '오류', description: '작업 중 오류가 발생했습니다.' },
    children,
    ...buttonProps
  } = props;

  const navigate = useNavigate();

  const handlePress = async () => {
    try {
      // APIManager[key]()를 호출
      const apiFunction = APIManager[apiKey as keyof typeof APIManager];
      
      if (!apiFunction) {
        console.error(`API function with key "${apiKey}" not found in APIManager`);
        addToast({
          title: errorToast.title,
          description: `API 함수를 찾을 수 없습니다: ${apiKey}`,
          color: 'danger',
        });
        return;
      }

      // API 함수 호출
      const response = await (apiFunction as Function)(params);
      
      // 응답에서 data 추출
      const responseData = response?.data;
      
      // 성공 토스트 표시
      addToast({
        title: successToast.title,
        description: successToast.description,
        color: 'success',
      });

      // routeName이 있으면 해당 라우트로 이동
      if (responseData?.routeName) {
        const pathname = PathUtil.getUrlWithParamsAndQueryString(
          responseData.routeName,
          params || {},
        );
        navigate(pathname);
      }

      // 응답 데이터 반환 (필요 시 사용할 수 있도록)
      return responseData;

    } catch (error: unknown) {
      console.error('FormButton API call error:', error);
      
      // 에러 처리
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        const errorMessages = error.response?.data?.data?.message;
        
        let description = errorToast.description;
        
        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
          description = errorMessages.join(', ');
        } else if (errorMessage) {
          description = errorMessage;
        }

        addToast({
          title: errorToast.title,
          description,
          color: 'danger',
        });
      } else {
        addToast({
          title: errorToast.title,
          description: errorToast.description,
          color: 'danger',
        });
      }
      
      throw error; // 에러를 다시 throw하여 상위에서 처리할 수 있도록
    }
  };

  return (
    <BaseButton
      {...buttonProps}
      onPress={handlePress}
      color={buttonProps.color || 'primary'}
    >
      {children}
    </BaseButton>
  );
});

FormButton.displayName = 'FormButton';
