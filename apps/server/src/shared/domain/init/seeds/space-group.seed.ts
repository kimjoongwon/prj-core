import { CreateGroupDto } from '../../../dto';
import { GroupNames } from '../../../enum/group-names.enum';

export const spaceGroupSeed: CreateGroupDto[] = [
  {
    name: GroupNames.TEAM_TRAINING.name,
    label: '',
    tenantId: '',
  },
  {
    name: GroupNames.PERSONAL_TRAINNING.name,
    label: '',
    tenantId: '',
  },
  {
    name: GroupNames.GROUND.name,
    label: '',
    tenantId: '',
  },
  {
    name: GroupNames.PILATES.name,
    label: '',
    tenantId: '',
  },
];
