import { CreateAssignmentDto } from '../../../entities/assignments/dtos/create-assignment.dto';
import { UUIDField } from '../../../decorators';

export class CreateUserAssignmentDto extends CreateAssignmentDto {
  @UUIDField()
  userId: string;
}
