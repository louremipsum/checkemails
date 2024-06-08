import { gmail_v1 } from "googleapis";
import { MessagePart } from "./types";
var he = require("he");

/**
 * Decodes a base64 encoded string.
 *
 * @param encodedStr - The base64 encoded string to decode.
 * @returns The decoded string.
 */
const decodeBase64 = (encodedStr: string): string => {
  const decodedStr = atob(encodedStr.replace(/-/g, "+").replace(/_/g, "/"));
  return decodeURIComponent(escape(decodedStr));
};

/**
 * Retrieves the plain text and HTML text from a given payload.
 *
 * @param payload - The message part or message part schema.
 * @returns An object containing the plain text and HTML text.
 */
const getBody = (
  payload?: MessagePart | gmail_v1.Schema$MessagePart
): { plainText: string; htmlText: string } => {
  let plainText = "";
  let htmlText = "";

  if (!payload) {
    return { plainText, htmlText };
  }

  const mimeType = payload.mimeType || "";
  const bodyData = payload.body?.data || "";
  const parts = payload.parts || [];

  if (mimeType === "text/plain" && bodyData) {
    plainText = decodeBase64(bodyData);
  } else if (mimeType === "text/html" && bodyData) {
    htmlText = decodeBase64(bodyData);
  } else if (mimeType.startsWith("multipart/")) {
    parts.forEach((part) => {
      const partBody = getBody(part);
      if (partBody.plainText) {
        plainText += partBody.plainText;
      }
      if (partBody.htmlText) {
        htmlText += partBody.htmlText;
      }
    });
  }

  return { plainText, htmlText };
};

/**
 * Processes the email message data and extracts relevant information.
 *
 * @param messageData - The email message data to process.
 * @returns An object containing the extracted information from the email message.
 */
const processEmails = (
  messageData: gmail_v1.Schema$Message
): { from: string; snippet: string; plainText: string; htmlText: string } => {
  const headers = messageData.payload?.headers || [];
  const fromHeader = headers.find((header) => header.name === "From");
  let from = fromHeader?.value || "Unknown";
  from = from.split("<")[0];
  const snippet = he.decode(messageData.snippet) || "";
  const { plainText, htmlText } = getBody(messageData.payload);

  return { from, snippet, plainText, htmlText };
};

export { processEmails };
