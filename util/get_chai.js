// util/get_chai.js
import chai from "chai";           // v4 default import works
import chaiHttp from "chai-http";  // plugin

import { app } from "../app.js";   // my Express app

chai.use(chaiHttp);

export const expect = chai.expect;
export const request = chai.request(app);