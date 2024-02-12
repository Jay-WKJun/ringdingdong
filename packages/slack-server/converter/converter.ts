import { HTMLTagParser } from "../../html-tag-parser";
import { mapObjectValues } from "../../utils/object";

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
      matchedTagInfos?.forEach(({ matchedString, content, attributes }) => {
        customMarkString = customMarkString.replace(matchedString, rule.toCustomMarkLang(attributes, content));
      });

      return customMarkString;
    };

    this.convertToDom = (customMarkString: string) =>
      customMarkString.replace(new RegExp(rule.customMarkLangPattern, "g"), (_, ...groups) => rule.toDom(...groups));
  }
}

export function getConverters(convertRules: ConvertRules) {
  const _converters = mapObjectValues(convertRules, (value) => new Converter(value));
  const converters = Object.values(_converters);
  return {
    convertToDomString: (customMarkLang: string) =>
      converters.reduce((prev, converter) => converter.convertToDom(prev), customMarkLang),
    convertToCustomMarkLang: (domString: string) =>
      converters.reduce((prev, converter) => converter.convertToCustomMarkLang(prev), domString),
  };
}
