import { toJS } from 'mobx';
import { ElementBuilder as ElementBuilderInterface } from '@shared/types';

/**
 * ElementBuilder 디버깅을 위한 유틸리티 함수들
 */

export const DEBUG_COLORS = {
  primary: '#007bff',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#17a2b8',
  secondary: '#6c757d',
} as const;

/**
 * 개발 환경 여부 확인
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * 컴포넌트 렌더링 정보를 콘솔에 출력
 */
export const logElementRender = (
  elementName: string,
  element: ElementBuilderInterface,
  state: any,
  availableComponents: string[],
) => {
  if (!isDevelopment) return;

  console.group(`🔨 ElementBuilder: ${elementName}`);
  console.log(
    '%cElement Config:',
    `color: ${DEBUG_COLORS.info}`,
    toJS(element),
  );
  console.log('%cState:', `color: ${DEBUG_COLORS.secondary}`, toJS(state));
  console.log(
    '%cAvailable Components:',
    `color: ${DEBUG_COLORS.primary}`,
    availableComponents,
  );
  console.log(
    '%cValidation:',
    `color: ${DEBUG_COLORS.warning}`,
    element.validation,
  );
  console.log('%cPath:', `color: ${DEBUG_COLORS.success}`, element.path);
};

/**
 * 컴포넌트 찾기 성공 로그
 */
export const logComponentFound = (componentName: string) => {
  if (!isDevelopment) return;
  console.log(
    `%c✅ Component found: ${componentName}`,
    `color: ${DEBUG_COLORS.success}`,
  );
};

/**
 * Form 요소 렌더링 로그
 */
export const logFormRender = (childrenCount: number) => {
  if (!isDevelopment) return;
  console.log(
    `%c📝 Rendering as HTML form element with ${childrenCount} children`,
    `color: ${DEBUG_COLORS.info}`,
  );
};

/**
 * 자식 요소 렌더링 로그
 */
export const logChildRender = (index: number, elementName: string) => {
  if (!isDevelopment) return;
  console.log(
    `%c🔄 Rendering child ${index}: ${elementName}`,
    `color: ${DEBUG_COLORS.secondary}`,
  );
};

/**
 * 렌더링 완료 로그
 */
export const logRenderComplete = (childrenCount: number | string) => {
  if (!isDevelopment) return;
  console.log(
    `%cChildren count: ${childrenCount}`,
    `color: ${DEBUG_COLORS.primary}`,
  );
  console.groupEnd();
};

/**
 * 에러 컴포넌트 생성
 */
export const createErrorComponent = (
  elementName: string,
  availableComponents: string[],
) => {
  const errorMessage = `❌ Component "${elementName}" not found in ComponentManager`;
  console.error(errorMessage);

  if (!isDevelopment) return null;

  return (
    <div
      style={{
        border: '2px solid red',
        padding: '8px',
        margin: '4px',
        backgroundColor: '#ffe6e6',
        color: 'red',
        fontFamily: 'monospace',
        borderRadius: '4px',
        fontSize: '12px',
      }}
    >
      <strong>{errorMessage}</strong>
      <br />
      <details style={{ marginTop: '8px' }}>
        <summary style={{ cursor: 'pointer' }}>
          Available Components ({availableComponents.length})
        </summary>
        <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
          {availableComponents.map(name => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </details>
    </div>
  );
};

/**
 * 컴포넌트 트리 구조를 시각화
 */
export const visualizeComponentTree = (
  element: ElementBuilderInterface,
  depth = 0,
): string => {
  const indent = '  '.repeat(depth);
  const hasChildren = element.children && element.children.length > 0;
  const childrenInfo = hasChildren
    ? ` (${element.children!.length} children)`
    : '';

  let tree = `${indent}${element.name}${childrenInfo}\n`;

  if (hasChildren) {
    element.children!.forEach(child => {
      tree += visualizeComponentTree(child, depth + 1);
    });
  }

  return tree;
};

/**
 * 성능 측정을 위한 타이머
 */
export class RenderTimer {
  private startTime: number;
  private elementName: string;

  constructor(elementName: string) {
    this.elementName = elementName;
    this.startTime = performance.now();
  }

  end() {
    if (!isDevelopment) return;
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    console.log(
      `%c⏱️ ${this.elementName} render time: ${duration.toFixed(2)}ms`,
      `color: ${duration > 10 ? DEBUG_COLORS.warning : DEBUG_COLORS.success}`,
    );
  }
}
