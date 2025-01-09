import { RouteBuilder } from '@shared/types';
import { rootLayout } from '../layouts/root.layout';

export const rootRoute: RouteBuilder = {
  name: 'ROOT',
  pathname: '/',
  layout: rootLayout,
};
