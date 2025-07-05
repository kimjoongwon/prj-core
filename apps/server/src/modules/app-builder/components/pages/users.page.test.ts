import { getUsersPage } from './users.page';

describe('UsersPage', () => {
  describe('페이지 기본 구성', () => {
    it('사용자 리스트 페이지를 올바르게 구성해야 한다', () => {
      const result = getUsersPage();

      expect(result.name).toBe('사용자 리스트');
      expect(result.elements).toBeDefined();
      expect(result.elements).toHaveLength(1);
    });

    it('DataGridBuilder를 포함해야 한다', () => {
      const result = getUsersPage();

      expect(result.elements[0].name).toBe('DataGridBuilder');
      expect(result.elements[0].props).toBeDefined();
    });
  });

  describe('DataGridBuilder 설정', () => {
    it('올바른 테이블 타입을 가져야 한다', () => {
      const result = getUsersPage();
      const dataGrid = result.elements[0];

      expect(dataGrid.props.table.type).toBe('table');
    });

    it('올바른 쿼리 설정을 가져야 한다', () => {
      const result = getUsersPage();
      const dataGrid = result.elements[0];

      expect(dataGrid.props.table.query.name).toBe('useGetUsersByQuery');
      expect(dataGrid.props.table.query.params).toEqual({
        skip: 0,
        take: 10,
      });
    });

    it('페이지네이션이 활성화되어야 한다', () => {
      const result = getUsersPage();
      const dataGrid = result.elements[0];

      expect(dataGrid.props.table.pagination.enabled).toBe(true);
      expect(dataGrid.props.table.pagination.defaultTake).toBe(10);
    });

    it('올바른 컬럼 설정을 가져야 한다', () => {
      const result = getUsersPage();
      const dataGrid = result.elements[0];
      const columns = dataGrid.props.table.columns;

      expect(columns).toHaveLength(2);

      // 이름 컬럼
      expect(columns[0].accessorKey).toBe('name');
      expect(columns[0].header.name).toBe('이름');

      // 전화번호 컬럼
      expect(columns[1].accessorKey).toBe('phone');
      expect(columns[1].header.name).toBe('전화번호');
    });
  });

  describe('타입 안전성', () => {
    it('DataGridBuilderProps 타입을 만족해야 한다', () => {
      const result = getUsersPage();
      const dataGrid = result.elements[0];

      // DataGridBuilderProps 타입 체크 (컴파일 타임)
      expect(dataGrid.props.table).toBeDefined();
      expect(typeof dataGrid.props.table.type).toBe('string');
      expect(typeof dataGrid.props.table.pagination.enabled).toBe('boolean');
    });
  });

  describe('페이지 구조 검증', () => {
    it('elements 기반 구조를 사용해야 한다', () => {
      const result = getUsersPage();

      expect(result.elements).toBeDefined();
      expect(result.sections).toBeUndefined();
    });

    it('페이지 상태(state)가 정의되지 않아도 문제없어야 한다', () => {
      const result = getUsersPage();

      expect(result.state).toBeUndefined();
    });
  });

  describe('컬럼 구성 상세 검증', () => {
    it('각 컬럼이 필수 속성을 가져야 한다', () => {
      const result = getUsersPage();
      const columns = result.elements[0].props.table.columns;

      columns.forEach((column, index) => {
        expect(column.accessorKey).toBeDefined();
        expect(typeof column.accessorKey).toBe('string');
        expect(column.header).toBeDefined();
        expect(column.header.name).toBeDefined();
        expect(typeof column.header.name).toBe('string');
      });
    });

    it('컬럼 accessorKey가 유효한 값이어야 한다', () => {
      const result = getUsersPage();
      const columns = result.elements[0].props.table.columns;
      const accessorKeys = columns.map(col => col.accessorKey);

      expect(accessorKeys).toContain('name');
      expect(accessorKeys).toContain('phone');
    });
  });
});
