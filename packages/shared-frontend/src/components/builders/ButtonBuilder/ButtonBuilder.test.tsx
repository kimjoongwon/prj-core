import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ButtonBuilder } from './ButtonBuilder';
import { IButtonBuilder } from '@shared/types';
import { usePageState } from '../../../providers';
import { useButtonLogic } from './useButtonLogic';

// Mock dependencies
vi.mock('../../../providers', () => ({
  usePageState: vi.fn(),
}));

vi.mock('./useButtonLogic', () => ({
  useButtonLogic: vi.fn(),
}));

vi.mock('@shared/frontend', () => ({
  Text: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => (
    <span className={variant === 'error' ? 'text-red-500' : ''}>
      {children}
    </span>
  ),
  Button: ({ children, onPress, isDisabled, ...rest }: any) => (
    <button onClick={onPress} disabled={isDisabled} {...rest}>
      {children}
    </button>
  ),
}));

vi.mock('@heroui/react', () => ({
  addToast: vi.fn(),
}));

const mockUsePageState = vi.mocked(usePageState);
const mockUseButtonLogic = vi.mocked(useButtonLogic);

describe('ButtonBuilder', () => {
  const mockHandleApiCall = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePageState.mockReturnValue({});
    mockUseButtonLogic.mockReturnValue({
      handleApiCall: mockHandleApiCall,
      isLoading: false,
      error: null,
      response: null,
      clearError: vi.fn(),
      clearResponse: vi.fn(),
    });
  });

  describe('Navigation only buttons', () => {
    it('should handle navigation without calling API when no mutation is provided', async () => {
      const props: IButtonBuilder = {
        children: '상세',
        variant: 'light',
        size: 'sm',
        color: 'primary',
        navigator: {
          type: 'push',
          route: {
            fullPath: '/admin/dashboard/categories/detail',
          },
        },
      };

      render(<ButtonBuilder {...props} />);

      const button = screen.getByRole('button', { name: '상세' });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockHandleApiCall).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call API twice for navigation-only buttons', async () => {
      const props: IButtonBuilder = {
        children: '상세보기',
        navigator: {
          type: 'push',
          route: {
            fullPath: '/admin/dashboard/categories/123',
          },
        },
      };

      render(<ButtonBuilder {...props} />);

      const button = screen.getByRole('button', { name: '상세보기' });
      fireEvent.click(button);

      await waitFor(() => {
        // mutation이 없는 경우 handleApiCall은 한 번만 호출되어야 함
        expect(mockHandleApiCall).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Mutation with navigation buttons', () => {
    it('should handle mutation and then navigation', async () => {
      const props: IButtonBuilder = {
        children: '저장',
        mutation: {
          name: 'createCategory',
          params: { name: 'test' },
        },
        navigator: {
          type: 'push',
          route: {
            fullPath: '/admin/dashboard/categories',
          },
        },
      };

      render(<ButtonBuilder {...props} />);

      const button = screen.getByRole('button', { name: '저장' });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockHandleApiCall).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Button validation', () => {
    it('should disable button when validation fails', () => {
      const props: IButtonBuilder = {
        children: '제출',
        validation: {
          required: {
            value: true,
            message: '필수 입력입니다.',
          },
        },
        mutation: {
          name: 'submitData',
          path: 'form.data',
        },
      };

      mockUsePageState.mockReturnValue({
        form: {
          data: '', // 빈 값으로 validation 실패
        },
      });

      render(<ButtonBuilder {...props} />);

      const button = screen.getByRole('button', { name: '제출' });
      expect(button.hasAttribute('disabled')).toBe(true);
      expect(screen.getByText('필수 입력입니다.')).toBeDefined();
    });
  });
});
