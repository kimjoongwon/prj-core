import { ProfileInput } from '@modules/auth/dto/profile.input';
import { Profile } from '@modules/profiles/entities/profile.entity';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field()
  profile: ProfileInput;
}
