import { Test, TestingModule } from '@nestjs/testing';
import { GroundMembersPage } from './ground-members.page';

describe('GroundMembersPage', () => {
  let service: GroundMembersPage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroundMembersPage],
    }).compile();

    service = module.get<GroundMembersPage>(GroundMembersPage);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('build', () => {
    it('should return a PageBuilder with correct structure', () => {
      const result = service.build();

      expect(result).toBeDefined();
      expect(result.name).toBe('그라운드 멤버 리스트');
      expect(result.sections).toBeDefined();
      expect(result.sections?.length).toBe(1);
    });

    it('should have DataGridBuilder element', () => {
      const result = service.build();
      const section = result.sections?.[0];
      const stack = section?.stacks?.[0];
      const element = stack?.elements?.[0];

      expect(element?.name).toBe('DataGridBuilder');
      expect(element?.props).toBeDefined();
    });

    it('should have proper table configuration', () => {
      const result = service.build();
      const section = result.sections?.[0];
      const stack = section?.stacks?.[0];
      const element = stack?.elements?.[0];
      const props = element?.props as any;

      expect(props.table).toBeDefined();
      expect(props.table.type).toBe('table');
      expect(props.table.query).toBeDefined();
      expect(props.table.query.name).toBe('useGetGroundMembersByQuery');
      expect(props.table.query.params).toEqual({
        skip: 0,
        take: 10,
      });
    });

    it('should have proper columns configuration', () => {
      const result = service.build();
      const section = result.sections?.[0];
      const stack = section?.stacks?.[0];
      const element = stack?.elements?.[0];
      const props = element?.props as any;
      const columns = props.table.columns;

      expect(columns).toBeDefined();
      expect(columns.length).toBe(7); // 6 data columns + 1 actions column

      // Check specific columns
      const nameColumn = columns.find((col: any) => col.accessorKey === 'user.name');
      expect(nameColumn).toBeDefined();
      expect(nameColumn.header.name).toBe('이름');

      const emailColumn = columns.find((col: any) => col.accessorKey === 'user.email');
      expect(emailColumn).toBeDefined();
      expect(emailColumn.header.name).toBe('이메일');

      const joinedAtColumn = columns.find((col: any) => col.accessorKey === 'joinedAt');
      expect(joinedAtColumn).toBeDefined();
      expect(joinedAtColumn.header.name).toBe('가입일');
      expect(joinedAtColumn.cell?.type).toBe('date');

      const actionsColumn = columns.find((col: any) => col.accessorKey === 'actions');
      expect(actionsColumn).toBeDefined();
      expect(actionsColumn.header.name).toBe('액션');
      expect(actionsColumn.cell?.type).toBe('row-actions');
    });

    it('should have proper action buttons', () => {
      const result = service.build();
      const section = result.sections?.[0];
      const stack = section?.stacks?.[0];
      const element = stack?.elements?.[0];
      const props = element?.props as any;
      const actionsColumn = props.table.columns.find((col: any) => col.accessorKey === 'actions');
      const buttons = actionsColumn.cell.buttons;

      expect(buttons).toBeDefined();
      expect(buttons.length).toBe(3);

      // Check detail button
      const detailButton = buttons.find((btn: any) => btn.children === '상세');
      expect(detailButton).toBeDefined();
      expect(detailButton.color).toBe('primary');
      expect(detailButton.startContent).toBe('eye');

      // Check edit button
      const editButton = buttons.find((btn: any) => btn.children === '수정');
      expect(editButton).toBeDefined();
      expect(editButton.color).toBe('warning');
      expect(editButton.startContent).toBe('edit');

      // Check delete button
      const deleteButton = buttons.find((btn: any) => btn.children === '삭제');
      expect(deleteButton).toBeDefined();
      expect(deleteButton.color).toBe('danger');
      expect(deleteButton.startContent).toBe('trash');
      expect(deleteButton.mutation).toBeDefined();
      expect(deleteButton.mutation.name).toBe('deleteGroundMemberById');
    });

    it('should have proper navigation buttons', () => {
      const result = service.build();
      const section = result.sections?.[0];
      const stack = section?.stacks?.[0];
      const element = stack?.elements?.[0];
      const props = element?.props as any;
      const buttons = props.buttons;

      expect(buttons).toBeDefined();
      expect(buttons.length).toBe(1);

      const addButton = buttons[0];
      expect(addButton.children).toBe('멤버 추가');
      expect(addButton.color).toBe('primary');
      expect(addButton.startContent).toBe('plus-circle');
      expect(addButton.navigator).toBeDefined();
      expect(addButton.navigator.type).toBe('push');
      expect(addButton.navigator.route.relativePath).toBe('new/create');
    });
  });
});
