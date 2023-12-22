import {
  Field,
  InterfaceType,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';

@InterfaceType()
class Base {
  @Field(() => String)
  createdtAt: string;
}

@ObjectType()
export class AceUser extends PartialType(Base, ObjectType) {
  @Field()
  name: string;

  @Field()
  age: number;
}

// "@apollo/subgraph": "^2.0.0",
// "@nestjs/common": "^9.3.8 || ^10.0.0",
// "@nestjs/core": "^9.3.8 || ^10.0.0",
// "class-transformer": "*",
// "class-validator": "*",
// "graphql": "^16.6.0",
// "reflect-metadata": "^0.1.13",
// "ts-morph": "^16.0.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^20.0.0"
