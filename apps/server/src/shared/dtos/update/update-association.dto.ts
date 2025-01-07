import { PartialType } from '@nestjs/swagger';
import { CreateAssociationDto } from '../create/create-association.dto';

export class UpdateAssociationDto extends PartialType(CreateAssociationDto) {}
