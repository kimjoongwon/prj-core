import { getCategoriesPage } from './categories.page';
import { $Enums } from '@prisma/client';
import { ContextProvider } from '@shared';

// Mock ContextProvider
jest.mock('@shared', () => ({
  ContextProvider: {
    getTenantId: jest.fn(),
  },
}));

describe('CategoriesPage', () => {
  const mockTenantId = 'test-tenant-id';

  beforeEach(() => {
    (ContextProvider.getTenantId as jest.Mock).mockReturnValue(mockTenantId);
  });

  describe('build', () => {
    it('should create page configuration with all required buttons including delete', () => {
      const categoryType = $Enums.CategoryTypes.Role;
      const result = getCategoriesPage(categoryType);

      expect(result.name).toBe('카테고리 리스트');
      expect(result.state.inputs.type).toBe(categoryType);
      expect(result.state.inputs.tenantId).toBe(mockTenantId);

      // 테이블 설정 확인
      const dataGridSection = result.sections[0];
      const dataGridElement = dataGridSection.stacks[0].elements[0];
      expect(dataGridElement.name).toBe('DataGridBuilder');

      // 생성 버튼 확인
      const createButton = dataGridElement.props.buttons[0];
      expect(createButton.children).toBe('카테고리 생성');
      expect(createButton.color).toBe('primary');
      expect(createButton.navigator?.route?.fullPath).toBe(
        '/admin/dashboard/space-service/categories/:categoryId/create',
      );

      // 테이블 컬럼 확인
      const columns = dataGridElement.props.table.columns;
      expect(columns).toHaveLength(3);
      expect(columns[0].accessorKey).toBe('name');
      expect(columns[1].accessorKey).toBe('type');
      expect(columns[2].accessorKey).toBe('actions');

      // 액션 버튼들 확인
      const actionButtons = columns[2].cell.buttons;
      expect(actionButtons).toHaveLength(4); // 상세, 수정, 추가, 삭제

      // 상세 버튼
      const detailButton = actionButtons[0];
      expect(detailButton.children).toBe('상세');
      expect(detailButton.color).toBe('primary');
      expect(detailButton.startContent).toBe('eye');
      expect(detailButton.navigator?.route?.name).toBe('그라운드 카테고리 디테일');

      // 수정 버튼
      const editButton = actionButtons[1];
      expect(editButton.children).toBe('수정');
      expect(editButton.color).toBe('warning');
      expect(editButton.startContent).toBe('edit');
      expect(editButton.navigator?.route?.relativePath).toBe(':categoryId/modify');

      // 추가 버튼
      const addButton = actionButtons[2];
      expect(addButton.children).toBe('추가');
      expect(addButton.color).toBe('success');
      expect(addButton.startContent).toBe('plus');
      expect(addButton.navigator?.route?.relativePath).toBe(':categoryId/add');

      // 삭제 버튼
      const deleteButton = actionButtons[3];
      expect(deleteButton.children).toBe('삭제');
      expect(deleteButton.color).toBe('danger');
      expect(deleteButton.startContent).toBe('trash');
      expect(deleteButton.mutation?.name).toBe('deleteCategory');
      expect(deleteButton.mutation?.pathParams?.categoryId).toBe('selectedRow.id');
      expect(deleteButton.mutation?.queryKey).toBe('useGetCategoriesByQuery');
    });

    it('should configure query with correct parameters', () => {
      const categoryType = $Enums.CategoryTypes.Space;
      const result = getCategoriesPage(categoryType);

      const dataGridElement = result.sections[0].stacks[0].elements[0];
      const queryConfig = dataGridElement.props.table.query;

      expect(queryConfig.name).toBe('useGetCategoriesByQuery');
      expect(queryConfig.params.type).toBe(categoryType);
      expect(queryConfig.params.tenantId).toBe(mockTenantId);
      expect(queryConfig.params.skip).toBe(0);
      expect(queryConfig.params.take).toBe(10);
    });

    it('should have proper styling for all action buttons', () => {
      const result = getCategoriesPage($Enums.CategoryTypes.User);
      const actionButtons =
        result.sections[0].stacks[0].elements[0].props.table.columns[2].cell.buttons;

      actionButtons.forEach((button) => {
        expect(button.variant).toBe('light');
        expect(button.size).toBe('sm');
        expect(button.radius).toBe('sm');
        expect(button.isIconOnly).toBe(false);
        expect(button.className).toBe('min-w-unit-14 text-xs px-2 py-1');
      });
    });
  });
});
