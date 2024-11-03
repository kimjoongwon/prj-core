import { getPROMISEServerMock } from '@shared/frontend';

export let worker = null;
if (typeof window !== 'undefined') {
  const { setupWorker } = await import('msw/browser');
  worker = setupWorker(...getPROMISEServerMock());
}
