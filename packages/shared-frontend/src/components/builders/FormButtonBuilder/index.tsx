import React from 'react';
import { Button } from '@heroui/react';
import { ButtonBuilder } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { useButtonLogic } from '../ButtonBuilder/useButtonLogic';
import { usePageState } from '../PageBuilder';
import { toJS } from 'mobx';

interface FormButtonBuilderProps extends ButtonBuilder {
  state?: any;
}

export const FormButtonBuilder = observer((props: FormButtonBuilderProps) => {
  const {
    children,
    variant = 'solid',
    color = 'primary',
    size = 'md',
    radius = 'md',
    isLoading = false,
    isDisabled = false,
    apiKey,
    ...rest
  } = props;

  const state = usePageState();
  const { handleApiCall } = useButtonLogic({ apiKey, state });
  // FormButtonBuilder는 state.form.button.errorMessages를 기반으로 버튼 비활성화 결정
  const hasErrors =
    state?.form?.button?.errorMessages &&
    Object.keys(state.form.button.errorMessages).length > 0;

  console.log(
    'state.form.button.errorMessages',
    toJS(state.form?.button?.errorMessages),
  );
  const isButtonDisabled = isDisabled || hasErrors;

  const handleClick = async () => {
    if (isButtonDisabled || isLoading) return;

    await handleApiCall();
  };

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      radius={radius}
      isLoading={isLoading}
      isDisabled={isButtonDisabled}
      onPress={handleClick}
      {...rest}
    >
      {children}
    </Button>
  );
});
