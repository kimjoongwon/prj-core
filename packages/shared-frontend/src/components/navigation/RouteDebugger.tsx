import React, { useState } from 'react';
import { RouteBuilder, Route } from '@shared/specs';
import { useGlobalNavigation } from '../../hooks/useUnifiedNavigation';

interface RouteDebuggerProps {
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

/**
 * 개발 환경에서 라우트 정보를 시각화하고 디버깅할 수 있는 컴포넌트
 */
export function RouteDebugger({
  isOpen: controlledIsOpen,
  onToggle,
  position = 'bottom-right',
}: RouteDebuggerProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const {
    navigationService,
    breadcrumbs,
    activeRoutes,
    currentPath,
    getPathByName,
  } = useGlobalNavigation();

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    if (isControlled) {
      onToggle?.(newIsOpen);
    } else {
      setInternalIsOpen(newIsOpen);
    }
  };

  // 개발 환경에서만 표시
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const flatRoutes = navigationService.debugFlatRoutes();
  const allRoutes = navigationService.getAllRoutes();

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* 토글 버튼 */}
      <button
        onClick={handleToggle}
        className="mb-2 px-3 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        🗺️ Route Debugger {isOpen ? '▼' : '▲'}
      </button>

      {/* 디버거 패널 */}
      {isOpen && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-md max-h-96 overflow-auto text-xs">
          {/* 현재 상태 */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-800 mb-2">🎯 Current State</h3>
            <div className="space-y-1 text-gray-600">
              <div>
                <strong>Path:</strong> {currentPath}
              </div>
              <div>
                <strong>Active Routes:</strong> {activeRoutes.length}
              </div>
              <div>
                <strong>Breadcrumbs:</strong> {breadcrumbs.length}
              </div>
            </div>
          </div>

          {/* 브레드크럼 */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-800 mb-2">🍞 Breadcrumbs</h3>
            <div className="space-y-1">
              {breadcrumbs.map((breadcrumb, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-gray-600"
                >
                  <span className="text-gray-400">{index + 1}.</span>
                  <span
                    className={
                      breadcrumb.active ? 'font-bold text-blue-600' : ''
                    }
                  >
                    {breadcrumb.name}
                  </span>
                  <span className="text-gray-400 text-xs">
                    ({breadcrumb.pathname})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 활성 라우트 */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-800 mb-2">✅ Active Routes</h3>
            <div className="space-y-1">
              {activeRoutes.map((route, index) => (
                <div key={index} className="text-gray-600">
                  <span className="font-medium text-green-600">
                    {route.name}
                  </span>
                  <span className="text-gray-400 ml-2">({route.pathname})</span>
                </div>
              ))}
            </div>
          </div>

          {/* 플랫 라우트 맵 */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-800 mb-2">
              🗺️ Flat Routes Map ({flatRoutes.size})
            </h3>
            <div className="space-y-1 max-h-32 overflow-auto">
              {Array.from(flatRoutes.entries()).map(([name, route]) => (
                <div
                  key={name}
                  className="flex items-start space-x-2 text-gray-600"
                >
                  <span className="font-medium text-blue-600 min-w-0 flex-shrink-0">
                    {name}:
                  </span>
                  <span className="text-gray-400 truncate text-xs">
                    {route.pathname}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 라우트 테스터 */}
          <RouteNameTester />
        </div>
      )}
    </div>
  );
}

/**
 * 라우트 이름을 입력해서 경로를 테스트할 수 있는 컴포넌트
 */
function RouteNameTester() {
  const [testRouteName, setTestRouteName] = useState('');
  const { getPathByName, navigateByName } = useGlobalNavigation();

  const testPath = testRouteName ? getPathByName(testRouteName) : null;

  const handleNavigate = () => {
    if (testPath) {
      navigateByName(testRouteName);
    }
  };

  return (
    <div className="border-t pt-4">
      <h3 className="font-bold text-gray-800 mb-2">🧪 Route Name Tester</h3>
      <div className="space-y-2">
        <input
          type="text"
          value={testRouteName}
          onChange={e => setTestRouteName(e.target.value)}
          placeholder="라우트 이름 입력..."
          className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
        />

        {testRouteName && (
          <div className="text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Result:</span>
              {testPath ? (
                <span className="text-green-600">{testPath}</span>
              ) : (
                <span className="text-red-600">Not found</span>
              )}
            </div>

            {testPath && (
              <button
                onClick={handleNavigate}
                className="mt-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
              >
                Navigate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 라우트 트리를 시각화하는 컴포넌트
 */
interface RouteTreeProps {
  routes: RouteBuilder[] | Route[];
  level?: number;
}

export function RouteTree({ routes, level = 0 }: RouteTreeProps) {
  const indent = '  '.repeat(level);

  return (
    <div className="font-mono text-xs">
      {routes.map((route, index) => (
        <div key={index}>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">{indent}├─</span>
            <span className="font-medium">{route.name}</span>
            <span className="text-gray-500">({route.pathname})</span>
            {'active' in route && route.active && (
              <span className="text-green-600 font-bold">●</span>
            )}
          </div>
          {route.children && route.children.length > 0 && (
            <RouteTree routes={route.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
}
