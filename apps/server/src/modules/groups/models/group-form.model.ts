import { IntersectionType, ObjectType, OmitType } from '@nestjs/graphql';
import { Group } from './group.model';
import { GetOmitFields } from '@common';

@ObjectType()
class AdditionalForm {}
@ObjectType()
export class GroupForm extends IntersectionType(
  OmitType(Group, GetOmitFields(), ObjectType),
  AdditionalForm,
) {}

export const defaultGroupForm: GroupForm = {
  name: {
    ko: '',
    en: '',
  },
  tenantId: '',
  serviceId: '',
};
