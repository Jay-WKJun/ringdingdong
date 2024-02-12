export interface TextReplaceRule {
  domTagName: string;
  toCustomMarkLang(attributes: { [attrName: string]: string }, content: string): string;
  customMarkLangPattern: string | RegExp;
  toDom(...groups: string[]): string;
}

export type ConvertRules = { [key: string]: TextReplaceRule };
