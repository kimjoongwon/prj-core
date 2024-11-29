import { ButtonProps } from '@nextui-org/react';
import {
  useGetMainNavbarItems,
  MainNavBar as BaseMainNavBar,
} from '@shared/frontend';
import { reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const MainNavBar = observer(() => {
  const { data: useGetMainNavbarItemsResponse } = useGetMainNavbarItems();
  const navbarItems = useGetMainNavbarItemsResponse?.data || [];
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const state = useLocalObservable(() => ({ currentPathname: pathname }));

  useEffect(() => {
    const disposer = reaction(
      () => state.currentPathname,
      () => {
        navigate(state.currentPathname);
      },
    );

    return disposer;
  }, []);

  const buttons: ButtonProps[] = navbarItems.map(page => ({
    variant: 'bordered',
    children: page.name,
    href: page.pathname,
  }));

  return (
    <BaseMainNavBar
      navItems={buttons}
      value={pathname}
      state={state}
      path="currentPathname"
    />
  );
});
