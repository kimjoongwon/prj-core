'use client';

import { useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { observer } from 'mobx-react-lite';

interface RouteNodeData {
  label: string;
  pathname: string;
  layout: string;
}

/**
 * 라우트 노드 컴포넌트
 */
export const RouteNode = observer(({ data }: NodeProps<RouteNodeData>) => {
  const { label, pathname, layout } = data;
  
  const handleClick = useCallback(() => {
    // 클릭 시 해당 경로로 이동하는 기능 추가 가능
  }, []);
  
  return (
    <div className="px-3 py-2 shadow-md rounded-md bg-white border border-gray-200" onClick={handleClick}>
      <Handle type="target" position={Position.Left} className="w-2 h-2" />
      <div className="font-bold text-sm">{label}</div>
      {pathname && (
        <div className="text-xs mt-1 text-gray-500 truncate" title={pathname}>
          {pathname}
        </div>
      )}
      {layout && (
        <div className="text-xs mt-1 bg-gray-100 rounded px-1 inline-block">
          {layout}
        </div>
      )}
      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
});
