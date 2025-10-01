import { getInstalledVersion } from '.';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

jest.mock('child_process');
jest.mock('fs');

describe('getInstalledVersion', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('returns local npm version if available', () => {
        (execSync as jest.Mock).mockReturnValueOnce(JSON.stringify({
            dependencies: { 'pancakes-cli': { version: '1.2.3' } }
        }));

        expect(getInstalledVersion()).toBe('1.2.3');
    });

    it('returns global npm version if local fails', () => {
        (execSync as jest.Mock)
            .mockImplementationOnce(() => { throw new Error('local fail'); })
            .mockReturnValueOnce(JSON.stringify({
                dependencies: { 'pancakes-cli': { version: '2.0.0' } }
            }));

        expect(getInstalledVersion()).toBe('2.0.0');
    });

    it('returns package.json version if npm checks fail', () => {
        (execSync as jest.Mock).mockImplementation(() => { throw new Error(); });
        (readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify({ version: '3.0.0' }));

        expect(getInstalledVersion()).toBe('3.0.0');
    });

    it('returns default version if all checks fail', () => {
        (execSync as jest.Mock).mockImplementation(() => { throw new Error(); });
        (readFileSync as jest.Mock).mockImplementation(() => { throw new Error(); });

        expect(getInstalledVersion()).toBe('0.0.0');
    });
});
