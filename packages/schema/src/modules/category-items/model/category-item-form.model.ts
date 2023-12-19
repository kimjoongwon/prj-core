import { IntersectionType, ObjectType, OmitType } from '@nestjs/graphql';
import { CategoryItem } from './category-item.model';
import { BASE_FIELDS } from '../../../common/constants';

@ObjectType()
export class AdditionalForm {}

@ObjectType()
export class CategoryItemForm extends IntersectionType(
  OmitType(CategoryItem, BASE_FIELDS, ObjectType),
  AdditionalForm,
  ObjectType,
) {}
