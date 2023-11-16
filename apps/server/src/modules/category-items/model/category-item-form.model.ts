import { IntersectionType, ObjectType, OmitType } from '@nestjs/graphql';
import { GetOmitFields } from '@common';
import { CategoryItem } from './category-item.model';
import { CreateCategoryItemInput } from '../dto/create-category-item.input';

@ObjectType()
export class AdditionalForm {}

@ObjectType()
export class CategoryItemForm extends IntersectionType(
  OmitType(CategoryItem, GetOmitFields(), ObjectType),
  AdditionalForm,
  ObjectType,
) {}
