import {useDefaultLang} from '@hooks';
import {translate} from '@utils';
import React from 'react';
import {
  Text as BaseText,
  TextProps as BaseTextProps,
  StyleSheet,
} from 'react-native';

interface TextProps extends BaseTextProps {
  underline?: boolean;
}

export const Text = (props: TextProps) => {
  const {defaultLang} = useDefaultLang();

  const {style, children, ...rest} = props;

  let text: string | React.ReactNode | undefined = children;

  if (typeof children === 'string') {
    text = translate(children, defaultLang);
  }

  return (
    <BaseText style={[styles.text, style]} {...rest} allowFontScaling={false}>
      {text}
    </BaseText>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
});
