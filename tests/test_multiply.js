// tests/test_multiply.js
import { describe, it } from "mocha";
import { expect } from "../util/get_chai.js";
import { multiply } from "../util/multiply.js";

describe("multiply() basic unit test", () => {
  it("should multiply two numbers correctly", () => {
    expect(multiply(2, 3)).to.equal(6);
  });

  it("should return 0 if one number is 0", () => {
    expect(multiply(0, 5)).to.equal(0);
  });
});

