import { describe, it, expect, beforeEach } from 'vitest';
import { ModalService } from './modal';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    service = new ModalService();
  });

  it('should build modal with provided options', () => {
    service.build({ type: 'alert', header: 'Hello' });

    expect(service.open).toBe(true);
    expect(service.type).toBe('alert');
    expect(service.header).toBe('Hello');
  });

  it('should reset values on destory', () => {
    service.build({ type: 'alert', header: 'Hello' });
    service.destory();

    expect(service.open).toBe(false);
    expect(service.type).toBeUndefined();
    expect(service.header).toBeUndefined();
  });
});
