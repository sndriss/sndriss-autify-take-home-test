import fs from "fs";
import FetchR from "../utils/fetchR.mjs";
import FileUtils from "../utils/files.mjs";
import Logger from "../utils/logger.mjs";
import RegexUtils from "../utils/regex.mjs";

export default class Input {
  constructor(url) {
    this.url = new URL(url);
    const { hostname } = this.url;
    this.domainFolderName = hostname;
    this.indexFilePath = `${hostname}/index.html`;
    this.metaDataFilePath = `${hostname}/_metadata.json`;
  }

  /**
   * [fetch public method used to fetch URL's page, metadata and assets]
   */
  async fetch() {
    await this.#fetchAndSavePage();
    await this.#fetchPageAssets();
  }

  /**
   * [metaData public method used to fetch metadata for URL
   * if metadata does not exist, triggers a refetch]
   */
  async metaData() {
    Logger.info(`Fetching metadata for ${this.url.toString()}`);
    if (!fs.existsSync(this.metaDataFilePath)) {
      Logger.warn(
        `Metadata for ${this.url.toString()} does not exist. Will refetch site.`
      );
      await this.fetch();
    }

    const metadata = fs.readFileSync(this.metaDataFilePath, {
      encoding: "utf8",
    });

    Logger.table(JSON.parse(metadata));
  }

  /**
   * [#generateMetaData private method used to generate
   * the metadata for the fetched site and saves in
   * <hostname>/_metadata.json]
   */
  async #generateMetaData() {
    Logger.info(`Generating metadata for ${this.url.toString()}`);
    const { birthtime } = fs.statSync(this.indexFilePath);
    const html = fs.readFileSync(this.indexFilePath, {
      encoding: "utf8",
    });

    const linkCount = RegexUtils.getTotalATagMatches(html);
    const imageCount = RegexUtils.getTotalImgTagMatches(html);

    const metadata = {
      site: this.url.hostname,
      num_links: linkCount,
      images: imageCount,
      birthtime: birthtime.toUTCString(),
    };

    fs.writeFileSync(
      this.metaDataFilePath,
      JSON.stringify(metadata, null, 2),
      "utf-8"
    );
  }

  /**
   * [#fetchPageAssets private method used to fetch all the
   * local (residing on the same host i.e. start with /),
   * <img> assets on the page]
   */
  async #fetchPageAssets() {
    Logger.info(`Fetching assets for page: ${this.url.toString()}`);
    if (!fs.existsSync(this.indexFilePath)) {
      this.#fetchAndSavePage();
    }

    let html = fs.readFileSync(this.indexFilePath, {
      encoding: "utf8",
    });

    const matchedImgSrcs =
      RegexUtils.extractMatchedImgTagSrcAttributeValues(html);

    await Promise.all(
      matchedImgSrcs.map((match) => FileUtils.saveAssetFile(this.url, match))
    );
  }

  /**
   * [#fetchAndSavePage private method used to fetch the
   * specified page in user input and save in <hostname>/index.html
   * file as well as generating metadata for the file]
   */
  async #fetchAndSavePage() {
    Logger.info(`Fetching page: ${this.url.toString()}`);
    if (fs.existsSync(this.domainFolderName)) {
      fs.rmSync(this.domainFolderName, { recursive: true, force: true });
    }
    fs.mkdirSync(this.domainFolderName);

    const html = await FetchR.fetchRetry(this.url.toString());

    fs.writeFileSync(this.indexFilePath, html);
    this.#generateMetaData();
  }
}
