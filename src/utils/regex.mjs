class RegexUtils {
  // Opted for separation of concern with regex matchers
  static get HTML_IMG_REGEX() {
    return /<img\s[^>]*?src\s*=\s*['\"]([^'\"]*?)['\"][^>]*?>/gi;
  }

  static get HTML_A_TAG_REGEX() {
    return /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi;
  }

  static get HTML_IMG_SRC_REGEX() {
    return /<img\s+(?:[^>]*?\s+)?src="([^"]*)"/gi;
  }

  static get URL_PROTOCOL_REGEX() {
    return /^[a-z0-9]+:/gi;
  }

  static getTotalImgTagMatches(html) {
    return (html.match(this.HTML_IMG_REGEX) || []).length;
  }

  static getTotalATagMatches(html) {
    return (html.match(this.HTML_A_TAG_REGEX) || []).length;
  }

  static doesUrlHaveProtocol(html) {
    return this.URL_PROTOCOL_REGEX.test(html);
  }

  static extractMatchedImgTagSrcAttributeValues(html) {
    let allMatchedImgTagSrcAttributeValues = html.matchAll(
      RegexUtils.HTML_IMG_SRC_REGEX
    );
    const srcValues = Array.from(allMatchedImgTagSrcAttributeValues).reduce(
      (acc, match) => {
        const [, src] = match;
        return [...acc, src];
      },
      []
    );
    return srcValues;
  }
}

export default RegexUtils;
