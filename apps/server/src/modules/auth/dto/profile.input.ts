import { Directive, Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class ProfileInput {
  @IsNotEmpty()
  @MinLength(2)
  @Field()
  phone: string;

  @IsNotEmpty()
  @MinLength(2)
  @Field()
  nickname: string;
}
