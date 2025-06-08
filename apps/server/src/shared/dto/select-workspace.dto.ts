import { UUIDField } from '../decorator/field.decorators';

export class SelectWorkspaceDto {
  @UUIDField({
    description: '선택된 워크스페이스 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  selectedWorkspace: string;
}
