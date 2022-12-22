import fs from "fs";
import path from "path";
import FetchR from "./fetchR.mjs";
import RegexUtils from "./regex.mjs";

export default class FileUtils {
  /**
   * [saveAssetFile static method used to save site's assets in appropriate folder]
   * @param  {[URL]} url [the URL to be used for defining where to save the assets to]
   * @param  {[string]} fullPath [the full path of the asset i.e. src="<fullPath>"]
   */
  static async saveAssetFile(url, fullPath) {
    // Only considering relative paths i.e. /assets/test.png
    if (fullPath && !RegexUtils.doesUrlHaveProtocol(fullPath)) {
      const fileName = path.basename(fullPath);

      // Catering for relative paths not starting with "/" i.e. assets/test.png
      const relativePath =
        (fullPath.startsWith("/") ? "" : "/") + fullPath.replace(fileName, "");
      const { protocol, hostname } = url;
      const fileURL = `${hostname}${relativePath}${fileName}`;
      const fullURL = `${protocol}//${fileURL}`;

      // Checking if file exists, if it does not, creates the directory to it
      if (!fs.existsSync(fileURL)) {
        fs.mkdirSync(`${hostname}${relativePath}`, { recursive: true });
      }

      // Fetch the relative asset remotely and save to file
      const asset = await FetchR.fetchRetry(fullURL);
      fs.writeFileSync(fileURL, asset);
    }
  }
}
