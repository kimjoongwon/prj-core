import { IntersectionType, ObjectType, OmitType } from '@nestjs/graphql';
import { Group } from './group.model';
import { BASE_FIELDS } from '../../../common/constants';

@ObjectType()
class AdditionalForm {}
@ObjectType()
export class GroupForm extends IntersectionType(
  OmitType(Group, BASE_FIELDS, ObjectType),
  AdditionalForm,
) {}

export const defaultGroupForm: GroupForm = {
  name: '',
  tenantId: '',
  serviceId: '',
};
