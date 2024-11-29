import { StringField } from '../../../decorators';

export class RouteDto {
  @StringField({ description: '탭 이름' })
  name: string;

  @StringField({ description: '탭 경로' })
  pathname: string;
}
