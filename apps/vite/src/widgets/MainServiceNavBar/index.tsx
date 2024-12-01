// import { ButtonProps } from '@nextui-org/react';
// import { MainServiceNavBar as BaseMainServiceNavBar } from '@shared/frontend';
// import { reaction } from 'mobx';
// import { observer, useLocalObservable } from 'mobx-react-lite';
// import { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// export const MainServiceNavBar = observer(() => {
//   const { data: getMainServiceRoutesResponse } = useGetMainServiceRoutes();
//   const routes = getMainServiceRoutesResponse?.data || [];
//   const { pathname } = useLocation();
//   const navigate = useNavigate();
//   const state = useLocalObservable(() => ({ currentPathname: pathname }));

//   useEffect(() => {
//     const disposer = reaction(
//       () => state.currentPathname,
//       () => {
//         navigate(state.currentPathname);
//       },
//     );

//     return disposer;
//   }, []);

//   const buttons: ButtonProps[] = routes.map(page => ({
//     variant: 'bordered',
//     children: page.name,
//     href: page.pathname,
//     active: state.currentPathname.includes(page.pathname),
//   }));

//   return (
//     <BaseMainServiceNavBar
//       navItems={buttons}
//       value={pathname}
//       state={state}
//       path="currentPathname"
//     />
//   );
// });
