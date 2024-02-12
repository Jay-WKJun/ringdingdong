export interface MatchedTagInfo {
  matchedString: string;
  tagName: string;
  attributes: { [attrName: string]: string };
  content: string;
}

export class HTMLTagParser {
  domRegex: RegExp;

  tagName: string;

  constructor(tagName: string) {
    this.tagName = tagName;
    this.domRegex = new RegExp(`<${tagName}\s*(.*?)>(.*?)<\/${tagName}>`, "g");
  }

  getMatchedTags(htmlString: string): MatchedTagInfo[] | null {
    const matchRes = this.domRegex.exec(htmlString);
    if (!matchRes) return null;

    const matchedTags: MatchedTagInfo[] = [];
    let match: RegExpExecArray | null = matchRes;
    do {
      const matchedString = match[0] || "";
      const attributesString = match[1];
      const content = match[2] || "";

      const attributes: { [key: string]: string } = {};
      attributesString
        ?.trim()
        .split(/\s+/)
        .forEach((attribute) => {
          const parts = attribute.split("=");
          const key = parts[0]?.trim() || "";
          const value = parts[1] ? parts[1].trim().replace(/["']/g, "") : "";
          attributes[key] = value;
        });

      matchedTags.push({ matchedString, tagName: this.tagName, attributes, content });
    } while ((match = this.domRegex.exec(htmlString)) !== null);

    return matchedTags;
  }
}
