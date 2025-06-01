'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  MarkerType,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { RouteNode } from './RouteNode';
import { RouteBuilder } from '@shared/specs';
import { routeNavigator } from '@shared/frontend';
import { Button, Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { observer } from 'mobx-react-lite';

/**
 * 라우트 시각화 컴포넌트
 * 모든 라우트 구조를 React Flow를 사용하여 시각화합니다.
 */
export const RouteVisualizer = observer(() => {
  return (
    <Card className="w-full h-[800px]">
      <CardHeader>
        <h3 className="text-lg font-bold">라우트 시각화</h3>
      </CardHeader>
      <Divider />
      <CardBody className="p-0">
        <div style={{ width: '100%', height: '100%' }}>
          <ReactFlowProvider>
            <RouteFlowContent />
          </ReactFlowProvider>
        </div>
      </CardBody>
    </Card>
  );
});

/**
 * React Flow 내부 컨텐츠 컴포넌트
 */
const RouteFlowContent = observer(() => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { fitView } = useReactFlow();

  // 노드 변경 처리
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  // 엣지 변경 처리
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );
  
  // 라우트 데이터에서 노드와 엣지 생성
  useEffect(() => {
    const routes = routeNavigator.getAllRoutes();
    if (!routes || routes.length === 0) return;
    
    const { nodes: routeNodes, edges: routeEdges } = createNodesAndEdgesFromRoutes(routes);
    setNodes(routeNodes);
    setEdges(routeEdges);
    
    // 모든 노드가 보이도록 뷰 조정
    setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 200);
  }, [fitView]);
  
  // 커스텀 노드 타입 정의
  const nodeTypes = {
    routeNode: RouteNode,
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.1}
    >
      <Background />
      <Controls />
      <Panel position="top-right">
        <Button 
          color="primary" 
          size="sm"
          onPress={() => fitView({ padding: 0.2 })}
        >
          모든 라우트 보기
        </Button>
      </Panel>
    </ReactFlow>
  );
});

/**
 * 라우트 데이터를 React Flow의 노드와 엣지로 변환하는 함수
 */
function createNodesAndEdgesFromRoutes(routes: RouteBuilder[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // 라우트 구조를 재귀적으로 순회하며 노드와 엣지 생성
  function processRoutes(
    routeItems: RouteBuilder[], 
    parentId: string | null = null, 
    level: number = 0, 
    xOffset: number = 0
  ) {
    const itemCount = routeItems.length;
    const ySpacing = 100; // 같은 레벨의 노드 간 세로 간격
    const xSpacing = 250; // 레벨 간 가로 간격
    
    routeItems.forEach((route, index) => {
      if (!route.name) return;
      
      const id = `${level}-${xOffset}-${index}`;
      const position = {
        x: level * xSpacing,
        y: (index - (itemCount - 1) / 2) * ySpacing
      };
      
      // 노드 생성
      nodes.push({
        id,
        data: { 
          label: route.name,
          pathname: route.pathname || '',
          layout: route.layout?.type || ''
        },
        position,
        type: 'routeNode',
        style: {
          width: 180,
          background: getNodeColor(route),
          color: 'black',
          border: '1px solid #ddd',
          borderRadius: '5px',
        }
      });
      
      // 부모 노드와 연결하는 엣지 생성
      if (parentId) {
        edges.push({
          id: `edge-${parentId}-${id}`,
          source: parentId,
          target: id,
          markerEnd: { type: MarkerType.ArrowClosed },
          type: 'smoothstep',
          animated: false,
        });
      }
      
      // 자식 라우트가 있으면 재귀적으로 처리
      if (route.children && route.children.length > 0) {
        processRoutes(route.children, id, level + 1, xOffset + index);
      }
    });
  }
  
  // 루트 라우트부터 처리 시작
  processRoutes(routes);
  
  return { nodes, edges };
}

/**
 * 노드 유형에 따라 색상을 결정하는 함수
 */
function getNodeColor(route: RouteBuilder): string {
  if (route.layout?.type === 'Auth') {
    return '#FFCCCC';
  } else if (route.layout?.type === 'Root') {
    return '#CCFFCC';
  } else if (route.page) {
    return '#CCCCFF';
  } else if (route.children && route.children.length > 0) {
    return '#FFFFCC';
  }
  return '#ffffff';
}
