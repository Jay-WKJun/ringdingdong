import { mapObjectValues } from "../utils/object";

import { HTMLTagParser } from "./html-tag-parser";
import { slackConvertRules } from "./slack-convert-rules";
import type { TextReplaceRule, ConvertRules } from "./types";

// 하나의 규칙에 대한 converter
class Converter {
  domParser: HTMLTagParser;

  convertToDom: (customMarkString: string) => string = () => "";

  convertToCustomMarkLang: (domString: string) => string = () => "";

  constructor(rule: TextReplaceRule) {
    this.domParser = new HTMLTagParser(rule.domTagName);

    this.convertToCustomMarkLang = (domString: string) => {
      let customMarkString = domString;
      const matchedTagInfos = this.domParser.getMatchedTags(domString);
      console.log("matchedTagInfos", this.domParser.domRegex, matchedTagInfos);
      matchedTagInfos?.forEach(({ matchedString, content, attributes }) => {
        customMarkString = customMarkString.replace(matchedString, rule.toCustomMarkLang(attributes, content));
      });
      console.log("customMarkString", customMarkString);
      return customMarkString;
    };

    this.convertToDom = (customMarkString: string) => {
      const newString = customMarkString.replace(new RegExp(rule.customMarkLangPattern, "g"), (_, ...groups) =>
        rule.toDom(...groups),
      );
      return newString;
    };
  }
}

export function getConverters(convertRules: ConvertRules = slackConvertRules) {
  const _converters = mapObjectValues(convertRules, (value) => new Converter(value));
  const converters = Object.values(_converters);
  return {
    convertToDomString: (customMarkLang: string) =>
      converters.reduce((prev, converter) => converter.convertToDom(prev), customMarkLang),
    convertToCustomMarkLang: (domString: string) =>
      converters.reduce((prev, converter) => converter.convertToCustomMarkLang(prev), domString),
  };
}
