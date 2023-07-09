import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Directive, Field, InputType } from '@nestjs/graphql';
import { ProfileInput } from './profile.input';
import { Type } from 'class-transformer';

@InputType()
export class SignupInput {
  @IsEmail()
  @Directive('@upper')
  @Field()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Field()
  password: string;

  @Type()
  @ValidateNested()
  @Field()
  profile: ProfileInput;
}
