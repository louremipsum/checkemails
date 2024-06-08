import { gmail_v1 } from "googleapis";
import { MessageDataType } from "./types";
var he = require("he");

/**
 * Decodes a base64 encoded string.
 *
 * @param encodedStr - The base64 encoded string to decode.
 * @returns The decoded string.
 */
function decodeBase64(encodedStr: string): string {
  const decodedStr = atob(encodedStr.replace(/-/g, "+").replace(/_/g, "/"));
  return decodeURIComponent(escape(decodedStr));
}

/**
 * Retrieves the plain text and HTML text from a Gmail message payload.
 *
 * @param payload - The Gmail message payload.
 * @returns An object containing the plain text and HTML text.
 */
function getBody(payload?: gmail_v1.Schema$MessagePart): {
  plainText: string;
  htmlText: string;
} {
  let plainText = "";
  let htmlText = "";

  if (!payload) {
    return { plainText, htmlText };
  }

  const mimeType = payload.mimeType || "";
  const bodyData = payload.body?.data || "";
  const parts = payload.parts || [];

  if (mimeType === "text/plain") {
    plainText = decodeBase64(bodyData);
  } else if (mimeType === "text/html") {
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
}

/**
 * Processes email data and extracts relevant information.
 * @param messageData - The data of the email message.
 * @returns An object containing the extracted information from the email.
 */
const processEmails = (messageData: MessageDataType) => {
  const fromHeader = messageData.payload?.headers?.find(
    (header: { name: string }) => header.name === "From"
  );
  const from = fromHeader ? fromHeader.value.split("<")[0] : "Unknown";
  const snippet = he.decode(messageData.snippet) || "";
  const { plainText, htmlText } = getBody(messageData.payload);

  return { from, snippet, plainText, htmlText };
};

export { processEmails };
