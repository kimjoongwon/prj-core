import { getGroupsPage } from './groups.page';
import { $Enums } from '@prisma/client';

describe('GroupsPage', () => {
  const spaceType: $Enums.GroupTypes = 'Space';
  const userType: $Enums.GroupTypes = 'User';

  describe('페이지 기본 구성', () => {
    it('그룹 리스트 페이지를 올바르게 구성해야 한다', () => {
      const result = getGroupsPage(spaceType);

      expect(result.name).toBe('그룹 리스트');
      expect(result.elements).toBeDefined();
      expect(result.elements).toHaveLength(1);
    });

    it('DataGridBuilder를 포함해야 한다', () => {
      const result = getGroupsPage(spaceType);

      expect(result.elements[0].name).toBe('DataGridBuilder');
      expect(result.elements[0].props).toBeDefined();
    });
  });

  describe('DataGridBuilder 버튼 설정', () => {
    it('그룹 생성 버튼이 올바르게 설정되어야 한다', () => {
      const result = getGroupsPage(spaceType);
      const dataGrid = result.elements[0];
      const buttons = dataGrid.props.buttons;

      expect(buttons).toHaveLength(1);

      const createButton = buttons[0];
      expect(createButton.children).toBe('그룹 생성');
      expect(createButton.variant).toBe('solid');
      expect(createButton.color).toBe('primary');
      expect(createButton.size).toBe('md');
      expect(createButton.radius).toBe('lg');
      expect(createButton.startContent).toBe('plus-circle');
    });

    it('생성 버튼의 네비게이션이 올바르게 설정되어야 한다', () => {
      const result = getGroupsPage(spaceType);
      const createButton = result.elements[0].props.buttons[0];

      expect(createButton.navigator.type).toBe('push');
      expect(createButton.navigator.route.relativePath).toBe(':id/create');
      expect(createButton.navigator.route.params.id).toBe('new');
    });

    it('생성 버튼에 올바른 스타일이 적용되어야 한다', () => {
      const result = getGroupsPage(spaceType);
      const createButton = result.elements[0].props.buttons[0];

      expect(createButton.className).toBe(
        'font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200'
      );
    });
  });

  describe('DataGridBuilder 테이블 설정', () => {
    it('올바른 테이블 타입과 쿼리를 가져야 한다', () => {
      const result = getGroupsPage(spaceType);
      const dataGrid = result.elements[0];
      const table = dataGrid.props.table;

      expect(table.type).toBe('table');
      expect(table.query.name).toBe('useGetGroupsByQuery');
      expect(table.query.params).toEqual({
        skip: 0,
        take: 10,
        type: 'Space',
      });
    });

    it('페이지네이션이 활성화되어야 한다', () => {
      const result = getGroupsPage(spaceType);
      const table = result.elements[0].props.table;

      expect(table.pagination.enabled).toBe(true);
      expect(table.pagination.defaultTake).toBe(10);
    });

    it('올바른 컬럼 구성을 가져야 한다', () => {
      const result = getGroupsPage(spaceType);
      const columns = result.elements[0].props.table.columns;

      expect(columns).toHaveLength(3);

      const expectedColumns = [
        { accessorKey: 'name', headerName: '이름' },
        { accessorKey: 'label', headerName: '라벨' },
        { accessorKey: 'actions', headerName: '액션' },
      ];

      expectedColumns.forEach((expected, index) => {
        expect(columns[index].accessorKey).toBe(expected.accessorKey);
        expect(columns[index].header.name).toBe(expected.headerName);
      });
    });
  });

  describe('액션 컬럼 설정', () => {
    it('액션 컬럼이 row-actions 타입이어야 한다', () => {
      const result = getGroupsPage(spaceType);
      const actionsColumn = result.elements[0].props.table.columns.find(
        col => col.accessorKey === 'actions'
      );

      expect(actionsColumn.cell.type).toBe('row-actions');
      expect(actionsColumn.cell.buttons).toHaveLength(3);
    });

    it('상세 버튼이 올바르게 설정되어야 한다', () => {
      const result = getGroupsPage(spaceType);
      const actionsColumn = result.elements[0].props.table.columns.find(
        col => col.accessorKey === 'actions'
      );
      const detailButton = actionsColumn.cell.buttons[0];

      expect(detailButton.children).toBe('상세');
      expect(detailButton.color).toBe('primary');
      expect(detailButton.startContent).toBe('eye');
      expect(detailButton.navigator.type).toBe('push');
      expect(detailButton.navigator.route.name).toBe('그라운드 그룹 디테일');
      expect(detailButton.navigator.route.relativePath).toBe(':groupId/detail');
      expect(detailButton.navigator.route.pathParams.groupId).toBe('selectedRow.id');
    });

    it('수정 버튼이 올바르게 설정되어야 한다', () => {
      const result = getGroupsPage(spaceType);
      const actionsColumn = result.elements[0].props.table.columns.find(
        col => col.accessorKey === 'actions'
      );
      const editButton = actionsColumn.cell.buttons[1];

      expect(editButton.children).toBe('수정');
      expect(editButton.color).toBe('warning');
      expect(editButton.startContent).toBe('edit');
      expect(editButton.navigator.type).toBe('push');
      expect(editButton.navigator.route.relativePath).toBe(':groupId/modify');
      expect(editButton.navigator.route.pathParams.groupId).toBe('selectedRow.id');
    });

    it('삭제 버튼이 올바르게 설정되어야 한다', () => {
      const result = getGroupsPage(spaceType);
      const actionsColumn = result.elements[0].props.table.columns.find(
        col => col.accessorKey === 'actions'
      );
      const deleteButton = actionsColumn.cell.buttons[2];

      expect(deleteButton.children).toBe('삭제');
      expect(deleteButton.color).toBe('danger');
      expect(deleteButton.startContent).toBe('trash');
      expect(deleteButton.mutation.name).toBe('deleteGroupById');
      expect(deleteButton.mutation.pathParams.groupId).toBe('selectedRow.id');
      expect(deleteButton.mutation.queryKey).toBe('/api/v1/groups');
    });
  });

  describe('액션 버튼 공통 스타일링', () => {
    it('액션 버튼들에 올바른 공통 스타일이 적용되어야 한다', () => {
      const result = getGroupsPage(spaceType);
      const actionsColumn = result.elements[0].props.table.columns.find(
        col => col.accessorKey === 'actions'
      );
      const buttons = actionsColumn.cell.buttons;

      buttons.forEach(button => {
        expect(button.variant).toBe('light');
        expect(button.size).toBe('sm');
        expect(button.radius).toBe('sm');
        expect(button.isIconOnly).toBe(false);
        expect(button.className).toBe('min-w-unit-14 text-xs px-2 py-1');
      });
    });
  });

  describe('그룹 타입별 처리', () => {
    it('User 타입 그룹 쿼리가 올바르게 설정되어야 한다', () => {
      const result = getGroupsPage(userType);
      const table = result.elements[0].props.table;

      expect(table.query.params.type).toBe('User');
    });

    it('Space 타입 그룹 쿼리가 올바르게 설정되어야 한다', () => {
      const result = getGroupsPage(spaceType);
      const table = result.elements[0].props.table;

      expect(table.query.params.type).toBe('Space');
    });
  });

  describe('타입 안전성', () => {
    it('DataGridBuilderProps 타입을 만족해야 한다', () => {
      const result = getGroupsPage(spaceType);
      const dataGrid = result.elements[0];

      expect(dataGrid.props.table).toBeDefined();
      expect(dataGrid.props.buttons).toBeDefined();
      expect(Array.isArray(dataGrid.props.buttons)).toBe(true);
      expect(Array.isArray(dataGrid.props.table.columns)).toBe(true);
    });
  });

  describe('페이지 구조 검증', () => {
    it('elements 기반 구조를 사용해야 한다', () => {
      const result = getGroupsPage(spaceType);

      expect(result.elements).toBeDefined();
      expect(result.sections).toBeUndefined();
    });

    it('페이지 상태(state)가 정의되지 않아도 문제없어야 한다', () => {
      const result = getGroupsPage(spaceType);

      expect(result.state).toBeUndefined();
    });
  });
});
