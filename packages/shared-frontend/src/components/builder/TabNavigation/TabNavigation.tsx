import { Tabs } from '@shared/frontend';
import { TabNavigationProps } from '@shared/types';
import { reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

export const TabNavigation = observer((props: TabNavigationProps) => {
  const { tabBuilder } = props;
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에서 마지막 세그먼트 추출
  const getCurrentTab = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    return tabBuilder.options.find(option => option.value === lastSegment)?.value || tabBuilder.options[0].value;
  };

  const state = useLocalObservable(() => ({
    currentPath: getCurrentTab(),
  }));

  // 경로가 변경될 때 현재 탭 업데이트
  useEffect(() => {
    const currentTab = getCurrentTab();
    if (state.currentPath !== currentTab) {
      state.currentPath = currentTab;
    }
  }, [location.pathname]);

  useEffect(() => {
    const disposer = reaction(
      () => state.currentPath,
      (newTab) => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const basePath = '/' + pathSegments.slice(0, -1).join('/');
        const fullPath = `${basePath}/${newTab}`;
        navigate(fullPath);
      },
    );

    return disposer;
  }, [navigate, location.pathname]);

  return <Tabs state={state} options={tabBuilder.options} path="currentPath" />;
});
