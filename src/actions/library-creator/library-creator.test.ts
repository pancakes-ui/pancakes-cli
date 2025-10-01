import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import { getNpmUsername } from '../../utils/get-info/get-npm-info';
import { LibraryCreator } from '.';

jest.mock('fs');
jest.mock('path');
jest.mock('prompts');
jest.mock('child_process');
jest.mock('../utils/get-info/get-npm-info');

jest.mock('../templates/gitignore', () => ({
    gitignoreTemplate: jest.fn(() => 'GITIGNORE'),
}));
jest.mock('../templates/pure/index.template', () => ({
    indexPureTemplate: jest.fn(() => 'INDEX'),
}));
jest.mock('../templates/pure/index-test.template', () => ({
    indexTestPureTemplate: jest.fn(() => 'INDEX_TEST'),
}));
jest.mock('../templates/pure/jest.config', () => ({
    jestConfigPureTemplate: jest.fn(() => 'JEST_CONFIG'),
}));
jest.mock('../templates/pure/package.json', () => ({
    packageJsonPureTemplate: jest.fn(() => ({ name: 'mock-lib', version: '1.0.0' })),
}));
jest.mock('../templates/pure/tsconfig.json', () => ({
    tsConfigPureTemplate: jest.fn(() => ({ compilerOptions: {} })),
}));
jest.mock('../templates/pure/tsup.config', () => ({
    tsupConfigPureTemplate: jest.fn(() => 'TSUP_CONFIG'),
}));

describe('LibraryCreator', () => {
    const mockFs = fs as jest.Mocked<typeof fs>;
    const mockPrompts = prompts as jest.MockedFunction<typeof prompts>;
    const mockGetNpmUsername = getNpmUsername as jest.MockedFunction<typeof getNpmUsername>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockFs.existsSync.mockReturnValue(false);
        mockFs.writeFileSync.mockImplementation(() => { });
        mockFs.readFileSync.mockReturnValue('{}');
        mockFs.mkdirSync.mockImplementation();
        mockGetNpmUsername.mockReturnValue('mock-user');

        jest.spyOn(process, 'cwd').mockReturnValue('/mock/path');
        (path.resolve as jest.Mock).mockImplementation((...args) => args.join('/'));
    });

    it('should abort if name or author is missing', async () => {
        mockPrompts.mockResolvedValueOnce({ name: '', author: '' });
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
            throw new Error('exit');
        });

        const creator = new LibraryCreator();
        await expect(creator.run()).rejects.toThrow('exit');
        expect(logSpy).toHaveBeenCalledWith('✋ Aborted');
        exitSpy.mockRestore();
    });

    it('should create project structure when valid input is provided', async () => {
        mockPrompts.mockResolvedValueOnce({ name: 'my-lib', author: 'mock-user' });
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        const creator = new LibraryCreator();
        await creator.run();

        expect(mockFs.mkdirSync).toHaveBeenCalledWith('/mock/path/my-lib', { recursive: true });
        expect(mockFs.writeFileSync).toHaveBeenCalledTimes(7);
    });
});
