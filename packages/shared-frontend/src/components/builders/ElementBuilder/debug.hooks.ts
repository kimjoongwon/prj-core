import { useEffect, useRef } from 'react';
import { ElementBuilder as ElementBuilderInterface } from '@shared/types';
import { isDevelopment } from './debug.utils';

/**
 * ElementBuilder 디버깅을 위한 React Hook
 */

/**
 * 컴포넌트 렌더링 횟수를 추적하는 hook
 */
export const useRenderCount = (elementName: string) => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    if (isDevelopment) {
      console.log(`🔄 ${elementName} rendered ${renderCount.current} times`);
    }
  });

  return renderCount.current;
};

/**
 * props 변경사항을 추적하는 hook
 */
export const usePropsChanges = (elementName: string, props: any) => {
  const prevProps = useRef(props);

  useEffect(() => {
    if (!isDevelopment) return;

    const current = props;
    const previous = prevProps.current;

    if (previous) {
      const changedProps: string[] = [];

      // props 변경 감지
      Object.keys(current).forEach(key => {
        if (current[key] !== previous[key]) {
          changedProps.push(key);
        }
      });

      if (changedProps.length > 0) {
        console.group(`📝 ${elementName} props changed`);
        changedProps.forEach(key => {
          console.log(`${key}:`, {
            from: previous[key],
            to: current[key],
          });
        });
        console.groupEnd();
      }
    }

    prevProps.current = current;
  });
};

/**
 * 컴포넌트 생명주기를 추적하는 hook
 */
export const useElementLifecycle = (
  elementName: string,
  elementBuilder: ElementBuilderInterface,
) => {
  const mountTime = useRef<number>(0);

  useEffect(() => {
    if (!isDevelopment) return;

    mountTime.current = performance.now();
    console.log(`🚀 ${elementName} mounted`);

    return () => {
      const unmountTime = performance.now();
      const lifespan = mountTime.current ? unmountTime - mountTime.current : 0;
      console.log(`💀 ${elementName} unmounted after ${lifespan.toFixed(2)}ms`);
    };
  }, [elementName]);

  // path나 name이 변경되면 로깅
  useEffect(() => {
    if (!isDevelopment) return;
    console.log(`🔗 ${elementName} path updated:`, elementBuilder.path);
  }, [elementBuilder.path, elementName]);

  // validation이 변경되면 로깅
  useEffect(() => {
    if (!isDevelopment) return;
    if (elementBuilder.validation) {
      console.log(
        `✅ ${elementName} validation updated:`,
        elementBuilder.validation,
      );
    }
  }, [elementBuilder.validation, elementName]);
};

/**
 * 개발자 도구에서 ElementBuilder 컴포넌트를 전역으로 접근할 수 있게 하는 hook
 */
export const useDevTools = (
  elementName: string,
  elementBuilder: ElementBuilderInterface,
) => {
  useEffect(() => {
    if (!isDevelopment) return;

    // 전역 객체에 디버깅 정보 저장
    if (typeof window !== 'undefined') {
      if (!window.__ELEMENT_BUILDER_DEBUG__) {
        window.__ELEMENT_BUILDER_DEBUG__ = {
          components: new Map(),
          getComponent: (name: string) =>
            window.__ELEMENT_BUILDER_DEBUG__.components.get(name),
          getAllComponents: () =>
            Array.from(window.__ELEMENT_BUILDER_DEBUG__.components.entries()),
          logComponentTree: () => {
            console.table(window.__ELEMENT_BUILDER_DEBUG__.getAllComponents());
          },
        };
      }

      window.__ELEMENT_BUILDER_DEBUG__.components.set(elementName, {
        name: elementName,
        element: elementBuilder,
        mountedAt: new Date().toISOString(),
        path: elementBuilder.path,
      });
    }

    return () => {
      if (typeof window !== 'undefined' && window.__ELEMENT_BUILDER_DEBUG__) {
        window.__ELEMENT_BUILDER_DEBUG__.components.delete(elementName);
      }
    };
  }, [elementName, elementBuilder]);
};

// TypeScript 전역 타입 선언
declare global {
  interface Window {
    __ELEMENT_BUILDER_DEBUG__?: {
      components: Map<string, any>;
      getComponent: (name: string) => any;
      getAllComponents: () => [string, any][];
      logComponentTree: () => void;
    };
  }
}
