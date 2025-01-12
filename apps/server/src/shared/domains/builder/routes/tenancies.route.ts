import { RouteBuilder } from '@shared/types';
import { getTenanciesLayout } from '../layouts/tenancies.layout';

export const tenancies: RouteBuilder = {
  name: '공간',
  pathname: 'tenancies',
  layout: getTenanciesLayout(),
};
