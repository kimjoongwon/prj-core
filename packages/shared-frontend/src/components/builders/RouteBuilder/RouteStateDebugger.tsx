'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { autorun, isObservable } from 'mobx';
import { RouteBuilder as RouteBuilderInterface } from '@shared/types';
import { useLocation } from 'react-router';
import { Plate } from '../../../providers/App/AppProvider';

interface RouteStateLog {
  timestamp: string;
  routeName?: string;
  pathname: string;
  routeState: any;
  pageState?: any;
  layoutState?: any;
  diff?: string;
}

interface RouteStateDebuggerProps {
  routeBuilder: RouteBuilderInterface;
}

export const RouteStateDebugger = observer((props: RouteStateDebuggerProps) => {
  const { routeBuilder } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<RouteStateLog[]>([]);
  const [selectedLogIndex, setSelectedLogIndex] = useState<number | null>(null);
  const location = useLocation();

  // Get current route info from navigation service
  const currentRouteInfo = useMemo(() => {
    if (!Plate?.navigation) return null;
    
    const activeRoutes = Plate.navigation.getActiveRoutes();
    const breadcrumbs = Plate.navigation.getBreadcrumbPath(location.pathname);
    
    return {
      activeRoutes,
      breadcrumbs,
      currentPath: location.pathname
    };
  }, [location.pathname]);

  // Create state snapshot
  const createStateSnapshot = (reason: string = 'auto') => {
    const timestamp = new Date().toLocaleTimeString();
    
    const newLog: RouteStateLog = {
      timestamp,
      routeName: routeBuilder.name,
      pathname: location.pathname,
      routeState: {
        name: routeBuilder.name,
        pathname: routeBuilder.pathname,
        params: routeBuilder.params,
        hasLayout: !!routeBuilder.layout,
        hasPage: !!routeBuilder.page,
        layoutType: routeBuilder.layout?.type,
        activeRoutes: currentRouteInfo?.activeRoutes?.map(r => ({ name: r.name, pathname: r.pathname })),
        breadcrumbs: currentRouteInfo?.breadcrumbs?.map(r => ({ name: r.name, pathname: r.pathname }))
      },
      pageState: routeBuilder.page?.state ? (isObservable(routeBuilder.page.state) ? JSON.parse(JSON.stringify(routeBuilder.page.state)) : routeBuilder.page.state) : null,
      layoutState: routeBuilder.layout ? { type: routeBuilder.layout.type, name: routeBuilder.layout.name } : null,
    };

    // Calculate diff with previous log
    if (logs.length > 0) {
      const prevLog = logs[logs.length - 1];
      const changes: string[] = [];
      
      if (prevLog.routeName !== newLog.routeName) changes.push(`Route: ${prevLog.routeName} → ${newLog.routeName}`);
      if (prevLog.pathname !== newLog.pathname) changes.push(`Path: ${prevLog.pathname} → ${newLog.pathname}`);
      if (JSON.stringify(prevLog.pageState) !== JSON.stringify(newLog.pageState)) changes.push('Page state changed');
      if (JSON.stringify(prevLog.layoutState) !== JSON.stringify(newLog.layoutState)) changes.push('Layout state changed');
      
      newLog.diff = changes.length > 0 ? changes.join(', ') : 'No changes';
    }

    setLogs(prev => [...prev.slice(-19), newLog]); // Keep last 20 logs
  };

  // Auto-track state changes
  useEffect(() => {
    let dispose: (() => void) | undefined;

    try {
      dispose = autorun(() => {
        // Track route builder changes
        if (routeBuilder) {
          createStateSnapshot('autorun');
        }
      });
    } catch (error) {
      console.warn('RouteStateDebugger autorun error:', error);
    }

    return () => {
      if (dispose) {
        dispose();
      }
    };
  }, [routeBuilder, location.pathname]);

  // Manual refresh
  const handleRefresh = () => {
    createStateSnapshot('manual');
  };

  // Clear logs
  const handleClear = () => {
    setLogs([]);
    setSelectedLogIndex(null);
  };

  // Export logs
  const handleExport = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `route-state-logs-${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-lg transition-colors duration-200 text-sm font-medium"
        style={{ minWidth: '120px' }}
      >
        🔍 Route Debug
      </button>
    );
  }

  const selectedLog = selectedLogIndex !== null ? logs[selectedLogIndex] : null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl max-w-4xl max-h-[70vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="text-sm font-semibold text-gray-800">
          🔍 Route State Debugger
          {routeBuilder.name && <span className="ml-2 text-blue-600">({routeBuilder.name})</span>}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={handleClear}
            className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleExport}
            className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
          >
            Export
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Logs List */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
          <div className="p-2 bg-gray-50 border-b border-gray-200">
            <h4 className="text-xs font-medium text-gray-600">State Changes ({logs.length})</h4>
          </div>
          <div className="flex-1 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No state changes recorded yet
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedLogIndex(index)}
                    className={`p-2 rounded cursor-pointer transition-colors text-xs ${
                      selectedLogIndex === index
                        ? 'bg-blue-100 border border-blue-300'
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-gray-600">{log.timestamp}</span>
                      <span className="text-xs text-blue-600">{log.routeName}</span>
                    </div>
                    {log.diff && (
                      <div className="mt-1 text-xs text-gray-700 truncate">{log.diff}</div>
                    )}
                    <div className="mt-1 text-xs text-gray-500 truncate">{log.pathname}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* State Details */}
        <div className="w-1/2 flex flex-col">
          <div className="p-2 bg-gray-50 border-b border-gray-200">
            <h4 className="text-xs font-medium text-gray-600">
              {selectedLog ? `State Details (${selectedLog.timestamp})` : 'Current Route State'}
            </h4>
          </div>
          <div className="flex-1 overflow-y-auto p-3 text-xs">
            {selectedLog ? (
              <div className="space-y-3">
                {/* Route Info */}
                <div>
                  <h5 className="font-semibold text-gray-700 mb-1">📍 Route Information</h5>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{JSON.stringify(selectedLog.routeState, null, 2)}
                  </pre>
                </div>

                {/* Page State */}
                {selectedLog.pageState && (
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-1">📄 Page State</h5>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{JSON.stringify(selectedLog.pageState, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Layout State */}
                {selectedLog.layoutState && (
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-1">🏗️ Layout State</h5>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{JSON.stringify(selectedLog.layoutState, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Diff */}
                {selectedLog.diff && (
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-1">🔄 Changes</h5>
                    <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-xs">
                      {selectedLog.diff}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Current Route Info */}
                <div>
                  <h5 className="font-semibold text-gray-700 mb-1">📍 Current Route</h5>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{JSON.stringify({
  name: routeBuilder.name,
  pathname: routeBuilder.pathname,
  currentPath: location.pathname,
  hasLayout: !!routeBuilder.layout,
  hasPage: !!routeBuilder.page,
  layoutType: routeBuilder.layout?.type,
  activeRoutes: currentRouteInfo?.activeRoutes?.length || 0,
  breadcrumbsCount: currentRouteInfo?.breadcrumbs?.length || 0
}, null, 2)}
                  </pre>
                </div>

                {/* Navigation State */}
                {currentRouteInfo && (
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-1">🧭 Navigation State</h5>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{JSON.stringify({
  activeRoutes: currentRouteInfo.activeRoutes?.map(r => ({ name: r.name, pathname: r.pathname })),
  breadcrumbs: currentRouteInfo.breadcrumbs?.map(r => ({ name: r.name, pathname: r.pathname }))
}, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Current Page State */}
                {routeBuilder.page?.state && (
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-1">📄 Current Page State</h5>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{JSON.stringify(
  isObservable(routeBuilder.page.state) 
    ? JSON.parse(JSON.stringify(routeBuilder.page.state))
    : routeBuilder.page.state, 
  null, 2
)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="text-xs text-gray-600 flex items-center justify-between">
          <span>🏗️ Route-level state debugging</span>
          <span>{routeBuilder.name ? `Route: ${routeBuilder.name}` : 'Unknown Route'} | Path: {location.pathname}</span>
        </div>
      </div>
    </div>
  );
});

RouteStateDebugger.displayName = 'RouteStateDebugger';