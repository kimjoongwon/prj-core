---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/[<%= name %>Id]/edit/page.tsx
---
'use client';

import React from 'react';
import { <%= Name %>Form } from '@components';
import { use<%= Name %>EditPage } from './hooks';
import { Form } from '@coc/ui';

export default function Page() {
  const {
    handlers: { onClickCancel, onClickSave },
    schemas: { <%= name %>FormSchema },
    state,
  } = use<%= Name %>EditPage();

  return (
    <Form
      title="카테고리"
      state={state.form}
      schema={<%= name %>FormSchema}
      onClickSave={onClickSave}
      onClickCancel={onClickCancel}
    >
      <<%= Name %>Form state={state.form} schema={<%= name %>FormSchema} />;
    </Form>
  );
}

