import { createSpinner } from "nanospinner";
type Execution = { startMessage: string, callback: Function, successMessage: string, errorMessage: string }
export function execution({ startMessage, callback, successMessage, errorMessage }: Execution) {
    const spinner = createSpinner(startMessage).start();
    let errorMsg = errorMessage
    try {
        const res = callback()
        if (res?.isError) {
            errorMsg = res?.data
            return errorMsg
        } else {
            spinner.success({ text: successMessage });
            return res?.data
        }
    } catch (error) {
        throw error;
    }
}