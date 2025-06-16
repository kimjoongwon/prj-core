import { Tabs } from '@shared/frontend';
import { TabNavigationProps } from '@shared/types';
import { reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const TabNavigation = observer((props: TabNavigationProps) => {
  const { tabBuilder } = props;

  const state = useLocalObservable(() => ({
    currentPath: tabBuilder.options[0].value,
  }));
  const navigate = useNavigate();

  useEffect(() => {
    navigate(state.currentPath);

    const disposer = reaction(
      () => state.currentPath,
      () => {
        navigate(state.currentPath);
      },
    );

    return disposer;
  }, [navigate, state.currentPath]);

  return (
    <>
      <Tabs state={state} options={tabBuilder.options} path="currentPath" />
    </>
  );
});
