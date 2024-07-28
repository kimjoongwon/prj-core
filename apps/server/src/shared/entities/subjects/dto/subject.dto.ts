import { StringField } from 'src/shared/decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Subject } from '../subject.entity';

export class SubjectDto extends AbstractDto implements Subject {
  @StringField()
  name: string;
}
