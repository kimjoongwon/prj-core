import { $Enums, Prisma } from '@prisma/client';
import { ClassField, EnumField, StringFieldOptional, UUIDField } from '../../../decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Ability } from '../ability.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SubjectDto } from '../../subject/dto/subject.dto';

export class AbilityDto extends AbstractDto implements Ability {
  @EnumField(() => $Enums.AbilityTypes)
  type: $Enums.AbilityTypes;

  @UUIDField()
  roleId: string;

  @EnumField(() => $Enums.AbilityActions)
  action: $Enums.AbilityActions;

  @UUIDField()
  subjectId: string;

  @ApiProperty({
    required: false,
    description: 'A JSON object with a nested structure',
    type: Object,
    example: { createdBy: '1' },
  })
  conditions: Prisma.JsonValue | null;

  @StringFieldOptional()
  description: string | null;

  @ClassField(() => SubjectDto, { nullable: true, swagger: false })
  subject?: SubjectDto;
}
