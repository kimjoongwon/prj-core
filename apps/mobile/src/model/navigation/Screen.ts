import {Stack} from '@navigators';
import {Key} from 'react';

export interface Screen {
  key: Key;
  props: Parameters<typeof Stack.Screen>[0];
}
