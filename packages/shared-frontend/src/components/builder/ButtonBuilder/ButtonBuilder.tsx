import { Button as BaseButton, Text } from '@shared/frontend';
import { IButtonBuilder } from '@shared/types';
import { addToast } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import { Delete, Edit, List, Plus } from 'lucide-react';
import { useButtonLogic } from './useButtonLogic';
import { usePage } from '../../../provider';
import { FormValidationUtil } from '@shared/utils';
import { toJS } from 'mobx';

export const ButtonBuilder = observer((props: IButtonBuilder) => {
  const {
    mutation,
    buttonType,
    navigator,
    onPress: onBeforePress,
    // @ts-ignore
    isReadOnly,
  } = props;
  const page = usePage();
  const state = page.state;
  const { handleApiCall } = useButtonLogic({ mutation, navigator, state });

  // FormButtonBuilder의 에러 처리 로직 (form 타입일 때만)
  const hasFormErrors =
    buttonType === 'form' &&
    state?.form?.button?.errorMessages &&
    Object.keys(state.form.button.errorMessages).length > 0;

  // 버튼 validation 체크 함수
  const validateButton = (): { isValid: boolean; errorMessage?: string } => {
    // validationFields가 있으면 개별 필드 검증 사용
    console.log('toJs mobx page state', toJS(state));
    if (mutation?.validationFields) {
      return FormValidationUtil.validateFields(state, mutation.validationFields);
    }

    // validationFields가 없으면 검증하지 않음
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
        onPress={e => {
          if (onBeforePress) {
            onBeforePress(e);
          }
          onPress();
        }}
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
