export const gitignoreTemplate = ({ ignores }: { ignores?: string[] } = {}) => {
    return `node_modules
dist ${ignores ? ignores?.map(item => ` ${item} `) : ""}`
}