import { isEven } from "./math";

describe("isEven", () => {
    it("should return true if given even number", () => {
        //Function under test (SUT - System Under Test)
        const result = isEven(2);
        //Assertion
        expect(result).toEqual(true);
    })
    it("should return false if given odd number", () => {
        //Function under test (SUT - System Under Test)
        const result = isEven(1);
        //Assertion
        expect(result).toEqual(false);
    })
})
