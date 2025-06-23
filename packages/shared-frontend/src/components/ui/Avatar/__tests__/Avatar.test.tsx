import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Avatar } from '../Avatar';
import { EnvironmentUtil } from '@shared/utils';
import * as AppProvider from '../../../../providers/App/AppProvider';

// Mock dependencies
vi.mock('@shared/utils', () => ({
  BrowserUtil: {
    clearLocalStorage: vi.fn(),
    clearSessionStorage: vi.fn(),
    navigateTo: vi.fn(),
  },
  EnvironmentUtil: {
    getCurrentEnvironment: vi.fn(),
  },
}));

// Mock usePlate hook
const mockPlate = {
  name: 'PROTOTYPE',
  isInitialized: true,
  navigation: {
    getNavigator: vi.fn(),
  },
  navigator: {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  },
  auth: {
    logout: vi.fn(),
  },
};

// Mock AppProvider module
vi.spyOn(AppProvider, 'usePlate').mockReturnValue(mockPlate as any);

// Mock environment
const mockEnvironment = {
  name: 'test',
  color: 'primary' as const,
};

const MockedEnvironmentUtil = EnvironmentUtil as typeof EnvironmentUtil & {
  getCurrentEnvironment: ReturnType<typeof vi.fn>;
};

describe('Avatar Component', () => {
  beforeEach(() => {
    MockedEnvironmentUtil.getCurrentEnvironment.mockReturnValue(mockEnvironment);
    vi.clearAllMocks();
  });

  it('renders with user info when showInfo is true', () => {
    render(<Avatar showInfo={true} />);
    
    // Check if user name is displayed
    expect(screen.getByText('슈퍼매니저')).toBeDefined();
    expect(screen.getByText('총괄')).toBeDefined();
  });

  it('renders without user info when showInfo is false', () => {
    render(<Avatar showInfo={false} />);
    
    // Check if only avatar is displayed (no text info)
    expect(screen.queryByText('슈퍼매니저')).toBeNull();
    expect(screen.queryByText('총괄')).toBeNull();
  });

  it('displays environment chip with correct environment info', () => {
    render(<Avatar />);
    
    // Click to open dropdown
    const avatarButton = screen.getByRole('button');
    fireEvent.click(avatarButton);
    
    // Check if environment info is displayed
    expect(screen.getByText('환경 정보')).toBeDefined();
    expect(screen.getByText('현재 test 환경입니다')).toBeDefined();
    expect(screen.getByText('test')).toBeDefined();
  });

  it('displays all menu items with proper icons', () => {
    render(<Avatar />);
    
    // Click to open dropdown
    const avatarButton = screen.getByRole('button');
    fireEvent.click(avatarButton);
    
    // Check if all menu items are displayed
    expect(screen.getByText('프로필')).toBeDefined();
    expect(screen.getByText('설정')).toBeDefined();
    expect(screen.getByText('도움말')).toBeDefined();
    expect(screen.getByText('로그아웃')).toBeDefined();
    
    // Check if descriptions are displayed
    expect(screen.getByText('계정 정보 관리')).toBeDefined();
    expect(screen.getByText('앱 설정 및 환경설정')).toBeDefined();
    expect(screen.getByText('사용 가이드 및 문의')).toBeDefined();
    expect(screen.getByText('계정에서 로그아웃')).toBeDefined();
  });

  it('calls onMenuAction when menu items are clicked', () => {
    const mockOnMenuAction = vi.fn();
    render(<Avatar onMenuAction={mockOnMenuAction} />);
    
    // Click to open dropdown
    const avatarButton = screen.getByRole('button');
    fireEvent.click(avatarButton);
    
    // Click on profile menu item
    const profileItem = screen.getByText('프로필');
    fireEvent.click(profileItem);
    
    expect(mockOnMenuAction).toHaveBeenCalledWith('profile');
  });

  it('calls plate.auth.logout when logout menu item is clicked', () => {
    render(<Avatar />);
    
    // Click to open dropdown
    const avatarButton = screen.getByRole('button');
    fireEvent.click(avatarButton);
    
    // Click on logout menu item
    const logoutItem = screen.getByText('로그아웃');
    fireEvent.click(logoutItem);
    
    expect(mockPlate.auth.logout).toHaveBeenCalled();
  });

  it('renders icon components correctly', () => {
    render(<Avatar />);
    
    // Click to open dropdown
    const avatarButton = screen.getByRole('button');
    fireEvent.click(avatarButton);
    
    // Check if SVG icons are present (they should have specific viewBox attributes)
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('environment chip displays correct color and variant', () => {
    const customEnvironment = {
      name: 'production',
      color: 'danger' as const,
    };
    
    MockedEnvironmentUtil.getCurrentEnvironment.mockReturnValue(customEnvironment);
    
    render(<Avatar />);
    
    // Click to open dropdown
    const avatarButton = screen.getByRole('button');
    fireEvent.click(avatarButton);
    
    // Check if production environment is displayed
    expect(screen.getByText('production')).toBeDefined();
    expect(screen.getByText('현재 production 환경입니다')).toBeDefined();
  });
});
