// 'use client';

// import React, { useContext, useEffect, useState } from 'react';
// import { Galaxy } from '../../services/Illit';
// import { observer } from 'mobx-react-lite';
// import { Spinner } from '@nextui-org/react';

// interface AppProviderProps {
//   children: React.ReactNode;
// }

// const AppContext = React.createContext<Galaxy>({} as Galaxy);

// export const useApp = () => {
//   return useContext(AppContext);
// };

// export let galaxy: Galaxy = {} as Galaxy;

// export const AppProvider = observer(({ children }: AppProviderProps) => {
//   const [isInitialized, setInitialized] = useState(false);

//   useEffect(() => {
//     const init = async () => {
//       galaxy = new Galaxy();
//       if (!window.location.pathname.includes('/auth')) {
//         await galaxy.auth.reAuthenticate();
//       }
//     };
//     setInitialized(true);
//     init();
//   }, []);

//   if (!isInitialized) {
//     return <Spinner />;
//   }

//   return <AppContext.Provider value={galaxy}>{children}</AppContext.Provider>;
// });
