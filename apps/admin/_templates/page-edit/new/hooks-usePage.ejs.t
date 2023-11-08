---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/[<%= name %>Id]/edit/hooks/use<%= Name %>EditPage.ts
---
import { useContext } from 'react';
import { <%= Name %>EditPageContext } from '../provider';

export const use<%= Name %>EditPage = () => {
  return useContext(<%= Name %>EditPageContext);
};


