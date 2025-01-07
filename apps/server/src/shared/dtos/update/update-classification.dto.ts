import { PartialType } from '@nestjs/swagger';
import { CreateClassificationDto } from '../create/create-classification.dto';

export class UpdateClassificationDto extends PartialType(CreateClassificationDto) {}
