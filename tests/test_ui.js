// tests/test_ui.js
import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const { expect } = chai;

const SERVER_URL = "http://localhost:3000";

describe("UI Test – Homepage", () => {

  it("should load the homepage successfully", async () => {
    const res = await chai
      .request(SERVER_URL)
      .get("/");

    expect(res).to.have.status(200);
  });

});

