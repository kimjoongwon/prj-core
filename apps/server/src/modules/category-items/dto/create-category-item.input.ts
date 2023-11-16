import { InputType, OmitType } from '@nestjs/graphql';
import { CategoryItem } from '../model';
import { GetOmitFields } from '@common';
@InputType()
export class CreateCategoryItemInput extends OmitType(
  CategoryItem,
  GetOmitFields(),
  InputType,
) {}
