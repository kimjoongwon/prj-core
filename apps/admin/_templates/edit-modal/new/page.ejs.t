---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/@modals/(..)<%= h.inflection.pluralize(name) %>/[<%= name %>Id]/edit/page.tsx
---
'use client';

import React from 'react';
import { <%= Name %>Form } from '@components';
import { use<%= Name %>EditPage } from '../../../../[<%= name %>Id]/edit/hooks';

export default function Page() {
  const {
    form: { state },
  } = use<%= Name %>EditPage();

  return <<%= Name %>Form state={state} />;
}
