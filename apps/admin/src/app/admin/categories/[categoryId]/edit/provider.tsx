'use client';

import { ContainerProps, Form } from '@coc/ui';
import { observer } from 'mobx-react-lite';
import { createContext } from 'react';
import { useMeta } from './_hooks';

interface PageContext extends ReturnType<typeof useMeta> {}

export const PageContext = createContext<PageContext>({} as PageContext);

export const Provider = observer((props: ContainerProps) => {
  const meta = useMeta();

  const { children } = props;

  const {
    form: { onClickCancel, onClickSave, schema, state },
  } = meta;

  return (
    <PageContext.Provider value={{ ...meta }}>
      <Form
        title="카테고리"
        state={state}
        schema={schema}
        onClickSave={onClickSave}
        onClickCancel={onClickCancel}
      >
        {children}
      </Form>
    </PageContext.Provider>
  );
});
