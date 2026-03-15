// tests/crud_operations.js
import { describe, it } from "mocha";
import { expect, request } from "../util/get_chai.js";

describe("Bookings CRUD – basic smoke test", () => {
  it("GET /bookings loads", async () => {
    const res = await request.get("/bookings");
    expect(res).to.have.status(200);  // only checks that the route responds
  });
});

