import { getNpmUsername } from ".";

describe("get npm info", () => {
    test("get npm username", () => {
        expect(getNpmUsername()).not.toBeNull()
    })
})