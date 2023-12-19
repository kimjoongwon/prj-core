import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Directive, Field, InputType } from '@nestjs/graphql';
import { ProfileInput } from './profile.input';

@InputType()
export class SignupInput {
  @IsEmail()
  @Directive('@upper')
  @Field()
  email: string;

  @Field(type => String)
  name: string;

  @IsNotEmpty()
  @MinLength(8)
  @Field()
  password: string;

  @ValidateNested()
  @Field()
  profile: ProfileInput;
}
