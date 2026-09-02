import { describe, it, expect } from 'vitest';
import { imageUrlToBase64 } from './imageUtils';

describe('imageUtils utility', () => {
  it('should resolve to null if url is falsy', async () => {
    const result = await imageUrlToBase64(null);
    expect(result).toBeNull();
  });
});
