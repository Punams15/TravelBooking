// tests/registration_logon.js
import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const { expect } = chai;

const SERVER_URL = "http://localhost:3000";

describe("Registration & Login pages", () => {

  it("GET /auth/register loads", async () => {
    const res = await chai.request(SERVER_URL).get("/auth/register");
    expect(res).to.have.status(200);
  });

  it("GET /auth/login loads", async () => {
    const res = await chai.request(SERVER_URL).get("/auth/login");
    expect(res).to.have.status(200);
  });

});

