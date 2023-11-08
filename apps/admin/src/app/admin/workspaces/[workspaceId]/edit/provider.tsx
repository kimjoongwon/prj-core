'use client';

import { ContainerProps } from '@coc/ui';
import { observer } from 'mobx-react-lite';
import { createContext } from 'react';
import {
  useHandlers,
  useMutations,
  useQueries,
  useSchemas,
  useState,
} from './hooks';

interface PageContext {
  handlers: ReturnType<typeof useHandlers>;
  schemas: ReturnType<typeof useSchemas>;
  state: ReturnType<typeof useState>;
}

export const WorkspaceEditPageContext = createContext<PageContext>({} as PageContext);

export const WorkspaceEditPageProvider = observer((props: ContainerProps) => {
  const queries = useQueries();
  const mutations = useMutations();
  const state = useState({
    queries,
  });
  const handlers = useHandlers({
    mutations,
    state,
  });
  const schemas = useSchemas();

  const { children } = props;

  return (
    <WorkspaceEditPageContext.Provider
      value={{
        handlers,
        schemas,
        state,
      }}
    >
      {children}
    </WorkspaceEditPageContext.Provider>
  );
});
