import { Injectable } from '@nestjs/common';
import { ButtonBuilder, FormBuilder, InputBuilder, SectionBuilder } from '@shared/types';
import _ from 'lodash';

type ButtonMode = '생성' | '수정';

type Options = {
  sections: SectionBuilder[];
  button: ButtonBuilder;
};

@Injectable()
export class FormBuilderService {
  buttonMode: ButtonMode;
  inputs: InputBuilder[];

  build({ sections, button }: Options) {
    return {
      name: '편집',
      button,
      sections,
    };
  }
}
