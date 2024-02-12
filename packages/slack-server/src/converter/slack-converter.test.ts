// make some test for me
import { getConverters } from ".";

describe("getConverters", () => {
  let slackConverter = getConverters();
  beforeEach(() => {
    slackConverter = getConverters();
  });

  test("bold", () => {
    expect(slackConverter.convertToDomString(`*Hello world!*`)).toEqual(`<b>Hello world!</b>`);
  });

  test("italic", () => {
    expect(slackConverter.convertToDomString(`_Hello world!_`)).toEqual(`<i>Hello world!</i>`);
  });

  test("link", () => {
    expect(slackConverter.convertToDomString(`<https://test.com|Hello world!>`)).toEqual(
      `<a href="https://test.com">Hello world!</a>`,
    );
  });

  test("strike", () => {
    expect(slackConverter.convertToDomString(`~Hello world!~`)).toEqual(`<s>Hello world!</s>`);
  });

  test("convertToDomString should return the same string when no matching tags found", () => {
    const htmlString = "Some content";
    expect(slackConverter.convertToDomString(htmlString)).toEqual(htmlString);
  });

  test("convertToDomString should handle multiple matching tags", () => {
    const htmlString = `*Hello world!* _Hello world!_ <https://test.com|Hello world!> ~Hello world!~`;
    const expectedString = `<b>Hello world!</b> <i>Hello world!</i> <a href="https://test.com">Hello world!</a> <s>Hello world!</s>`;
    expect(slackConverter.convertToDomString(htmlString)).toEqual(expectedString);
  });

  test("convertToDomString should handle multiple matching tags in a single tag", () => {
    const htmlString = `*Hello _world_!*`;
    const expectedString = `<b>Hello <i>world</i>!</b>`;
    expect(slackConverter.convertToDomString(htmlString)).toEqual(expectedString);
  });

  test("convertToDomString should handle multiple matching tags in a single tag", () => {
    const htmlString = `*Hello _wo~rl~d_!*`;
    const expectedString = `<b>Hello <i>wo<s>rl</s>d</i>!</b>`;
    expect(slackConverter.convertToDomString(htmlString)).toEqual(expectedString);
  });

  test("convertToCustomMarkLang should return the same string when no matching tags found", () => {
    const htmlString = "Some content";
    expect(slackConverter.convertToCustomMarkLang(htmlString)).toEqual(htmlString);
  });

  test("convertToCustomMarkLang should handle multiple matching tags", () => {
    const htmlString = `<b>Hello world!</b> <i>Hello world!</i> <a href="https://test.com">Hello world!</a> <s>Hello world!</s>`;
    const expectedString = `*Hello world!* _Hello world!_ <https://test.com|Hello world!> ~Hello world!~`;
    expect(slackConverter.convertToCustomMarkLang(htmlString)).toEqual(expectedString);
  });

  test("convertToCustomMarkLang should handle multiple matching tags in a single tag", () => {
    const htmlString = `<b>Hello <i>world</i>!</b>`;
    const expectedString = `*Hello _world_!*`;
    expect(slackConverter.convertToCustomMarkLang(htmlString)).toEqual(expectedString);
  });

  test("convertToCustomMarkLang should handle multiple matching tags in a single tag", () => {
    const htmlString = `<b>Hello <i>wo<s>rl</s>d</i>!</b>`;
    const expectedString = `*Hello _wo~rl~d_!*`;
    expect(slackConverter.convertToCustomMarkLang(htmlString)).toEqual(expectedString);
  });
});
