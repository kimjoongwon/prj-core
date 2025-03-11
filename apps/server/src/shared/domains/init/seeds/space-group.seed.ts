import { CreateGroupDto } from '../../../dtos';
import { GroupNames } from '../../../enums/group-names.enum';

export const spaceGroupSeed: CreateGroupDto[] = [
  {
    name: GroupNames.TEAM_TRAINING.name,
    label: '',
    serviceId: '',
    tenantId: '',
  },
  {
    name: GroupNames.PERSONAL_TRAINNING.name,
    label: '',
    serviceId: '',
    tenantId: '',
  },
  {
    name: GroupNames.GROUND.name,
    label: '',
    serviceId: '',
    tenantId: '',
  },
  {
    name: GroupNames.PILATES.name,
    label: '',
    serviceId: '',
    tenantId: '',
  },
];
