import { expect } from "chai";
import Processor from "../src/processor/index.mjs";
import fs from "fs";
import { JSDOM } from "jsdom";

process.env.NODE_ENV = "test";

describe("Autify Take Home Assignment Tests", function () {
  let processor = null;

  const validURL1 = "http://www.google.com";
  const validURL2 = "https://www.autify.com/why-autify";
  const validURLs = [validURL1, validURL2];
  const inValidURL1 = "!!invalid!!";

  this.beforeEach(function () {
    processor = new Processor();
    validURLs.forEach((url) => {
      const urlObj = new URL(url);
      const { hostname } = urlObj;
      if (fs.existsSync(hostname)) {
        fs.rmSync(hostname, { recursive: true, force: true });
      }
    });
  });

  describe("Process Arguments", function () {
    it("Should process a valid URL", function () {
      processor.processArguments([validURL1]);
      const processedUrlsLength = processor.urls.length;
      expect(processedUrlsLength).to.equal(1);
    });
    it("Should process a multiple valid URLs", function () {
      processor.processArguments(validURLs);
      const processedUrlsLength = processor.urls.length;
      expect(processedUrlsLength).to.equal(2);
    });
    it("Should not process an invalid URL, should throw error", function () {
      expect(function () {
        processor.processArguments([inValidURL1]);
      }).to.throw(Error);
    });
  });

  describe("Process Fetch", function () {
    it("Should fetch a valid URL", async function () {
      processor.processArguments([validURL1]);
      await processor.processFetchCommand();
      const urlObj = new URL(validURL1);
      const { hostname } = urlObj;
      const doesFolderExist = fs.existsSync(hostname);
      const doesIndexFileExist = fs.existsSync(`${hostname}/index.html`);
      expect(doesFolderExist).to.equal(true);
      expect(doesIndexFileExist).to.equal(true);
    });
  });

  describe("Process Metadata", function () {
    it("Should fetch metadata for a valid URL", async function () {
      processor.processArguments([validURL1]);
      await processor.processMetaDataCommand();
      const urlObj = new URL(validURL1);
      const { hostname } = urlObj;
      const doesFolderExist = fs.existsSync(hostname);
      const doesMetadataFileExist = fs.existsSync(`${hostname}/_metadata.json`);
      expect(doesFolderExist).to.equal(true);
      expect(doesMetadataFileExist).to.equal(true);
    });
    it("Should provide accurante metadata", async function () {
      processor.processArguments([validURL1]);
      await processor.processMetaDataCommand();
      const urlObj = new URL(validURL1);
      const { hostname } = urlObj;
      const indexFilePath = `${hostname}/index.html`;
      const metadataFilePath = `${hostname}/_metadata.json`;
      const doesIndexFileExist = fs.existsSync(indexFilePath);
      const doesMetadataFileExist = fs.existsSync(metadataFilePath);

      let html, metadata;
      if (doesIndexFileExist && doesMetadataFileExist) {
        html = fs.readFileSync(indexFilePath, {
          encoding: "utf8",
        });
        metadata = JSON.parse(
          fs.readFileSync(metadataFilePath, {
            encoding: "utf8",
          })
        );
      }

      // Validating metadata accuracy against DOM parsing
      const dom = new JSDOM(html);
      const document = dom.window.document;

      const numLinks = Array.from(document.getElementsByTagName("a")).length;
      const numImages = Array.from(document.getElementsByTagName("img")).length;

      const { num_links: metadataNumLinks, images: metadataNumImages } =
        metadata;
      expect(metadataNumLinks).to.equal(numLinks);
      expect(metadataNumImages).equal(numImages);
    });
  });
});
