import { RouteBuilder } from '@shared/types';
import { GroupNewEditLayout } from '../layouts/group-new-edit.layout';

export const groupNewEditRoute: RouteBuilder = {
  name: '그룹 생성',
  pathname: 'new/edit',
  layout: GroupNewEditLayout,
};
