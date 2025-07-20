import { Tabs } from '@shared/frontend';
import { TabNavigationProps } from '@shared/types';
import { reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';

export const TabNavigation = observer((props: TabNavigationProps) => {
  const { tabBuilder } = props;
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에서 마지막 세그먼트 추출
  const getCurrentTab = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const foundOption = tabBuilder.options.find(option => option.value === lastSegment);
    
    // 탭이 발견되면 해당 값 반환, 없으면 defaultTab 또는 첫 번째 옵션 반환
    return foundOption?.value || tabBuilder.defaultTab || tabBuilder.options[0]?.value;
  };

  const state = useLocalObservable(() => ({
    currentPath: getCurrentTab(),
  }));

  // 경로가 변경될 때 현재 탭 업데이트
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // 현재 경로의 마지막 세그먼트가 탭 옵션에 없는 경우 기본 탭으로 리다이렉트
    const foundOption = tabBuilder.options.find(option => option.value === lastSegment);
    
    if (!foundOption) {
      const defaultTab = tabBuilder.defaultTab || tabBuilder.options[0]?.value;
      if (defaultTab) {
        // 현재 경로에 기본 탭을 추가하여 리다이렉트
        const newPath = `${location.pathname}/${defaultTab}`;
        navigate(newPath, { replace: true });
        return;
      }
    }
    
    const currentTab = getCurrentTab();
    if (state.currentPath !== currentTab) {
      state.currentPath = currentTab;
    }
  }, [location.pathname]);

  useEffect(() => {
    const disposer = reaction(
      () => state.currentPath,
      (newTab) => {
        if (newTab) {
          const pathSegments = location.pathname.split('/').filter(Boolean);
          // 마지막 세그먼트를 새로운 탭으로 교체
          pathSegments[pathSegments.length - 1] = newTab;
          const fullPath = '/' + pathSegments.join('/');
          navigate(fullPath);
        }
      },
    );

    return disposer;
  }, [navigate, location.pathname]);

  return <Tabs state={state} options={tabBuilder.options} path="currentPath" />;
});
