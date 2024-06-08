import { processEmails } from "@/app/action";
import { emailDetailsType, Label } from "@/app/types";
import { NextRequest } from "next/server";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const fetchRecentEmails = async (
  auth: OAuth2Client,
  maxResults: number
): Promise<emailDetailsType[]> => {
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults,
  });
  const messageIds = response.data.messages?.map((msg) => msg.id) || [];

  const emailDetailsPromises = messageIds.map(async (messageId, index) => {
    if (messageId) {
      const message = await gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full",
      });
      const { from, snippet, plainText, htmlText } = processEmails(
        message.data
      );
      const emailDetail: emailDetailsType = {
        index,
        from,
        snippet,
        plainText,
        htmlText,
        category: Label.Nothing,
      };
      return emailDetail;
    }
    return null;
  });

  const emailDetails = (await Promise.all(emailDetailsPromises)).filter(
    (detail) => detail !== null
  ) as emailDetailsType[];
  return emailDetails;
};

export async function GET(request: NextRequest) {
  const cookie0 = request.cookies.get("accessToken");
  const cookie1 = request.cookies.get("refreshToken");
  const accessToken = cookie0?.value;
  const refreshToken = cookie1?.value;
  try {
    const { searchParams } = new URL(request.url);
    const maxResults = searchParams.get("maxResults");

    if (!accessToken || !maxResults) {
      return new Response("Invalid parameters", { status: 400 });
    }
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_API_KEY,
      process.env.GOOGLE_REDIRECT_URIS
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    const emails = await fetchRecentEmails(oauth2Client, parseInt(maxResults));
    return Response.json({ emails: emails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return new Response("Failed to fetch emails", { status: 500 });
  }
}
