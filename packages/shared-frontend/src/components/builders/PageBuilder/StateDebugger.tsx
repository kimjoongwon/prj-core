'use client';

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { autorun, isObservable } from 'mobx';
import { usePageState } from './index';

interface StateLog {
  timestamp: string;
  state: any;
  diff?: string;
}

export const StateDebugger = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<StateLog[]>([]);
  const pageState = usePageState();

  // 초기 상태를 로그에 추가
  useEffect(() => {
    const initialLog: StateLog = {
      timestamp: new Date().toLocaleTimeString() + ' (initial)',
      state: pageState,
    };
    setLogs([initialLog]);
  }, []);

  useEffect(() => {
    console.log('Setting up autorun for pageState:', pageState);

    const dispose = autorun(() => {
      console.log('🔄 Autorun triggered! pageState:', pageState);

      // 상태를 직접 사용해서 MobX가 추적하도록 함
      const stateSnapshot = pageState ? { ...pageState } : {};
      console.log('📸 State snapshot:', stateSnapshot);

      const timestamp = new Date().toLocaleTimeString();

      setLogs(prev => {
        console.log('📝 Adding new log entry at', timestamp);
        const newLog: StateLog = {
          timestamp,
          state: stateSnapshot,
        };

        // 단순히 추가만 하고 diff는 나중에
        return [...prev.slice(-19), newLog];
      });
    });

    return dispose;
  }, []); // 의존성 배열을 비워서 마운트 시에만 실행

  const clearLogs = () => {
    setLogs([]);
  };

  const refreshState = () => {
    console.log('🔄 Manual state refresh triggered');
    console.log('🔍 Current pageState:', pageState);

    const timestamp = new Date().toLocaleTimeString() + ' (manual)';
    const newLog: StateLog = {
      timestamp,
      state: pageState,
    };

    setLogs(prev => {
      console.log('📝 Adding manual log entry');
      return [...prev.slice(-19), newLog];
    });
  };

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
          title="PageBuilder State Debugger"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
          </svg>
        </button>
      </div>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-16 left-4 w-96 h-96 bg-white border border-gray-300 rounded-lg shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="p-3 border-b bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">PageBuilder State Debug</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshState}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                >
                  Refresh
                </button>
                <button
                  onClick={clearLogs}
                  className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <div>Observable: {isObservable(pageState) ? '✅' : '❌'}</div>
              <div>State Type: {typeof pageState}</div>
              <div>Logs: {logs.length}</div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-2 text-xs">
            {/* Raw PageState Display */}
            <div className="mb-4 p-2 bg-green-50 rounded border">
              <h4 className="font-semibold text-green-800 mb-2">
                Raw PageState:
              </h4>
              <div className="bg-white p-2 rounded border">
                <div>
                  <strong>Type:</strong> {typeof pageState}
                </div>
                <div>
                  <strong>Is Object:</strong>{' '}
                  {pageState && typeof pageState === 'object' ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Keys:</strong>{' '}
                  {pageState ? Object.keys(pageState).join(', ') : 'None'}
                </div>
                <div>
                  <strong>Observable:</strong>{' '}
                  {isObservable(pageState) ? '✅' : '❌'}
                </div>
              </div>
              <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-32 border mt-2">
                {String(pageState)}
              </pre>
            </div>

            {/* Current State JSON */}
            <div className="mb-4 p-2 bg-blue-50 rounded border">
              <h4 className="font-semibold text-blue-800 mb-2">
                Current State JSON:
              </h4>
              <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-32 border">
                {(() => {
                  try {
                    return (
                      JSON.stringify(pageState, null, 2) || 'null or undefined'
                    );
                  } catch (error) {
                    return `JSON Error: ${error}`;
                  }
                })()}
              </pre>
            </div>

            {/* State Logs */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 mb-2">
                Logs ({logs.length}):
              </h4>
              {logs.length === 0 ? (
                <div className="text-gray-500 text-center py-4">
                  No logs yet
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 p-2 rounded"
                  >
                    <div className="font-mono text-gray-600 mb-1">
                      {log.timestamp}
                    </div>
                    <details>
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                        Show state (Click to expand)
                      </summary>
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <div>
                          <strong>Raw state:</strong> {String(log.state)}
                        </div>
                        <pre className="mt-1 text-xs overflow-auto max-h-32">
                          {(() => {
                            try {
                              return (
                                JSON.stringify(log.state, null, 2) ||
                                'null or undefined'
                              );
                            } catch (error) {
                              return `JSON Error: ${error}`;
                            }
                          })()}
                        </pre>
                      </div>
                    </details>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});
