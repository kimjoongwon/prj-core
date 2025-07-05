import { StringField } from '../../decorator';
import { QueryDto } from './query.dto';

export class QueryWorkspaceDto extends QueryDto {
  @StringField()
  name: string;
}
