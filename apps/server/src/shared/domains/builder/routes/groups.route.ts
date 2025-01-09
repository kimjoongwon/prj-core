import { RouteBuilder } from '@shared/types';
import { groupsLayout } from '../layouts/groups.layout';

export const groupsRoute: RouteBuilder = {
  name: '그룹',
  pathname: 'groups',
  layout: groupsLayout,
  children: [],
};
