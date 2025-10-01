import { PublishManager } from '.';
import fs from 'fs';
import prompts from 'prompts';
import { execSync } from 'child_process';

jest.mock('fs');
jest.mock('prompts');
jest.mock('child_process');

describe('PublishManager', () => {
    const mockFs = fs as jest.Mocked<typeof fs>;
    const mockPrompts = prompts as jest.MockedFunction<typeof prompts>;
    const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

    const mockPackageJson = {
        name: 'test-package',
        version: '1.0.0',
        'pancakes-cli': true,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockFs.existsSync.mockReturnValue(true);
        mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
        mockFs.readdirSync.mockReturnValue([]);
        mockFs.writeFileSync.mockImplementation(() => { });
    });

    it('should cancel if no packages found', async () => {
        mockFs.existsSync.mockReturnValue(false);
        const manager = new PublishManager();
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        await manager.run();
        expect(errorSpy).toHaveBeenCalledWith('❌ No pancakes-cli packages found in the current directory.');
    });

    it('should cancel if no package selected', async () => {
        mockPrompts.mockResolvedValueOnce({ selectedPackage: null });
        const manager = new PublishManager();
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        await manager.run();
        expect(logSpy).toHaveBeenCalledWith('✋ Publish cancelled.');
    });

    it('should cancel if no version entered', async () => {
        mockPrompts
            .mockResolvedValueOnce({ selectedPackage: 'test-package (v1.0.0)' })
            .mockResolvedValueOnce({ newVersion: null });
        const manager = new PublishManager();
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        await manager.run();
        expect(logSpy).toHaveBeenCalledWith('✋ Publish cancelled.');
    });

    it('should skip build if declined', async () => {
        mockPrompts
            .mockResolvedValueOnce({ selectedPackage: 'test-package (v1.0.0)' })
            .mockResolvedValueOnce({ newVersion: '1.1.0' })
            .mockResolvedValueOnce({ runBuildNow: false })
            .mockResolvedValueOnce({ confirmPublish: false });

        const manager = new PublishManager();
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        await manager.run();
        expect(logSpy).toHaveBeenCalledWith(
            '⚠️ Skipping build step. Make sure the package is properly built before publishing.'
        );
    });

    it('should publish if confirmed', async () => {
        mockPrompts
            .mockResolvedValueOnce({ selectedPackage: 'test-package (v1.0.0)' })
            .mockResolvedValueOnce({ newVersion: '1.1.0' })
            .mockResolvedValueOnce({ runBuildNow: true })
            .mockResolvedValueOnce({ confirmPublish: true });

        const manager = new PublishManager();
        await manager.run();

        expect(mockExecSync).toHaveBeenCalledWith('npm run build', expect.anything());
        expect(mockExecSync).toHaveBeenCalledWith('npm publish --access public', expect.anything());
    });
});
