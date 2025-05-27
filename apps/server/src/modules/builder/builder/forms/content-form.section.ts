import { Injectable } from '@nestjs/common';
import { FormBuilder, SectionBuilder } from '@shared/types';
import { TitleInput } from '../inputs/title.input';
import { DescriptionInput } from '../inputs/description.input';
import { DepotInput } from '../inputs/depot.input';
import { TextInput } from '../inputs/text.input';

@Injectable()
export class ContentFormSection {
  constructor(
    readonly titleInput: TitleInput,
    readonly descriptionInput: DescriptionInput,
    readonly depotInput: DepotInput,
    readonly textInput: TextInput,
  ) {}

  getMeta() {
    const titleInput = this.titleInput.getMeta();
    const descriptionInput = this.descriptionInput.getMeta();
    const depotInput = this.depotInput.getMeta();
    const textInput = this.textInput.getMeta();
    const section: SectionBuilder = {
      name: '콘텐츠 정보',
      stacks: [
        {
          type: 'VStack',
          inputs: [titleInput, descriptionInput, textInput, depotInput],
        },
      ],
    };

    return section;
  }
}
