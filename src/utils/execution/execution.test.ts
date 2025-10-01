import { execution } from '.';

describe('execution', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call spinner.success on successful execution', () => {
        const result = execution({
            startMessage: 'Starting...',
            callback: () => ({ isError: false, data: 'done' }),
            successMessage: 'Success!',
            errorMessage: 'Failed!',
        });
        expect(result).toEqual("done");
    });

    it('should call spinner.error if callback returns isError', () => {


        expect(execution({
            startMessage: 'Starting...',
            callback: () => ({ isError: true, data: 'Something went wrong' }),
            successMessage: 'Success!',
            errorMessage: 'Default error',
        })).toBe("Something went wrong");
    });
});
