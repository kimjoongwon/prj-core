---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/[<%= name %>Id]/edit/hooks/useSchemas.ts
---

import { z } from 'nestjs-zod/z';

export const useSchemas = () => {
  const <%= name %>FormSchema = z.object({
    name: z.string().min(1).max(10),
  });

  return {
    <%= name %>FormSchema,
  };
};

