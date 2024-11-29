import { ListboxItemProps } from '@nextui-org/react';
import { Listbox, useGetServiceItemRoutes } from '@shared/frontend';
import { reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ServiceItemListBox = observer(() => {
  const { data: getServiceItemRoutesResponse } = useGetServiceItemRoutes();
  const serviceItems = getServiceItemRoutesResponse?.data || [];
  const navigate = useNavigate();

  const listboxItem: ListboxItemProps[] = serviceItems.map(item => ({
    key: item.pathname,
    value: item.pathname,
    title: item.name,
  }));

  const state = useLocalObservable(() => ({ currentPathname: '' }));

  useEffect(() => {
    reaction(
      () => state.currentPathname,
      () => {
        navigate({
          pathname: state.currentPathname,
        });
      },
    );
  }, []);

  return <Listbox state={state} path="currentPathname" items={listboxItem} />;
});
