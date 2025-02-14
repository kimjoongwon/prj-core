import { CreateCategoryDto } from '../../../dtos';
import { CategoryNames } from '../../../enums/category-names.enum';

export const categroySeed: CreateCategoryDto[] = [
  {
    name: CategoryNames.VIDEO_CONTENT.name,
    type: 'ROOT',
    parentId: null,
    serviceId: '',
    tenancyId: '',
  },
  {
    name: CategoryNames.DOCUMENT_CONTENT.name,
    type: 'ROOT',
    parentId: null,
    serviceId: '',
    tenancyId: '',
  },
  {
    name: CategoryNames.AUDIO_CONTENT.name,
    type: 'ROOT',
    parentId: null,
    serviceId: '',
    tenancyId: '',
  },
  {
    name: CategoryNames.IMAGE_CONTENT.name,
    type: 'ROOT',
    parentId: null,
    serviceId: '',
    tenancyId: '',
  },
  {
    name: CategoryNames.THUMBNAIL_IMAGE.name,
    type: 'ROOT',
    parentId: null,
    serviceId: '',
    tenancyId: '',
  },
  {
    name: CategoryNames.THUMBNAIL_VIDEO.name,
    type: 'ROOT',
    parentId: null,
    serviceId: '',
    tenancyId: '',
  },
];
