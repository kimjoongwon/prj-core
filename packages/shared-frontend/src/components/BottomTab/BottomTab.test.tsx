import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BottomTab } from './index';
import { Route } from '@shared/types';

// Mock Plate navigation
const mockPush = vi.fn();
vi.mock('../../providers/App/AppProvider', () => ({
  Plate: {
    navigation: {
      getNavigator: () => ({
        push: mockPush,
      }),
    },
  },
}));

// Mock icon utils
vi.mock('../../utils/iconUtils', () => ({
  renderLucideIcon: vi.fn(() => <div data-testid="mock-icon">Icon</div>),
}));

describe('BottomTab', () => {
  const mockRoutes: Route[] = [
    {
      name: '홈',
      pathname: '/home',
      icon: 'Home',
      active: true,
      params: {},
    },
    {
      name: '검색',
      pathname: '/search',
      icon: 'Search',
      active: false,
      params: {},
    },
    {
      name: '설정',
      pathname: '/settings',
      icon: 'Settings',
      active: false,
      params: {},
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all routes correctly', () => {
    render(<BottomTab routes={mockRoutes} />);

    expect(screen.getByText('홈')).toBeInTheDocument();
    expect(screen.getByText('검색')).toBeInTheDocument();
    expect(screen.getByText('설정')).toBeInTheDocument();
  });

  it('renders icons when provided', () => {
    render(<BottomTab routes={mockRoutes} />);

    const icons = screen.getAllByTestId('mock-icon');
    expect(icons).toHaveLength(3);
  });

  it('handles tab press correctly', () => {
    render(<BottomTab routes={mockRoutes} />);

    const homeTab = screen.getByText('홈');
    fireEvent.click(homeTab);

    expect(mockPush).toHaveBeenCalledWith('/home');
  });

  it('calls custom onTabPress handler', () => {
    const mockOnTabPress = vi.fn();
    render(<BottomTab routes={mockRoutes} onTabPress={mockOnTabPress} />);

    const homeTab = screen.getByText('홈');
    fireEvent.click(homeTab);

    expect(mockOnTabPress).toHaveBeenCalledWith(mockRoutes[0]);
    expect(mockPush).toHaveBeenCalledWith('/home');
  });

  it('calls route onClick handler when provided', () => {
    const mockOnClick = vi.fn();
    const routesWithOnClick: Route[] = [
      {
        ...mockRoutes[0],
        onClick: mockOnClick,
      },
      ...mockRoutes.slice(1),
    ];

    render(<BottomTab routes={routesWithOnClick} />);

    const homeTab = screen.getByText('홈');
    fireEvent.click(homeTab);

    expect(mockOnClick).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled(); // Should not navigate when onClick is provided
  });

  it('hides labels when showLabels is false', () => {
    render(<BottomTab routes={mockRoutes} showLabels={false} />);

    expect(screen.queryByText('홈')).not.toBeInTheDocument();
    expect(screen.queryByText('검색')).not.toBeInTheDocument();
    expect(screen.queryByText('설정')).not.toBeInTheDocument();
  });

  it('applies active styling to active routes', () => {
    render(<BottomTab routes={mockRoutes} />);

    // The home tab should have active styling (it's active: true)
    const homeTab = screen.getByText('홈').closest('button');
    expect(homeTab).toHaveClass('font-semibold');
  });

  it('returns null when no routes provided', () => {
    const { container } = render(<BottomTab routes={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(
      <BottomTab routes={mockRoutes} className="custom-class" />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('opens modal for child routes and navigates on child press', () => {
    const childRoute: Route = {
      name: 'Child',
      pathname: '/child',
      icon: 'Home',
      active: false,
      params: {},
    };

    const routesWithChildren: Route[] = [
      {
        ...mockRoutes[0],
        children: [childRoute],
      },
      ...mockRoutes.slice(1),
    ];

    render(<BottomTab routes={routesWithChildren} />);

    fireEvent.click(screen.getByText('홈'));
    expect(screen.getByText('Child')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Child'));
    expect(mockPush).toHaveBeenCalledWith('/child');
  });
});
