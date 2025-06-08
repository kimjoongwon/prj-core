'use client';

import { Button as BaseButton, usePageState, Text } from '@shared/frontend';
import { ButtonBuilder as ButtonBuilderProps } from '@shared/types';
import { addToast } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import { get } from 'lodash-es';
import { useButtonLogic } from './useButtonLogic';

export const ButtonBuilder = observer((props: ButtonBuilderProps) => {
  const { apiKey, validation, path } = props;
  const state = usePageState();
  const { handleApiCall } = useButtonLogic({ apiKey, state });
  // 버튼 validation 체크 함수
  const validateButton = (): { isValid: boolean; errorMessage?: string } => {
    if (!validation) return { isValid: true };

    const { required, patterns } = validation;
    const value = get(state, path);
    // 필수 여부 검증
    if (required?.value && (!value || value === '')) {
      return { isValid: false, errorMessage: required.message };
    }

    // 정규표현식 검증
    if (patterns && patterns.length > 0) {
      for (const pattern of patterns) {
        if (pattern.value instanceof RegExp) {
          if (!pattern.value.test(String(value))) {
            return { isValid: false, errorMessage: pattern.message };
          }
        } else {
          // pattern.value가 RegExp가 아닌 경우를 처리 (예: string)
          if (!new RegExp(pattern.value).test(String(value))) {
            return { isValid: false, errorMessage: pattern.message };
          }
        }
      }
    }

    return { isValid: true };
  };

  const validationResult = validateButton();

  const onPress = async () => {
    // validation 체크
    if (!validationResult.isValid) {
      addToast({
        title: '검증 오류',
        description: validationResult.errorMessage || '입력값을 확인해주세요.',
        color: 'danger',
      });
      return;
    }

    await handleApiCall();
  };

  return (
    <div className="flex flex-col gap-1">
      <BaseButton
        {...props}
        onPress={onPress}
        isDisabled={!validationResult.isValid}
        color={!validationResult.isValid ? 'danger' : props.color}
      >
        {props.children}
      </BaseButton>
      {!validationResult.isValid && validationResult.errorMessage && (
        <Text variant="error">
          {validationResult.errorMessage}
        </Text>
      )}
    </div>
  );
});
