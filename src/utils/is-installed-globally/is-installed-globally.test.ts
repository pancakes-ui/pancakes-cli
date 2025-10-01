import { isInstalledGlobally } from '.';
import { execSync } from 'child_process';

jest.mock('child_process');

describe('isInstalledGlobally', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('returns false if pancakes-cli is installed locally', () => {
        (execSync as jest.Mock).mockImplementationOnce(() =>
            JSON.stringify({
                dependencies: { 'pancakes-cli': { version: '1.2.3' } }
            })
        );

        expect(isInstalledGlobally()).toBe(false);
    });

    it('returns true if pancakes-cli is installed globally and not locally', () => {
        (execSync as jest.Mock)
            .mockImplementationOnce(() => { throw new Error('local not found'); })
            .mockImplementationOnce(() =>
                JSON.stringify({
                    dependencies: { 'pancakes-cli': { version: '1.2.3' } }
                })
            );

        expect(isInstalledGlobally()).toBe(true);
    });

    it('returns false if pancakes-cli is not installed anywhere', () => {
        (execSync as jest.Mock).mockImplementation(() => { throw new Error(); });

        expect(isInstalledGlobally()).toBe(false);
    });
});
