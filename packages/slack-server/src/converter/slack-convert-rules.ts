import { ConvertRules } from ".";

// 사용자 지정 plugin의 모습
export const slackConvertRules: ConvertRules = {
  link: {
    domTagName: "a",
    customMarkLangPattern: /<(.*)\|(.*)>/g,
    toDom: (...groups) => `<a href="${groups[0]}">${groups[1]}</a>`,
    toCustomMarkLang: (attributes, content) => `<${attributes.href || ""}|${content}>`,
  },
  bold: {
    domTagName: "b",
    customMarkLangPattern: /\*(.*)\*/g,
    toDom: (...groups) => `<b>${groups[0]}</b>`,
    toCustomMarkLang: (_, content) => `*${content}*`,
  },
  italic: {
    domTagName: "i",
    customMarkLangPattern: /_(.*)_/g,
    toDom: (...groups) => `<i>${groups[0]}</i>`,
    toCustomMarkLang: (_, content) => `_${content}_`,
  },
  strike: {
    domTagName: "s",
    customMarkLangPattern: /~(.*)~/g,
    toDom: (...groups) => `<s>${groups[0]}</s>`,
    toCustomMarkLang: (_, content) => `~${content}~`,
  },
};
