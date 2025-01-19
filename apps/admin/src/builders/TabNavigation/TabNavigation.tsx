import { Tabs } from '@shared/frontend';
import { TabBuilder } from '@shared/types';
import { reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

interface TabNavigationProps {
  tabBuilder: TabBuilder;
}

export const TabNavigation = observer((props: TabNavigationProps) => {
  const { tabBuilder } = props;

  const state = useLocalObservable(() => ({
    currentPath: tabBuilder.options[0].value,
  }));

  const navigate = useNavigate();

  useEffect(() => {
    navigate(state.currentPath, {
      replace: true,
    });

    const disposer = reaction(
      () => state.currentPath,
      () => {
        navigate(state.currentPath, {
          replace: true,
        });
      },
    );

    return disposer;
  }, []);

  return (
    <>
      <Tabs state={state} options={tabBuilder.options} path="currentPath" />
      <Outlet />
    </>
  );
});
