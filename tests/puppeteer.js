// tests/puppeteer.js
import { describe, it, before, after } from "mocha";
import puppeteer from "puppeteer";
import { expect } from "../util/get_chai.js";

describe("Puppeteer UI Test", function () {
  this.timeout(10000);

  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  after(async () => {
    await browser.close();
  });

  it("loads homepage title", async () => {
    await page.goto("http://localhost:3000");
    const title = await page.title();
    expect(title).to.be.a("string");
  });
});

