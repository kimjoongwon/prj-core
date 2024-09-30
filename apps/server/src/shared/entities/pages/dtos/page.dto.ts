import { $Enums, Prisma } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Page } from '../page.entity';
import { EnumField } from '../../../decorators';
import { IsJSON, IsString } from 'class-validator';
import { Pathnames } from '../types/pathname.enum';

export const pathnames = [
  { pathname: 'admin', name: '관리자' },
  { pathname: 'admin/dashboard', name: '대시보드' },
  { pathname: 'admin/auth', name: '인증' },
  { pathname: 'admin/auth/login', name: '로그인' },
  { pathname: 'admin/main', name: '메인' },
  { pathname: 'admin/main/services', name: '서비스 관리' },
  { pathname: 'admin/main/services/:serviceId', name: '서비스 상세' },
  { pathname: 'admin/main/services/:serviceId/spaces', name: '공간 관리' },
  { pathname: 'admin/main/services/:serviceId/spaces/:spaceId', name: '공간 상세' },
  { pathname: 'admin/main/services/:serviceId/spaces/:spaceId/edit', name: '공간 편집' },
  { pathname: 'admin/main/services/:serviceId/timelineItems', name: '타임라인 관리' },
  {
    pathname: 'admin/main/services/:serviceId/timelineItems/:timelineItemId',
    name: '타임라인 상세',
  },
  {
    pathname: 'admin/main/services/:serviceId/timelineItems/:timelineItemId/edit',
    name: '타임라인 편집',
  },
  { pathname: 'admin/main/services/:serviceId/sessions', name: '세션 관리' },
  { pathname: 'admin/main/services/:serviceId/sessions/:sessionId', name: '세션 상세' },
  { pathname: 'admin/main/services/:serviceId/sessions/:sessionId/edit', name: '세션 편집' },
  { pathname: 'admin/main/services/:serviceId/templates', name: '템플릿 관리' },
  { pathname: 'admin/main/services/:serviceId/templates/:templateId', name: '템플릿 상세' },
  { pathname: 'admin/main/services/:serviceId/templates/:templateId/edit', name: '템플릿 편집' },
  { pathname: 'admin/main/services/:serviceId/categories', name: '카테고리 관리' },
  { pathname: 'admin/main/services/:serviceId/groups', name: '그룹 관리' },
  { pathname: 'admin/main/services/:serviceId/categories/:categoryId', name: '카테고리 상세' },
  { pathname: 'admin/main/services/:serviceId/categories/:categoryId/edit', name: '카테고리 수정' },
];

export class PageDto extends AbstractDto implements Page {
  @EnumField(() => $Enums.PageTypes)
  type: $Enums.PageTypes;

  @IsString()
  name: string;

  @EnumField(() => Pathnames)
  pathname: Pathnames;

  @IsJSON()
  params: Prisma.JsonValue;
}
