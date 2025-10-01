export const indexTestPureTemplate = () => {
    return `import { describe, expect, test } from '@jest/globals';
import { hello } from '.';

describe('hello function', () => {
    test('should return correct greeting message', () => {
        expect(hello()).toBe('Hello from pancakes-cli!');
    });
});`
}