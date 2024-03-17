---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/[<%= name %>Id]/edit/page.tsx
---
'use client';

import React from 'react';
import { <%= Name %>Form } from '@components';
import { use<%= Name %>EditPage } from './hooks';
import { Form } from '@coc/web';

export default function Page() {
  const {
    schemas: { <%= name %>FormSchema },
    state,
  } = use<%= Name %>EditPage();

  return (
    <<%= Name %>Form state={state.form} schema={<%= name %>FormSchema} />
  );
}

