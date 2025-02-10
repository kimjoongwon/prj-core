import { getAllMetadata } from '../decorators/error-message.decorator';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { FormTypeKey, SectionNameKey } from '../decorators/field.decorators';
import { CreateExerciseDto } from '../dtos';
import { groupBy } from 'lodash';
import { PageBuilder, SectionBuilder } from '@shared/types';

export function pageBuilder<T extends object>(
  ClassConstructor: ClassConstructor<unknown> = CreateExerciseDto,
  defaultObject: T,
) {
  if (!ClassConstructor) {
    throw new Error('ClassConstructor 필수 입니다.');
  }

  let sections: SectionBuilder[] = [];

  const dto = plainToInstance(ClassConstructor, defaultObject);
  const metadata = getAllMetadata(dto);

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

  const page: PageBuilder = {
    name: '정보',
    type: 'Page',
    state: {
      form: {
        inputs: defaultObject,
      },
    },
    form: {
      name: '정보',
      button: {
        name: '저장',
        mutation: {
          name: '',
          payloadPath: '',
        },
        navigator: {
          pathname: '..',
        },
      },
      sections,
    },
  };

  return page;
}
