import {useOnPressBackButton, usePipActionChanged} from '@hooks';
import React from 'react';

export const AndroidEventListenr = () => {
  usePipActionChanged();
  usePipActionChanged();
  useOnPressBackButton();

  return <></>;
};
