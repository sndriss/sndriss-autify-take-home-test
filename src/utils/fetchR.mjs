import Logger from "./logger.mjs";

export default class FetchR {
  /**
   * [fetchRetry static method which acts as a wrapper for fetch with retries]
   * @param  {[Object]} options [options to be fed into fetch call]
   * @param  {[number]} retries [number of retries to execute if fetch fails]
   */
  static fetchRetry(url, options = {}, retries = 3) {
    return fetch(url, options)
      .then((res) => {
        // For this project we are only taking the text output and responses with 2xx codes
        if (res.ok) {
          return res.text();
        }
        if (retries > 0) {
          return fetchRetry(url, options, retries - 1);
        }
        throw new Error(res.status);
      })
      .catch((error) => Logger.error(`FetchR Error: ${error.message}`));
  }
}
