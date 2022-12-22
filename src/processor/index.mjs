import Input from "../models/input.mjs";
import Logger from "../utils/logger.mjs";

export default class Processor {
  constructor() {
    this.urls = [];
  }

  processArguments(urls) {
    for (let url of urls) {
      const input = new Input(url);
      this.urls.push(input);
    }
  }

  processFetchCommand() {
    return Promise.all(this.urls.map((url) => url.fetch()));
  }

  processMetaDataCommand() {
    return Promise.all(this.urls.map((url) => url.metaData()));
  }
}
