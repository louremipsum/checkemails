import { gmail_v1 } from "googleapis";
import { MessagePart } from "./types";
import { htmlToText } from "@/utils/htmlToText";
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { JsonOutputParser } from "@langchain/core/output_parsers";

import { PromptTemplate, FewShotPromptTemplate } from "@langchain/core/prompts";

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
    message:
      "FROM: vercel \n We charged $5.90 to your credit card ending in 2246 to fund and you need to immediately update your payment method.",
    category: "Important",
  },
  {
    message:
      "FROM: zomato \nGet 20% off your next order with code SAVE20 at checkout. Limited time offer!",
    category: "Promotional",
  },
  {
    message:
      "FROM: instagram \nYou've been tagged in a new photo on Instagram by Sarah.",
    category: "Social",
  },
  {
    message:
      "FROM: technews \nSubscribe to our newsletter for the latest updates in tech and innovation.",
    category: "Marketing",
  },
  {
    message:
      "FROM: cooldude \nYou've won a free vacation to the Bahamas! Click here to claim your prize.",
    category: "Spam",
  },
];

interface OutputParsed {
  index: number;
  message: string;
}

/**
 * Classifies the given email JSON data into categories using Langchain.
 * @param emailJSONData - The email JSON data to be classified.
 * @param model - The ChatOpenAI model from Langchain used for classification.
 * @returns A promise that resolves to an array of classified email objects.
 */
const classifyEmail = async (
  emailJSONData: OutputParsed[],
  model: ChatOpenAI<ChatOpenAICallOptions>
): Promise<OutputParsed[]> => {
  const examplePrompt = PromptTemplate.fromTemplate(
    "Email content: {message}\nCategory: {category}"
  );

  const fewShotPrompt = new FewShotPromptTemplate({
    examples,
    examplePrompt: examplePrompt,
    inputVariables: ["emailJSONData"],
    exampleSeparator: "\n\n",
    prefix: `Classify the following email content into one of the following categories: Important, Promotional, Social, Marketing, Spam, General.
Here are the criteria for each category:
- Important: Emails that are personal or work-related and require immediate attention.
- Promotional: Emails related to sales, discounts, and marketing campaigns.
- Social: Emails from social networks, friends, and family.
- Marketing: Emails related to marketing, newsletters, and notifications.
- Spam: Unwanted or unsolicited emails.
- General: If none of the above are matched, use General.
Respond with a valid JSON format as an array of objects with each object containing the keys 'index' (the position of the email in the input array) and 'category'.

Here are some examples:`,
    suffix: "\nNow, classify the following emails:\nEmails: [{emailJSONData}]",
  });

  // Format the prompt with the emailJSONData
  const formattedEmailData = emailJSONData.map((email, index) => ({
    index,
    message: email.message,
  }));

  const prompt = await fewShotPrompt.format({
    emailJSONData: formattedEmailData
      .map(
        (email) =>
          `{"index": ${email.index}, "message": "${email.message
            .replace(/\n/g, "\\n")
            .replace(/"/g, '\\"')}"}`
      )
      .join(", "),
  });

  const messages = [
    new SystemMessage(
      "You are an expert assistant that classifies emails. The email starts with 'FROM' to indicate the email's sender and you should use that information along with the message to classify the email."
    ),
    new HumanMessage(prompt),
  ];

  const parser = new JsonOutputParser<OutputParsed[]>();
  const ans = await model.invoke(messages);
  const result = await parser.invoke(ans);
  return result ?? [];
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
  const emailJSONData: OutputParsed[] = [];
  emails.map((email) => {
    // Remove all types of links from plainText
    const plainText = processPlainText(email.plainText);
    const content = `Email content: FROM: ${email.from} \n ${plainText}  ${
      htmlToText(email.htmlText) ?? ""
    }`;
    emailJSONData.push({ index: email.index, message: content });
  });

  // const openai = new OpenAI({
  //   apiKey: OPENAI_API_KEY,
  // });
  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
    apiKey: OPENAI_API_KEY,
  });
  const classifiedEmails = await classifyEmail(emailJSONData, model);
  return classifiedEmails;
};

export { processEmails, ClassifyEmails };
