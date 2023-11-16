import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTenantInput {
  @Field(type => String)
  userId: string;

  @Field(type => String)
  spaceId: string;
}
