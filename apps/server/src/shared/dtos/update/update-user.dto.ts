import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UpdatePostDto } from '../../posts';
import { ClassField } from '../../decorators';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ClassField(() => UpdatePostDto, { nullable: true, required: false })
  post?: UpdatePostDto;
}
