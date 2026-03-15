// tests/setup.js
import { app } from "../app.js";
import { before, after } from "mocha";

let server;

before(async () => {
  server = app.listen(3000, () => {
    console.log("Test server running on port 3000");
  });
});

after(async () => {
  await server.close();
});
