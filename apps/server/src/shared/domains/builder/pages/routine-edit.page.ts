import { Injectable } from '@nestjs/common';
import { FormBuilder, PageBuilder, RouteBuilder } from '@shared/types';
import { RoutinesService } from '../../../services';
import { ContentFormSection } from '../forms/content-form.section';
import { CreateRoutineDto } from '../../../dtos/create/create-routine.dto';
import { NameInput } from '../inputs/name.input';
import { ContextProvider } from '../../../providers/context.provider';

@Injectable()
export class RoutineEditPage {
  constructor(
    readonly routinesService: RoutinesService,
    readonly contentFormSection: ContentFormSection,
    readonly nameInput: NameInput,
  ) {}

  async getMeta(routineId: string, type: 'add' | 'edit') {
    const tenancyId = ContextProvider.getTenancyId();
    const routine = await this.routinesService.getById(routineId);

    const page: PageBuilder = {
      type: 'Page',
      name: '편집',
      state: {
        form: {
          inputs: {
            name: '',
            contentTitle: '',
            contentDescription: '',
            contentText: '',
            contentType: 'Textarea',
            taskIds: [],
            tenancyId,
          } as CreateRoutineDto,
        },
      },
      form: this.getRoutineForm(),
    };

    if (routineId !== 'new' && type === 'edit') {
      page.state.form = routine;
      page.form.button.mutation = {
        name: 'updateRoutine',
        id: routineId,
        payloadPath: 'form',
      };
    }

    return page;
  }

  getRoutineForm() {
    const contentFormSection = this.contentFormSection.getMeta();
    const nameInput = this.nameInput.getMeta();
    const form: FormBuilder = {
      button: {
        name: '저장',
        mutation: {
          name: 'createRoutine',
          payloadPath: 'form',
        },
      },
      sections: [
        {
          name: '기본 정보',
          stacks: [
            {
              type: 'VStack',
              inputs: [nameInput],
            },
          ],
        },
        contentFormSection,
      ],
    };

    return form;
  }
}
