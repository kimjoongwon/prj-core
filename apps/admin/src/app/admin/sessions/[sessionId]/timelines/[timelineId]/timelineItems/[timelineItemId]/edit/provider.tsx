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

export const TimelineItemEditPageContext = createContext<PageContext>(
  {} as PageContext,
);

export const TimelineItemEditPageProvider = observer(
  (props: ContainerProps) => {
    const { children } = props;

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

    const { timelineItemFormSchema } = schemas;
    const { onClickCancel, onClickSave } = handlers;

    return (
      <TimelineItemEditPageContext.Provider
        value={{
          handlers,
          schemas,
          state,
        }}
      >
        <Form
          title="카테고리"
          state={state.form}
          schema={timelineItemFormSchema}
          onClickSave={onClickSave}
          onClickCancel={onClickCancel}
        >
          {children}
        </Form>
      </TimelineItemEditPageContext.Provider>
    );
  },
);
