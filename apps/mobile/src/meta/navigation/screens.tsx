import React from 'react';
import {Screen} from '@model';
import {SafeAreaView} from '@components';
import {baseScreens} from './baseScreens';

const renderWithSafeArea =
  (Component: (props: any) => React.JSX.Element) => (props: any) => {
    return <SafeAreaView>{<Component {...props} />}</SafeAreaView>;
  };

export const screens: Screen[] = baseScreens.map(screen => {
  return {
    key: screen.key,
    props: {
      ...screen.props,
      component: renderWithSafeArea(screen.props.component!),
    },
  };
});
