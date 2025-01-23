import { OmitType } from '@nestjs/swagger';
import { RoutineDto } from '../routine.dto';

export class CreateRoutineDto extends OmitType(RoutineDto, ['id', 'createdAt', 'updatedAt']) {}
