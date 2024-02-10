'use client';

import { ContainerProps, Form } from '@coc/shared';
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

export const TimelineEditPageContext = createContext<PageContext>(
  {} as PageContext,
);

export const TimelineEditPageProvider = observer((props: ContainerProps) => {
  const { children } = props;

  const queries = useQueries();
  const state = useState({
    queries,
  });
  const mutations = useMutations();
  const handlers = useHandlers({
    mutations,
    state,
  });
  const schemas = useSchemas();

  const { timelineFormSchema } = schemas;
  const { onClickCancel, onClickSave } = handlers;

  return (
    <TimelineEditPageContext.Provider
      value={{
        handlers,
        schemas,
        state,
      }}
    >
      <Form
        title="타임라인 편집"
        state={state.form}
        schema={timelineFormSchema}
        onClickSave={onClickSave}
        onClickCancel={onClickCancel}
      >
        {children}
      </Form>
    </TimelineEditPageContext.Provider>
  );
});
