import React from 'react';
import {Button as BaseButton, ButtonProps} from 'react-native';

interface BaseButtonProps extends ButtonProps {}

export const Button = (props: BaseButtonProps) => {
  return <BaseButton {...props} />;
};
