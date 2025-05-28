import { CreateCategoryDto } from '../../../dto';
import { CategoryNames } from '../../../enum/category-names.enum';

export const fileCategroySeed: CreateCategoryDto[] = [
  {
    name: CategoryNames.VIDEO_CONTENT.name,
    type: 'ROOT',
    parentId: null,
    tenantId: '',
  },
  {
    name: CategoryNames.DOCUMENT_CONTENT.name,
    type: 'ROOT',
    parentId: null,
    tenantId: '',
  },
  {
    name: CategoryNames.AUDIO_CONTENT.name,
    type: 'ROOT',
    parentId: null,
    tenantId: '',
  },
  {
    name: CategoryNames.IMAGE_CONTENT.name,
    type: 'ROOT',
    parentId: null,
    tenantId: '',
  },
  {
    name: CategoryNames.THUMBNAIL_IMAGE.name,
    type: 'ROOT',
    parentId: null,
    tenantId: '',
  },
  {
    name: CategoryNames.THUMBNAIL_VIDEO.name,
    type: 'ROOT',
    parentId: null,
    tenantId: '',
  },
];
