import { OptionDto } from '../../../dto';
import { ServiceEntity } from '../service.entity';
import { ApiProperty } from '@nestjs/swagger';

class Form {
  @ApiProperty({
    type: () => [OptionDto],
  })
  nameOptions: OptionDto[];
}

export class ServiceFormDto {
  @ApiProperty({
    type: () => Form,
  })
  form: Form;

  @ApiProperty()
  schema: object;

  @ApiProperty()
  defaultObject: ServiceEntity;
}
