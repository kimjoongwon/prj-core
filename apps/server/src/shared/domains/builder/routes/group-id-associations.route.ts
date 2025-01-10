import { RouteBuilder } from '@shared/types';
import { getAssociationsPage } from '../pages/assignments.page';

export const groupIdAssociationsRoute: RouteBuilder = {
  name: '그룹 할당',
  pathname: 'associations',
  layout: {
    page: getAssociationsPage(),
  },
};
