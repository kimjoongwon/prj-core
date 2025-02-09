import { getAllMetadata } from '../decorators/error-message.decorator';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { FormTypeKey, SectionNameKey } from '../decorators/field.decorators';
import { CreateExerciseDto } from '../dtos';
import { groupBy } from 'lodash';
import { SectionBuilder } from '@shared/types';

export function builder<T extends object>(
  ClassConstructor: ClassConstructor<unknown> = CreateExerciseDto,
  defaultObject: T,
) {
  if (!ClassConstructor) {
    throw new Error('ClassConstructor 필수 입니다.');
  }

  let sections: SectionBuilder[] = [];

  const dto = plainToInstance(ClassConstructor, defaultObject);
  const metadata = getAllMetadata(dto);

  // console.log('metadata', metadata);
  console.log(metadata);

  const metaDataGroupedBySectionName = groupBy(metadata, (value) => value?.[SectionNameKey]);
  const metaDataKeysGroupedBySectionName = Object.keys(metaDataGroupedBySectionName);

  metaDataKeysGroupedBySectionName.forEach((sectionName) => {
    const inputs = metaDataGroupedBySectionName[sectionName].map((value) => value?.[FormTypeKey]);
    if (sectionName !== 'undefined') {
      sections.push({
        name: sectionName,
        stacks: [
          {
            type: 'VStack',
            inputs,
          },
        ],
      });
    }
  });

  console.log('sections', sections);

  // Object.entries(metadata).forEach(([key, value]) => {
  //   if (value?.[FormTypeKey]) {
  //     value[FormTypeKey].path = key;
  //     inputs.push(value?.[FormTypeKey]);
  //   }
  // });

  return sections;
}
