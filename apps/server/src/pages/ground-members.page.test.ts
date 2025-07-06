import { getGroundMembersPage } from './ground-members.page';

describe('GroundMembersPage', () => {
  describe('페이지 기본 구성', () => {
    it('그라운드 멤버 리스트 페이지를 올바르게 구성해야 한다', () => {
      const result = getGroundMembersPage();

      expect(result.name).toBe('그라운드 멤버 리스트');
      expect(result.elements).toBeDefined();
      expect(result.elements).toHaveLength(1);
    });

    it('DataGridBuilder를 포함해야 한다', () => {
      const result = getGroundMembersPage();

      expect(result.elements[0].name).toBe('DataGridBuilder');
      expect(result.elements[0].props).toBeDefined();
    });
  });

  describe('DataGridBuilder 버튼 설정', () => {
    it('멤버 추가 버튼이 올바르게 설정되어야 한다', () => {
      const result = getGroundMembersPage();
      const dataGrid = result.elements[0];
      const buttons = dataGrid.props.buttons;

      expect(buttons).toHaveLength(1);

      const addButton = buttons[0];
      expect(addButton.children).toBe('멤버 추가');
      expect(addButton.variant).toBe('solid');
      expect(addButton.color).toBe('primary');
      expect(addButton.size).toBe('md');
      expect(addButton.radius).toBe('lg');
      expect(addButton.startContent).toBe('plus-circle');
    });

    it('추가 버튼의 네비게이션이 올바르게 설정되어야 한다', () => {
      const result = getGroundMembersPage();
      const addButton = result.elements[0].props.buttons[0];

      expect(addButton.navigator.type).toBe('push');
      expect(addButton.navigator.route.relativePath).toBe('new/create');
    });

    it('추가 버튼에 올바른 스타일이 적용되어야 한다', () => {
      const result = getGroundMembersPage();
      const addButton = result.elements[0].props.buttons[0];

      expect(addButton.className).toBe(
        'font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200'
      );
    });
  });

  describe('DataGridBuilder 테이블 설정', () => {
    it('올바른 테이블 타입과 쿼리를 가져야 한다', () => {
      const result = getGroundMembersPage();
      const dataGrid = result.elements[0];
      const table = dataGrid.props.table;

      expect(table.type).toBe('table');
      // TODO 주석이 있는 대로 쿼리명 변경 필요
      expect(table.query.name).toBe('useGetTenantsByQuery');
      expect(table.query.params).toEqual({
        skip: 0,
        take: 10,
      });
    });

    it('올바른 컬럼 구성을 가져야 한다', () => {
      const result = getGroundMembersPage();
      const columns = result.elements[0].props.table.columns;

      expect(columns).toHaveLength(7);

      const expectedColumns = [
        { accessorKey: 'user.name', headerName: '이름' },
        { accessorKey: 'user.email', headerName: '이메일' },
        { accessorKey: 'user.phone', headerName: '전화번호' },
        { accessorKey: 'role', headerName: '역할' },
        { accessorKey: 'status', headerName: '상태' },
        { accessorKey: 'joinedAt', headerName: '가입일' },
        { accessorKey: 'actions', headerName: '액션' },
      ];

      expectedColumns.forEach((expected, index) => {
        expect(columns[index].accessorKey).toBe(expected.accessorKey);
        expect(columns[index].header.name).toBe(expected.headerName);
      });
    });

    it('가입일 컬럼이 date 타입이어야 한다', () => {
      const result = getGroundMembersPage();
      const joinedAtColumn = result.elements[0].props.table.columns.find(
        col => col.accessorKey === 'joinedAt'
      );

      expect(joinedAtColumn.cell.type).toBe('date');
    });
  });

  describe('액션 컬럼 설정', () => {
    it('액션 컬럼이 row-actions 타입이어야 한다', () => {
      const result = getGroundMembersPage();
      const actionsColumn = result.elements[0].props.table.columns.find(
        col => col.accessorKey === 'actions'
      );

      expect(actionsColumn.cell.type).toBe('row-actions');
      expect(actionsColumn.cell.buttons).toHaveLength(3);
    });

    it('상세 버튼이 올바르게 설정되어야 한다', () => {
      const result = getGroundMembersPage();
      const actionsColumn = result.elements[0].props.table.columns.find(
        col => col.accessorKey === 'actions'
      );
      const detailButton = actionsColumn.cell.buttons[0];

      expect(detailButton.children).toBe('상세');
      expect(detailButton.color).toBe('primary');
      expect(detailButton.startContent).toBe('eye');
      expect(detailButton.navigator.type).toBe('push');
      expect(detailButton.navigator.route.relativePath).toBe(':memberId/detail');
      expect(detailButton.navigator.route.pathParams.memberId).toBe('selectedRow.id');
    });

    it('수정 버튼이 올바르게 설정되어야 한다', () => {
      const result = getGroundMembersPage();
      const actionsColumn = result.elements[0].props.table.columns.find(
        col => col.accessorKey === 'actions'
      );
      const editButton = actionsColumn.cell.buttons[1];

      expect(editButton.children).toBe('수정');
      expect(editButton.color).toBe('warning');
      expect(editButton.startContent).toBe('edit');
      expect(editButton.navigator.type).toBe('push');
      expect(editButton.navigator.route.relativePath).toBe(':memberId/modify');
      expect(editButton.navigator.route.pathParams.memberId).toBe('selectedRow.id');
    });

    it('삭제 버튼이 올바르게 설정되어야 한다', () => {
      const result = getGroundMembersPage();
      const actionsColumn = result.elements[0].props.table.columns.find(
        col => col.accessorKey === 'actions'
      );
      const deleteButton = actionsColumn.cell.buttons[2];

      expect(deleteButton.children).toBe('삭제');
      expect(deleteButton.color).toBe('danger');
      expect(deleteButton.startContent).toBe('trash');
      expect(deleteButton.mutation.name).toBe('deleteGroundMemberById');
      expect(deleteButton.mutation.pathParams.memberId).toBe('selectedRow.id');
      expect(deleteButton.mutation.queryKey).toBe('/api/v1/ground-members');
    });
  });

  describe('액션 버튼 공통 스타일링', () => {
    it('액션 버튼들에 올바른 공통 스타일이 적용되어야 한다', () => {
      const result = getGroundMembersPage();
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

  describe('사용자 정보 컬럼', () => {
    it('사용자 관련 컬럼들이 올바른 경로를 가져야 한다', () => {
      const result = getGroundMembersPage();
      const columns = result.elements[0].props.table.columns;

      const nameColumn = columns.find(col => col.accessorKey === 'user.name');
      const emailColumn = columns.find(col => col.accessorKey === 'user.email');
      const phoneColumn = columns.find(col => col.accessorKey === 'user.phone');

      expect(nameColumn).toBeDefined();
      expect(emailColumn).toBeDefined();
      expect(phoneColumn).toBeDefined();

      expect(nameColumn.header.name).toBe('이름');
      expect(emailColumn.header.name).toBe('이메일');
      expect(phoneColumn.header.name).toBe('전화번호');
    });
  });

  describe('멤버 상태 컬럼', () => {
    it('역할과 상태 컬럼이 올바르게 설정되어야 한다', () => {
      const result = getGroundMembersPage();
      const columns = result.elements[0].props.table.columns;

      const roleColumn = columns.find(col => col.accessorKey === 'role');
      const statusColumn = columns.find(col => col.accessorKey === 'status');

      expect(roleColumn).toBeDefined();
      expect(statusColumn).toBeDefined();

      expect(roleColumn.header.name).toBe('역할');
      expect(statusColumn.header.name).toBe('상태');
    });
  });

  describe('타입 안전성', () => {
    it('DataGridBuilderProps 타입을 만족해야 한다', () => {
      const result = getGroundMembersPage();
      const dataGrid = result.elements[0];

      expect(dataGrid.props.table).toBeDefined();
      expect(dataGrid.props.buttons).toBeDefined();
      expect(Array.isArray(dataGrid.props.buttons)).toBe(true);
      expect(Array.isArray(dataGrid.props.table.columns)).toBe(true);
    });
  });

  describe('페이지 구조 검증', () => {
    it('elements 기반 구조를 사용해야 한다', () => {
      const result = getGroundMembersPage();

      expect(result.elements).toBeDefined();
      expect(result.elements).toBeDefined();
    });

    it('페이지 상태(state)가 정의되지 않아도 문제없어야 한다', () => {
      const result = getGroundMembersPage();

      expect(result.state).toBeUndefined();
    });
  });

  describe('TODO 항목 검증', () => {
    it('쿼리명이 변경되어야 한다는 TODO가 있다', () => {
      const result = getGroundMembersPage();
      const table = result.elements[0].props.table;

      // 현재는 useGetTenantsByQuery를 사용하지만 적절한 멤버 쿼리로 변경되어야 함
      expect(table.query.name).toBe('useGetTenantsByQuery');
    });
  });
});
