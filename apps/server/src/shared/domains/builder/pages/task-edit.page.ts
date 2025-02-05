import { Injectable } from '@nestjs/common';
import { PageBuilder } from '@shared/types';
import { NameInput } from '../inputs/name.input';
import { CreateTaskDto } from '../../../dtos';
import { LabelInput } from '../inputs/label.input';
import { TitleInput } from '../inputs/title.input';
import { DescriptionInput } from '../inputs/description.input';
import { TextInput } from '../inputs/text.input';
import { DepotInput } from '../inputs/depot.input';

@Injectable()
export class TaskEditPage {
  constructor(
    readonly nmaeInput: NameInput,
    readonly labelInput: LabelInput,
    readonly titleInput: TitleInput,
    readonly descriptionInput: DescriptionInput,
    readonly textInput: TextInput,
    readonly depotInput: DepotInput,
  ) {}

  getMeta(taskId: string | 'new', type: 'edit' | 'add') {
    const nameInput = this.nmaeInput.getMeta();
    const labelInput = this.labelInput.getMeta();
    const titleInput = this.titleInput.getMeta();
    const descriptionInput = this.descriptionInput.getMeta();
    const textInput = this.textInput.getMeta();
    const depotInput = this.depotInput.getMeta();

    const page: PageBuilder = {
      state: {
        form: {
          data: {
            name: '',
            label: '',
            routineId: '',
            contentId: '',
          } as CreateTaskDto,
        },
        dataGrid: {
          selectedRowIds: [],
        },
      },
      name: '편집',
      form: {
        button: {
          mutation: {
            name: 'createTask',
            payloadPath: 'form',
          },
          navigator: {
            pathname: '..',
          },
          name: '저장',
        },
        sections: [
          {
            name: '기본정보',
            stacks: [
              {
                type: 'VStack',
                inputs: [nameInput, labelInput],
              },
            ],
          },
          {
            name: '상세정보',
            stacks: [
              {
                type: 'VStack',
                inputs: [titleInput, descriptionInput, textInput, depotInput],
              },
            ],
          },
        ],
      },
    };

    if (taskId !== 'new' && type === 'edit') {
      page.form.button.mutation.name = 'updateTask';
      page.form.button.mutation.id = taskId;
    }

    return page;
  }
}
