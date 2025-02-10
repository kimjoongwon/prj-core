import { OmitType } from '@nestjs/swagger';
import { EnumField, NumberField, StringField, UUIDField } from '../../decorators/field.decorators';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';
import { ExerciseDto } from '../exercise.dto';
import { CreateTaskDto } from './create-task.dto';
import { CreateContentDto } from './create-content.dto';
import { $Enums } from '@prisma/client';

export const defaultCreateExerciseDto: CreateExerciseDto = {
  name: '',
  label: '',
  title: '',
  type: 'Textarea',
  description: '',
  text: '',
  duration: 0,
  count: 0,
  thumbnails: [],
  tenancyId: '',
  serviceId: '',
  videos: [],
};

export type CreateDto = CreateTaskDto & CreateContentDto;

export class CreateExerciseDto
  extends OmitType(ExerciseDto, [...COMMON_ENTITY_FIELDS, 'taskId'])
  implements CreateDto
{
  @NumberField({
    min: 0,
    max: 1000,
    sectionName: '운동 상세 정보',
    label: '운동 시간',
    placeholder: '운동 시간을 입력해주세요',
  })
  duration: number;

  @NumberField({
    min: 0,
    max: 1000,
    sectionName: '운동 상세 정보',
    label: '운동 횟수',
    placeholder: '운동 횟수를 입력해주세요',
  })
  count: number;

  @StringField({
    label: '운동명',
    placeholder: '운동명을 입력해주세요',
    sectionName: '운동 정보',
  })
  name: string;

  @StringField({
    label: '운동 라벨',
    placeholder: '운동 라벨을 입력해주세요',
    sectionName: '운동 정보',
  })
  label: string;

  @StringField({
    label: '제목',
    placeholder: '제목을 입력해주세요',
    sectionName: '콘텐츠 정보',
  })
  title: string;

  @EnumField(() => $Enums.TextTypes)
  type: $Enums.TextTypes;

  @StringField({
    label: '설명',
    sectionName: '콘텐츠 정보',
    placeholder: '설명을 입력해주세요',
  })
  description: string;

  @StringField({
    formType: 'Textarea',
    label: '내용',
    sectionName: '콘텐츠 정보',
    placeholder: '내용을 입력해주세요',
  })
  text: string;

  @StringField({
    formType: 'Depot',
    label: '운동 이미지',
    sectionName: '콘텐츠 정보',
    placeholder: '운동 이미지를 입력해주세요',
    isArray: true,
  })
  thumbnails: string[];

  @StringField({
    formType: 'Depot',
    label: '운동 동영상',
    sectionName: '콘텐츠 정보',
    placeholder: '운동 동영상을 입력해주세요',
    isArray: true,
  })
  videos: string[];

  @UUIDField()
  tenancyId: string;

  @UUIDField()
  serviceId: string;
}
