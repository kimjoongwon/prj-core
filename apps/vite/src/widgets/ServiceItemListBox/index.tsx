import { Paper } from '@mui/material';
import { ListboxItemProps } from '@nextui-org/react';
import { Listbox, useGetServiceItemRoutes } from '@shared/frontend';
import { reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const ServiceItemListBox = observer(() => {
  const { data: getServiceItemRoutesResponse } = useGetServiceItemRoutes();
  const serviceItemRoutes = getServiceItemRoutesResponse?.data || [];
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const state = useLocalObservable(() => ({ currentPathname: pathname }));

  const listboxItem: ListboxItemProps[] = serviceItemRoutes
    .filter(item => pathname.includes(item.pathname))
    .map(item => {
      console.log('state.currentPathname', state.currentPathname);
      console.log('item.pathname', item.pathname);
      return {
        key: item.pathname,
        value: item.pathname,
        title: item.name,
        active: state.currentPathname?.includes(item.pathname),
      };
    });

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

  return (
    <Paper variant="outlined" className="w-60 mt-1">
      <Listbox state={state} path="currentPathname" items={listboxItem} />
    </Paper>
  );
});
