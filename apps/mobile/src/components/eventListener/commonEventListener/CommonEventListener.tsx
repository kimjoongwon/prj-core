import {View} from '@components';
import {useOnChangedOrientation, useOrientation} from '@hooks';
import React from 'react';
import {useWebView} from 'src/providers';
export const CommonEventListener = () => {
  const {currentUrl} = useWebView();
  const orientation = useOrientation();
  useOnChangedOrientation(orientation, currentUrl || '');
  return <View />;
};
