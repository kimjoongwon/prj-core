import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ActionCell } from './ActionCell';
import { usePage } from '../../builder';
import { addToast } from '@heroui/react';
import type { Row } from '@tanstack/react-table';

// Mock dependencies
vi.mock('../../builders', () => ({
  usePage: vi.fn(),
}));

vi.mock('@heroui/react', () => ({
  addToast: vi.fn(),
}));

vi.mock('../../builders/ButtonBuilder', () => ({
  ButtonBuilder: ({ onPress, children, name, ...props }: any) => (
    <button onClick={() => onPress && onPress()} {...props}>
      {children || name}
    </button>
  ),
}));

const mockUsePage = vi.mocked(usePage);
const mockAddToast = vi.mocked(addToast);

describe('ActionCell', () => {
  const mockRow = { id: '123', name: 'Test Item' };
  const mockCellContext = {
    row: { original: mockRow } as Row<typeof mockRow>,
    getValue: vi.fn(),
    renderValue: vi.fn(),
    column: {} as any,
    cell: {} as any,
    table: {} as any,
  };

  const mockPageState = {
    params: {},
    selectedRow: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePage.mockReturnValue({
      state: mockPageState,
    });
    console.warn = vi.fn();
    console.error = vi.fn();
    console.group = vi.fn();
    console.groupEnd = vi.fn();
    console.log = vi.fn();
  });

  describe('Error Handling', () => {
    it('should handle missing buttons gracefully', () => {
      render(<ActionCell {...mockCellContext} buttons={undefined} />);
      expect(screen.queryByRole('button')).toBeNull();
    });

    it('should handle empty buttons array gracefully', () => {
      render(<ActionCell {...mockCellContext} buttons={[]} />);
      expect(screen.queryByRole('button')).toBeNull();
    });

    it('should show error toast when usePage fails', () => {
      mockUsePage.mockImplementation(() => {
        throw new Error('PageProvider not found');
      });

      // ActionCell should handle this error gracefully
      expect(() => {
        render(
          <ActionCell
            {...mockCellContext}
            buttons={[{ key: 'test', name: 'Test' }]}
          />,
        );
      }).not.toThrow();

      expect(mockAddToast).toHaveBeenCalledWith({
        title: '시스템 오류',
        description: 'PageProvider가 초기화되지 않았습니다.',
        color: 'danger',
      });
    });

    it('should handle button without navigator gracefully', () => {
      const buttonWithoutNavigator = {
        key: 'test',
        name: 'Test Button',
        onPress: vi.fn(),
      };

      render(
        <ActionCell {...mockCellContext} buttons={[buttonWithoutNavigator]} />,
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(buttonWithoutNavigator.onPress).toHaveBeenCalled();
    });

    it('should handle row without id gracefully', () => {
      const rowWithoutId = { name: 'Test Item' }; // id가 없는 row
      const contextWithoutId = {
        ...mockCellContext,
        row: { original: rowWithoutId } as unknown as Row<{ id?: string }>,
      };

      const buttonWithNavigator = {
        key: 'test',
        name: 'Test Button',
        navigator: {
          route: {
            paramsPath: 'test.params',
          },
        },
        onPress: vi.fn(),
      };

      render(
        <ActionCell {...contextWithoutId} buttons={[buttonWithNavigator]} />,
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockAddToast).toHaveBeenCalledWith({
        title: '데이터 오류',
        description: '선택된 항목의 ID가 없습니다.',
        color: 'warning',
      });
    });

    it('should handle missing paramsPath in navigator gracefully', () => {
      const buttonWithInvalidNavigator = {
        key: 'test',
        name: 'Test Button',
        navigator: {
          route: {}, // paramsPath가 없음
        },
        onPress: vi.fn(),
      };

      render(
        <ActionCell
          {...mockCellContext}
          buttons={[buttonWithInvalidNavigator]}
        />,
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockAddToast).toHaveBeenCalledWith({
        title: '네비게이션 오류',
        description: '경로 설정이 올바르지 않습니다.',
        color: 'warning',
      });
    });

    it('should handle onPress error gracefully', () => {
      const buttonWithErrorOnPress = {
        key: 'test',
        name: 'Test Button',
        onPress: vi.fn().mockImplementation(() => {
          throw new Error('Button press error');
        }),
      };

      render(
        <ActionCell {...mockCellContext} buttons={[buttonWithErrorOnPress]} />,
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockAddToast).toHaveBeenCalledWith({
        title: '버튼 실행 오류',
        description: '버튼 동작 중 오류가 발생했습니다.',
        color: 'danger',
      });
    });

    it('should handle lodash set function error gracefully', () => {
      const invalidPageState = null; // set 함수가 실패할 수 있는 상황
      mockUsePage.mockReturnValue({
        state: invalidPageState as any,
      });

      const buttonWithNavigator = {
        key: 'test',
        name: 'Test Button',
        navigator: {
          route: {
            paramsPath: 'test.params',
          },
        },
      };

      render(
        <ActionCell {...mockCellContext} buttons={[buttonWithNavigator]} />,
      );

      // 컴포넌트가 렌더링되었는지 확인
      const button = screen.getByRole('button');
      expect(button).toBeDefined();

      fireEvent.click(button);

      expect(mockAddToast).toHaveBeenCalledWith({
        title: '상태 업데이트 오류',
        description: '페이지 상태를 업데이트할 수 없습니다.',
        color: 'danger',
      });
    });
  });

  describe('Success Cases', () => {
    it('should render buttons successfully when all data is valid', () => {
      const validButtons = [
        {
          key: 'edit',
          name: 'Edit',
          navigator: {
            route: {
              paramsPath: 'edit.params',
            },
          },
        },
        {
          key: 'delete',
          name: 'Delete',
          onPress: vi.fn(),
        },
      ];

      render(<ActionCell {...mockCellContext} buttons={validButtons} />);

      expect(screen.getByText('Edit')).toBeDefined();
      expect(screen.getByText('Delete')).toBeDefined();
    });

    it('should update pageState correctly when button is pressed', () => {
      const buttonWithNavigator = {
        key: 'test',
        name: 'Test Button',
        navigator: {
          route: {
            paramsPath: 'test.params',
          },
        },
      };

      render(
        <ActionCell {...mockCellContext} buttons={[buttonWithNavigator]} />,
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockPageState.selectedRow).toEqual(mockRow);
    });
  });
});
