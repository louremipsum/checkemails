import { gmail_v1 } from "googleapis";
import { MessagePart } from "./types";
import { htmlToText } from "@/utils/htmlToText";
import { OpenAI } from "openai";
var he = require("he");

// Define the function specification for email classification
const tools = [
  {
    type: "function",
    function: {
      name: "classify_email",
      description: "Classify emails into categories",
      parameters: {
        type: "object",
        properties: {
          emails: {
            type: "array",
            description: "Array of emails to classify",
            items: {
              type: "object",
              properties: {
                index: {
                  type: "integer",
                  description: "The index of the email",
                },
                message: {
                  type: "string",
                  description: "The content of the email",
                },
              },
              required: ["index", "message"],
            },
          },
        },
        required: ["emails"],
      },
    },
  },
];

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

/**
 * Processes the plain text by removing URLs, CSS styles, class names, IDs, CSS rules, HTML tags,
 * unwanted characters, and normalizing whitespace.
 *
 * @param plainTextStr - The plain text string to be processed.
 * @returns The processed plain text string.
 */
const processPlainText = (plainTextStr: string): string => {
  let plainText = plainTextStr.replace(
    /((https?|ftp|mailto|tel|file|data|javascript):\/\/[^\s()<>]+|www\.[^\s()<>]+)(\([\w\d]+\)|([^[:punct:]\s]|\/?))?/gi,
    ""
  );

  // Remove CSS <style> blocks and their content
  plainText = plainText.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

  // Remove inline CSS styles
  plainText = plainText.replace(/style="[^"]*"/gi, "");

  // Remove class names and IDs
  plainText = plainText.replace(/class="[^"]*"/gi, "");
  plainText = plainText.replace(/id="[^"]*"/gi, "");

  // Remove any CSS rules
  plainText = plainText.replace(/{[^}]*}/g, "");

  // Remove any CSS selectors
  plainText = plainText.replace(/(\.[a-zA-Z0-9_-]+|#[a-zA-Z0-9_-]+)/g, "");

  // Remove HTML tags
  plainText = plainText.replace(/<\/?[^>]+(>|$)/g, "");

  // Remove unwanted characters except for alpahbets, number, brackets, ampersand, and periods
  plainText = plainText.replace(/[^a-zA-Z0-9\s&\.\(\)\[\]\{\}\-]+/g, "");

  // Normalize whitespace
  plainText = plainText.replace(/\s+/g, " ").trim();
  return plainText;
};

// Few-shot learning examples
const examples = [
  {
    index: 1,
    message:
      "FROM: vercel \n We charged $5.90 to your credit card ending in 2246 to fund and you need to immediately update your payment method.",
    category: "Important",
  },
  {
    index: 2,
    message:
      "FROM: zomato \nGet 20% off your next order with code SAVE20 at checkout. Limited time offer!",
    category: "Promotional",
  },
  {
    index: 3,
    message:
      "FROM: instagram \nYou've been tagged in a new photo on Instagram by Sarah.",
    category: "Social",
  },
  {
    index: 4,
    message:
      "FROM: technews \nSubscribe to our newsletter for the latest updates in tech and innovation.",
    category: "Marketing",
  },
  {
    index: 5,
    message:
      "FROM: cooldude \nYou've won a free vacation to the Bahamas! Click here to claim your prize.",
    category: "Spam",
  },
];

/**
 * Classifies the given email content into different categories.
 *
 * @param emailJSONData - An array of objects representing the email content. Each object should have properties `index` (number) and `message` (string).
 * @param openAI - An instance of the OpenAI client.
 * @returns A promise that resolves to an array of objects with properties `index` (number) and `category` (string), representing the classification results.
 */
const classifyEmail = async (
  emailJSONData: { index: number; message: string }[],
  openAI: OpenAI
): Promise<{ index: number; category: string }[]> => {
  const prompt = `
  Classify the following email content into one of the following categories: Important, Promotional, Social, Marketing, Spam, General.
  Here are the criteria for each category:
  - Important: Emails that are personal or work-related and require immediate attention.
  - Promotional: Emails related to sales, discounts, and marketing campaigns.
  - Social: Emails from social networks, friends, and family.
  - Marketing: Emails related to marketing, newsletters, and notifications.
  - Spam: Unwanted or unsolicited emails.
  - General: If none of the above are matched, use General.

  Return the result in a JSON format as an array of objects with the following structure: { "index": number, "category": string }.
  Examples:
${examples
  .map(
    (example) => `
Email content: "${example.message}"
Category: "${example.category}"`
  )
  .join("\n")}

Now, classify the following emails:

Emails: ${JSON.stringify(emailJSONData)}
  `;

  const completion = await openAI.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    temperature: 0.5,
    max_tokens: 3200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    messages: [
      {
        role: "system",
        content:
          "You are a expert assistant that classifies emails. The email starts with 'FROM' to indicate the email's sender and you should use that information along with the message to classify the email.\n Here are the criteria for each category:\n  - Important: Emails that are personal or work-related and require immediate attention.\n  - Promotional: Emails related to sales, discounts, and marketing campaigns.\n  - Social: Emails from social networks, friends, and family.\n  - Marketing: Emails related to marketing, newsletters, and notifications.\n  - Spam: Unwanted or unsolicited emails.\n  - General: If none of the above match, use General.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // Parse the JSON response
  const content = JSON.parse(completion.choices[0].message.content ?? "");
  const results: { index: number; category: string }[] = content?.results;

  return results ?? [];
};

/**
 * Process the email to clean them and Classifies the given emails using OpenAI API.
 *
 * @param emails - An array of email objects containing index, from, htmlText, and plainText properties.
 * @param OPENAI_API_KEY - The API key for accessing the OpenAI service.
 * @returns A promise that resolves to an array of classified emails.
 */
const ClassifyEmails = async (
  emails: {
    index: number;
    from: string;
    htmlText: string;
    plainText: string;
  }[],
  OPENAI_API_KEY: string
) => {
  const emailJSONData: { index: number; message: string }[] = [];
  emails.map((email) => {
    // Remove all types of links from plainText
    const plainText = processPlainText(email.plainText);
    const content = `FROM: ${email.from} \n ${plainText}  ${
      htmlToText(email.htmlText) ?? ""
    }`;
    emailJSONData.push({ index: email.index, message: content });
  });

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
  const classifiedEmails = await classifyEmail(emailJSONData, openai);
  return classifiedEmails;
};

export { processEmails, ClassifyEmails };
