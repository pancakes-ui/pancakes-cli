import { isUnix } from ".";

describe('print logo', () => {
    test('should return boolean', () => {
        expect(typeof isUnix()).toBe('boolean');
    });
});