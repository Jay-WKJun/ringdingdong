import { HTMLTagParser, MatchedTagInfo } from "./html-tag-parser";

describe("HTMLTagParser", () => {
  let parser: HTMLTagParser;

  beforeEach(() => {
    parser = new HTMLTagParser("a");
  });

  test("getMatchedTags should return null for empty input string", () => {
    const htmlString = "";
    expect(parser.getMatchedTags(htmlString)).toBeNull();
  });

  test("getMatchedTags should return null when no matching tags found", () => {
    const htmlString = "<div>Some content</div>";
    expect(parser.getMatchedTags(htmlString)).toBeNull();
  });

  test("getMatchedTags should return an array of MatchedTagInfo objects", () => {
    const htmlString = '<a href="https://example.com">Link</a>';
    const expectedTags: MatchedTagInfo[] = [
      {
        matchedString: '<a href="https://example.com">Link</a>',
        tagName: "a",
        attributes: { href: "https://example.com" },
        content: "Link",
      },
    ];
    expect(parser.getMatchedTags(htmlString)).toEqual(expectedTags);
  });

  test("getMatchedTags should handle multiple matching tags", () => {
    const htmlString =
      '<a href="https://example.com">Link 1</a><a href="https://example.org">Link 2</a>';
    const expectedTags: MatchedTagInfo[] = [
      {
        matchedString: '<a href="https://example.com">Link 1</a>',
        tagName: "a",
        attributes: { href: "https://example.com" },
        content: "Link 1",
      },
      {
        matchedString: '<a href="https://example.org">Link 2</a>',
        tagName: "a",
        attributes: { href: "https://example.org" },
        content: "Link 2",
      },
    ];

    expect(parser.getMatchedTags(htmlString)).toEqual(expectedTags);
  });
});
