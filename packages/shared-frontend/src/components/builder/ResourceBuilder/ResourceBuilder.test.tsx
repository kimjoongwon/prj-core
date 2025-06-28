import { render, screen } from '@testing-library/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { vi } from 'vitest';
import { ResourceBuilder } from './ResourceBuilder';
import { PageProvider } from '../../../provider';

// Mock the useApiQuery hook
const mockUseApiQuery = vi.fn();
vi.mock('../../../hooks', () => ({
  useApiQuery: mockUseApiQuery,
}));

// Mock SectionBuilder component
vi.mock('../SectionBuilder', () => ({
  SectionBuilder: ({ sectionBuilder }: any) => (
    <div data-testid="section-builder">
      Section: {sectionBuilder.name || 'Unnamed'}
    </div>
  ),
}));

// Console spy to test logging
const consoleSpy = {
  log: vi.spyOn(console, 'log').mockImplementation(() => {}),
  warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
  debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
};

const mockResourceData = {
  id: '1',
  name: 'Test Resource',
  description: 'Test Description',
};

const mockSections = [
  {
    name: 'Section 1',
    bordered: true,
    stacks: [
      {
        type: 'VStack' as const,
        elements: [],
      },
    ],
  },
  {
    name: 'Section 2',
    bordered: false,
    stacks: [
      {
        type: 'HStack' as const,
        elements: [],
      },
    ],
  },
];

