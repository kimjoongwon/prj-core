import { RouteBuilder } from '@shared/types';
import { getTenanciesLayout } from '../layouts/tenancies.layout';

export const spacesRoute: RouteBuilder = {
  name: '공간',
  pathname: 'spaces',
  layout: getTenanciesLayout(),
};
