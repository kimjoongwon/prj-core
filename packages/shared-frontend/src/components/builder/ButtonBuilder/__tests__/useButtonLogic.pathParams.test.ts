import { renderHook } from '@testing-library/react';
import { useButtonLogic } from '../useButtonLogic';
import { Navigator } from '@shared/types';
import { usePage } from '@shared/frontend';

// Mock dependencies
jest.mock('@shared/frontend', () => ({
  usePage: jest.fn(),
  Plate: {
    navigation: {
      getNavigator: jest.fn(() => ({
        push: jest.fn(),
        replace: jest.fn(),
        goBack: jest.fn(),
      })),
    },
  },
}));

jest.mock('@tanstack/react-router', () => ({
  useNavigate: jest.fn(() => jest.fn()),
  useParams: jest.fn(() => ({ id: 'test-id' })),
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
  })),
}));

jest.mock('@heroui/react', () => ({
  addToast: jest.fn(),
}));

const mockUsePage = usePage as jest.MockedFunction<typeof usePage>;

describe('useButtonLogic - pathParams 기능', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('pathParams를 사용하여 라우트 패턴의 파라미터를 pageState 값으로 치환해야 한다', () => {
    // Mock pageState with nested structure
    const mockPageState = {
      selectedRow: {
        id: '123',
        groundId: '456',
        name: 'Test Tenant'
      },
      form: {
        inputs: {
          category: 'test-category'
        }
      }
    };

    mockUsePage.mockReturnValue({
      state: mockPageState,
    } as any);

    const navigator: Navigator = {
      type: 'push',
      route: {
        relativePath: ':groundId/detail/tenants/:tenantId',
        pathParams: {
          'groundId': 'selectedRow.groundId',
          'tenantId': 'selectedRow.id'
        }
      }
    };

    const { result } = renderHook(() =>
      useButtonLogic({
        navigator,
      })
    );

    // 네비게이션 실행
    result.current.handleApiCall();

    // navigate 함수가 올바른 경로로 호출되었는지 확인
    const navigate = require('@tanstack/react-router').useNavigate();
    expect(navigate).toHaveBeenCalledWith('456/detail/tenants/123');
  });

  it('pathParams에서 값을 찾을 수 없을 때 경고를 출력해야 한다', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const mockPageState = {
      selectedRow: {
        id: '123',
        // groundId가 없음
      }
    };

    mockUsePage.mockReturnValue({
      state: mockPageState,
    } as any);

    const navigator: Navigator = {
      type: 'push',
      route: {
        relativePath: ':groundId/detail/tenants/:tenantId',
        pathParams: {
          'groundId': 'selectedRow.groundId', // 존재하지 않는 경로
          'tenantId': 'selectedRow.id'
        }
      }
    };

    const { result } = renderHook(() =>
      useButtonLogic({
        navigator,
      })
    );

    result.current.handleApiCall();

    // 경고가 출력되었는지 확인
    expect(consoleSpy).toHaveBeenCalledWith(
      '⚠️ No value found at path: selectedRow.groundId for param: groundId'
    );

    consoleSpy.mockRestore();
  });

  it('pathParams에 매핑이 없는 파라미터에 대해 경고를 출력해야 한다', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const mockPageState = {
      selectedRow: {
        id: '123',
        groundId: '456'
      }
    };

    mockUsePage.mockReturnValue({
      state: mockPageState,
    } as any);

    const navigator: Navigator = {
      type: 'push',
      route: {
        relativePath: ':groundId/detail/tenants/:tenantId',
        pathParams: {
          'groundId': 'selectedRow.groundId',
          // tenantId 매핑이 없음
        }
      }
    };

    const { result } = renderHook(() =>
      useButtonLogic({
        navigator,
      })
    );

    result.current.handleApiCall();

    // 경고가 출력되었는지 확인
    expect(consoleSpy).toHaveBeenCalledWith(
      '⚠️ No pathParams mapping found for param: tenantId'
    );

    consoleSpy.mockRestore();
  });

  it('깊게 중첩된 pageState 경로에서도 값을 추출할 수 있어야 한다', () => {
    const mockPageState = {
      form: {
        data: {
          user: {
            profile: {
              id: 'deep-nested-id',
              organizationId: 'org-123'
            }
          }
        }
      }
    };

    mockUsePage.mockReturnValue({
      state: mockPageState,
    } as any);

    const navigator: Navigator = {
      type: 'push',
      route: {
        relativePath: 'organizations/:orgId/users/:userId',
        pathParams: {
          'orgId': 'form.data.user.profile.organizationId',
          'userId': 'form.data.user.profile.id'
        }
      }
    };

    const { result } = renderHook(() =>
      useButtonLogic({
        navigator,
      })
    );

    result.current.handleApiCall();

    const navigate = require('@tanstack/react-router').useNavigate();
    expect(navigate).toHaveBeenCalledWith('organizations/org-123/users/deep-nested-id');
  });

  it('pathParams와 기존 params가 함께 있을 때 pathParams를 우선 처리해야 한다', () => {
    const mockPageState = {
      selectedRow: {
        id: '123'
      }
    };

    mockUsePage.mockReturnValue({
      state: mockPageState,
    } as any);

    const navigator: Navigator = {
      type: 'push',
      route: {
        relativePath: 'items/:itemId',
        pathParams: {
          'itemId': 'selectedRow.id'
        },
        params: {
          otherParam: 'value'
        }
      }
    };

    const { result } = renderHook(() =>
      useButtonLogic({
        navigator,
      })
    );

    result.current.handleApiCall();

    const navigate = require('@tanstack/react-router').useNavigate();
    expect(navigate).toHaveBeenCalledWith('items/123');
  });
});
