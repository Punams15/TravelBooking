// tests/test_multiply_api.js
import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const { expect } = chai;

const SERVER_URL = "http://localhost:3000";

describe("GET /multiply API test", () => {

  it("should return correct multiplication result", async () => {
    const res = await chai
      .request(SERVER_URL)
      .get("/multiply?a=2&b=3");

    expect(res).to.have.status(200);
  });

});
