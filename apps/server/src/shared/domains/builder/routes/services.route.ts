import { RouteBuilder } from '@shared/types';
import { servicesLayout } from '../layouts/services.layout';

export const servicesRoute: RouteBuilder = {
  name: '서비스',
  pathname: 'services',
  layout: servicesLayout,
};
