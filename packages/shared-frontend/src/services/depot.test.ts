import { describe, it, expect, vi } from 'vitest';
import { DepotService } from './depot';

describe('DepotService', () => {
  it('should convert url response to File', async () => {
    const blob = new Blob(['hello'], { type: 'text/plain' });
    global.fetch = vi.fn().mockResolvedValue({ blob: () => Promise.resolve(blob) }) as any;

    const file = await DepotService.urlToFile('http://example.com/test.txt', 'test.txt', 'text/plain');

    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe('test.txt');
    expect(file.type).toBe('text/plain');
    expect(file.size).toBe(blob.size);
    expect((global.fetch as any)).toHaveBeenCalledWith('http://example.com/test.txt');
  });

  it('should propagate fetch errors', async () => {
    const error = new Error('fail');
    global.fetch = vi.fn().mockRejectedValue(error) as any;

    await expect(
      DepotService.urlToFile('http://example.com/fail.txt', 'fail.txt', 'text/plain'),
    ).rejects.toThrow('fail');
  });
});
