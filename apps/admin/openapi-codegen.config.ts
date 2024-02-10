import {
  generateSchemaTypes,
  generateReactQueryComponents,
} from '@openapi-codegen/typescript';
import { defineConfig } from '@openapi-codegen/cli';
export default defineConfig({
  coc: {
    from: {
      source: 'file',
      relativePath: './swagger-spec.json',
    },
    outputDir: 'rqc',
    to: async context => {
      const filenamePrefix = 'coc';
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
