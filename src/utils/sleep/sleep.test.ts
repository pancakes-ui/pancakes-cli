import { sleep } from ".";

describe('sleep', () => {
    test('should return true', async () => {
        expect(await sleep(1)).toBe(true);
    });
});