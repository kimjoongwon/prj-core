'use client';

import { Button as BaseButton, usePageState, Text } from '@shared/frontend';
import { ButtonBuilder as ButtonBuilderProps } from '@shared/types';
import { addToast } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import { get } from 'lodash-es';
import { Delete, Edit, List, Plus } from 'lucide-react';
import { useButtonLogic } from './useButtonLogic';

export const ButtonBuilder = observer((props: ButtonBuilderProps) => {
  const { mutation, validation, buttonType, navigator } = props;
  const state = usePageState();
  const { handleApiCall } = useButtonLogic({ mutation, navigator, state });

  // FormButtonBuilder의 에러 처리 로직 (form 타입일 때만)
  const hasFormErrors =
    buttonType === 'form' &&
    state?.form?.button?.errorMessages &&
    Object.keys(state.form.button.errorMessages).length > 0;

  // 버튼 validation 체크 함수
  const validateButton = (): { isValid: boolean; errorMessage?: string } => {
    if (!validation) return { isValid: true };

    const { required, patterns } = validation;
    // mutation path가 있는 경우에만 get 함수 호출
    let value;
    if (mutation?.path) {
      value = get(state, mutation.path);
    }
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
  const isButtonDisabled = !validationResult.isValid || hasFormErrors;

  const onPress = async () => {
    // form 에러가 있으면 return (form 타입일 때만)
    if (hasFormErrors) return;

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

  // 아이콘 처리 로직 (cell 타입일 때만)
  let buttonChildren: any = props.children || props.name;

  if (props.buttonType === 'cell' && props.icon) {
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
  }

  return (
    <div className="flex flex-col gap-1">
      <BaseButton
        {...props}
        onPress={onPress}
        isDisabled={isButtonDisabled}
        color={isButtonDisabled ? 'danger' : props.color}
      >
        {buttonChildren}
      </BaseButton>
      {!validationResult.isValid && validationResult.errorMessage && (
        <Text variant="error">{validationResult.errorMessage}</Text>
      )}
    </div>
  );
});
