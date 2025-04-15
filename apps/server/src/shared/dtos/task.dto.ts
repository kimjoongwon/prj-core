import { Task as TaskEntity } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { UUIDField } from '../decorators';

// export const createTaskValidationObject: Omit<ValidationRecord<CreateTaskDto>, 'content'> = {
//   name: {
//     required: {
//       value: true,
//       message: '이름은 필수입니다.',
//     },
//   },
//   label: {
//     required: {
//       value: true,
//       message: '라벨은 필수입니다.',
//     },
//   },
// };

// export const defaultCreateTaskDtoObject: Omit<CreateTaskDto, 'content'> = {
//   name: '',
//   label: '',
// };

export class TaskDto extends AbstractDto implements TaskEntity {
  @UUIDField()
  tenantId: string;
}
