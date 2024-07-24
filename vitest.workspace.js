import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./apps/server/vitest.config.e2e.ts",
  "./apps/server/vitest.config.ts",
  "./apps/admin/vitest.config.ts"
])
