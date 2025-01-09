import { RouteBuilder } from '@shared/types';
import { groupLayout } from '../layouts/group.layout';

export const groupIdRoute: RouteBuilder = {
  name: '그룹 상세',
  pathname: ':groupId',
  layout: groupLayout,
  children: [],
};
