import { PartialType } from '@nestjs/swagger';
import { CreateAbilityDto } from '../create/create-ability.dto';

export class UpdateAbilityDto extends PartialType(CreateAbilityDto) {}
