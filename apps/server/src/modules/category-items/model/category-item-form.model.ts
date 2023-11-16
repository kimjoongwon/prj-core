import { IntersectionType, ObjectType, OmitType } from '@nestjs/graphql';
import { GetOmitFields } from '@common';
import { CategoryItem } from './category-item.model';

@ObjectType()
export class AdditionalForm {}
@ObjectType()
export class CategoryItemForm extends IntersectionType(
  OmitType(CategoryItem, GetOmitFields(), ObjectType),
  AdditionalForm,
  ObjectType,
) {}
