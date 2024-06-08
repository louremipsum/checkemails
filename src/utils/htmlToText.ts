import { convert } from "html-to-text";

export const htmlToText = (html: string) => {
  const options = {
    wordwrap: 130,
    tables: true,
    normalizeWhitespace: true,
    selectors: [
      { selector: "a", format: "skip" },
      { selector: "img", format: "skip" },
      {
        selector: "p",
        options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
      },
      {
        selector: "br",
        options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
      },
      {
        selector: "h1",
        options: {
          leadingLineBreaks: 1,
          trailingLineBreaks: 1,
          uppercase: true,
        },
      },
      {
        selector: "h2",
        options: {
          leadingLineBreaks: 1,
          trailingLineBreaks: 1,
          uppercase: true,
        },
      },
      {
        selector: "h3",
        options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
      },
      {
        selector: "h4",
        options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
      },
      {
        selector: "h5",
        options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
      },
      {
        selector: "h6",
        options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
      },
      {
        selector: "blockquote",
        options: {
          leadingLineBreaks: 1,
          trailingLineBreaks: 1,
          preserveIndentation: false,
        },
      },
      {
        selector: "hr",
        options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
      },
    ],
  };
  //   const compiledConvert = compile(options);

  let text = convert(html, options);
  // Replace all whitespace characters with a single space
  text = text.replace(/\s+/g, " ");
  // Remove unwanted characters
  text = text.replace(/[\u034F\u200B-\u200D\u2060\u180E\uFEFF]/g, "");
  // Remove non-printable and non-ASCII characters
  text = text.replace(/[^\x20-\x7E\u00A0-\u00FF]/g, "");
  // Trim leading and trailing whitespace
  text = text.trim();
  return text;
};