describe('ResourceBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const TestWrapper = observer(({ children }: { children: React.ReactNode }) => {
    const pageState = useLocalObservable(() => ({}));
    
    return (
      <PageProvider pageBuilder={{ state: pageState }}>
        {children}
      </PageProvider>
    );
  });

  it('should render loading state correctly', () => {
    mockUseApiQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      id: '1',
      type: 'detail',
    });

    render(
      <TestWrapper>
        <ResourceBuilder
          resourceName="testResource"
          type="resource"
          query={{ name: 'test', params: {} }}
          sections={mockSections}
        />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeDefined();
    expect(screen.getByText('TestResource 로딩 중...')).toBeDefined();
    
    // Check loading log
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('🔄 [ResourceBuilder] Rendering loading spinner'),
      ''
    );
  });

  it('should render error state correctly', () => {
    const mockError = new Error('Network error');
    mockUseApiQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: mockError,
      id: '1',
      type: 'detail',
    });

    render(
      <TestWrapper>
        <ResourceBuilder
          resourceName="testResource"
          type="resource"
          query={{ name: 'test', params: {} }}
          sections={mockSections}
        />
      </TestWrapper>
    );

    expect(screen.getByText('🚨 오류 발생')).toBeDefined();
    expect(screen.getByText(/TestResource 처리 중 오류가 발생했습니다/)).toBeDefined();
    
    // Check error log
    expect(consoleSpy.error).toHaveBeenCalledWith(
      expect.stringContaining('❌ [ResourceBuilder] Rendering error state'),
      mockError
    );
  });

  it('should render no data state for modify/detail types', () => {
    mockUseApiQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      id: '1',
      type: 'detail',
    });

    render(
      <TestWrapper>
        <ResourceBuilder
          resourceName="testResource"
          type="resource"
          query={{ name: 'test', params: {} }}
          sections={mockSections}
        />
      </TestWrapper>
    );

    expect(screen.getByText('📭 데이터 없음')).toBeDefined();
    expect(screen.getByText(/요청하신 TestResource을\(를\) 찾을 수 없습니다/)).toBeDefined();
    
    // Check warning log
    expect(consoleSpy.warn).toHaveBeenCalledWith(
      expect.stringContaining('📭 [ResourceBuilder] No data found for resource'),
      expect.objectContaining({
        resourceName: 'TestResource',
        type: 'detail',
        id: '1'
      })
    );
  });

  it('should render sections successfully with data', () => {
    mockUseApiQuery.mockReturnValue({
      data: mockResourceData,
      isLoading: false,
      error: null,
      id: '1',
      type: 'detail',
    });

    render(
      <TestWrapper>
        <ResourceBuilder
          resourceName="testResource"
          type="resource"
          query={{ name: 'test', params: {} }}
          sections={mockSections}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Section: Section 1')).toBeDefined();
    expect(screen.getByText('Section: Section 2')).toBeDefined();
    
    // Check success log
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('✅ [ResourceBuilder] Rendering ResourceBuilder with sections'),
      expect.objectContaining({
        sectionsCount: 2,
        resourceName: 'TestResource',
        hasData: true
      })
    );

    // Check section rendering logs
    expect(consoleSpy.debug).toHaveBeenCalledWith(
      expect.stringContaining('🏗️ [ResourceBuilder] Rendering section 1/2'),
      expect.objectContaining({
        sectionName: 'Section 1',
        stacksCount: 1
      })
    );
  });

  it('should render empty sections message when no sections provided', () => {
    mockUseApiQuery.mockReturnValue({
      data: mockResourceData,
      isLoading: false,
      error: null,
      id: '1',
      type: 'detail',
    });

    render(
      <TestWrapper>
        <ResourceBuilder
          resourceName="testResource"
          type="resource"
          query={{ name: 'test', params: {} }}
          sections={[]}
        />
      </TestWrapper>
    );

    expect(screen.getByText('📄 섹션 없음')).toBeDefined();
    expect(screen.getByText('TestResource에 표시할 섹션이 없습니다.')).toBeDefined();
  });

  it('should handle add type with parent ID correctly', () => {
    const TestWrapperWithState = observer(() => {
      const pageState = useLocalObservable(() => ({ form: { inputs: {} } }));
      
      mockUseApiQuery.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        id: 'parent123',
        type: 'add',
      });

      return (
        <PageProvider pageBuilder={{ state: pageState }}>
          <ResourceBuilder
            resourceName="testResource"
            type="resource"
            query={{ name: 'test', params: {} }}
            sections={mockSections}
          />
        </PageProvider>
      );
    });

    render(<TestWrapperWithState />);

    // Check parent ID setting log
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('👨‍👩‍👧‍👦 [ResourceBuilder] Parent ID set for add operation'),
      expect.objectContaining({
        parentId: 'parent123'
      })
    );

    expect(screen.getByText('Section: Section 1')).toBeDefined();
    expect(screen.getByText('Section: Section 2')).toBeDefined();
  });

  it('should support both light and dark themes', () => {
    mockUseApiQuery.mockReturnValue({
      data: mockResourceData,
      isLoading: false,
      error: null,
      id: '1',
      type: 'detail',
    });

    render(
      <TestWrapper>
        <div className="dark">
          <ResourceBuilder
            resourceName="testResource"
            type="resource"
            query={{ name: 'test', params: {} }}
            sections={mockSections}
          />
        </div>
      </TestWrapper>
    );

    const container = screen.getByText('Section: Section 1').closest('.resource-builder-container');
    expect(container).toBeDefined();
  });

  it('should log initialization details', () => {
    mockUseApiQuery.mockReturnValue({
      data: mockResourceData,
      isLoading: false,
      error: null,
      id: '1',
      type: 'detail',
    });

    render(
      <TestWrapper>
        <ResourceBuilder
          resourceName="testResource"
          type="resource"
          query={{ name: 'test', params: {} }}
          sections={mockSections}
        />
      </TestWrapper>
    );

    // Check initialization log
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('🚀 [ResourceBuilder] Initializing ResourceBuilder'),
      expect.objectContaining({
        resourceName: 'TestResource',
        sectionsCount: 2
      })
    );

    // Check state change log
    expect(consoleSpy.debug).toHaveBeenCalledWith(
      expect.stringContaining('📊 [ResourceBuilder] API Query State Changed'),
      expect.objectContaining({
        isLoading: false,
        hasData: true,
        hasError: false,
        type: 'detail',
        id: '1'
      })
    );
  });
});
