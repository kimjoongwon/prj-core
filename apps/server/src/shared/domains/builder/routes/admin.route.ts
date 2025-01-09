import { RouteBuilder } from '@shared/types';
import { adminLayout } from '../layouts/admin.layout';

export const adminRoute: RouteBuilder = {
  name: '어드민',
  pathname: 'admin',
  layout: adminLayout,
};
