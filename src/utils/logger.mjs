class Logger {
  static ERROR_LOG_COLOR = "\x1b[31m%s\x1b[0m";
  static INFO_LOG_COLOR = "\x1b[34m%s\x1b[0m";
  static WARN_LOG_COLOR = "\x1b[33m%s\x1b[0m";

  static emptyLine() {
    if (process.env.NODE_ENV !== "test") {
      console.log("");
    }
  }
  static log(msg) {
    if (process.env.NODE_ENV !== "test") {
      console.log(msg);
    }
  }
  static table(msg) {
    if (process.env.NODE_ENV !== "test") {
      console.table(msg);
    }
  }
  static info(msg) {
    if (process.env.NODE_ENV !== "test") {
      console.info(this.INFO_LOG_COLOR, msg);
    }
  }
  static warn(msg) {
    if (process.env.NODE_ENV !== "test") {
      console.warn(this.WARN_LOG_COLOR, msg);
    }
  }
  static error(msg) {
    if (process.env.NODE_ENV !== "test") {
      console.error(this.ERROR_LOG_COLOR, msg);
    }
  }
}

export default Logger;
