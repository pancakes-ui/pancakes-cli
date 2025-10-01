import { printLogo } from ".";

describe('print logo', () => {
    test('should return true', () => {
        expect(printLogo()).toBe(true);
    });
});