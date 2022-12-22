"use strict";
import Processor from "../processor/index.mjs";
import Logger from "../utils/logger.mjs";

class CommandLine {
  constructor() {
    this.processor = new Processor();
  }

  async run() {
    try {
      const [, , firstArgument, ...remainingArguments] = process.argv;
      if (firstArgument === "--metadata") {
        this.processor.processArguments(remainingArguments);
        this.processor.processMetaDataCommand();
      } else {
        this.processor.processArguments([firstArgument, ...remainingArguments]);
        this.processor.processFetchCommand();
      }
    } catch (e) {
      const { message } = e;
      Logger.error(`Error: ${message}`);
    }
  }
}

export default CommandLine;
