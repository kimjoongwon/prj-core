import { PartialType } from '@nestjs/swagger';
import { CreateSpaceClassificationDto } from '../create/create-space-classification.dto';

export class UpdateSpaceClassificationDto extends PartialType(CreateSpaceClassificationDto) {}
