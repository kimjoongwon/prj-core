import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Service } from '../../services/models/service.model';
import { CategoryItem } from '../../category-items/model/category-item.model';
import { Base } from '../../../common/interfaces/base.interface';
import { Category as CoCCategory } from '@prisma/client';

@ObjectType()
export class Category extends Base implements CoCCategory {
  @Field(type => String)
  serviceId: string;

  @Field(type => String)
  categoryItemId: string;

  @Field(type => String)
  tenantId: string;

  @Field(type => String)
  name: string;

  @Field(type => Service)
  service: Service;

  @Field(type => CategoryItem)
  categoryItem: CategoryItem;
}
