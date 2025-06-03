import { Tabs } from '@shared/frontend';
import { TabBuilder } from '@shared/types';
import { reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface TabNavigationProps {
  tabBuilder: TabBuilder;
}

export const TabNavigation = observer((props: TabNavigationProps) => {
  const { tabBuilder } = props;

  const state = useLocalObservable(() => ({
    currentPath: tabBuilder.options[0].value,
  }));

  const router = useRouter();

  useEffect(() => {
    router.replace(state.currentPath);

    const disposer = reaction(
      () => state.currentPath,
      () => {
        router.replace(state.currentPath);
      },
    );

    return disposer;
  }, [router, state.currentPath]);

  return (
    <>
      <Tabs state={state} options={tabBuilder.options} path="currentPath" />
    </>
  );
});
