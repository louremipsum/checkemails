import { processEmails } from "@/app/action";
import { emailDetailsType, Label } from "@/app/types";
import { NextRequest } from "next/server";

type messageType = {
  id: string;
  threadId: string;
};

type dataType = {
  messages: messageType[];
};

const fetchRecentEmails = async (accessToken: string, maxResults: number) => {
  const resp = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`,
    {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
      }),
    }
  );

  const data: dataType = await resp.json();

  if (!data) {
    throw new Error("Data not fetched");
  }

  // Taking each id from /messages and then fetching the individual details of each messgage
  // and then process them
  const emailDetailsPromises = data.messages.map(
    async (message: messageType, index) => {
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`,
        {
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${accessToken}`,
          }),
        }
      );
      const messageData = await response.json();

      const { from, snippet, plainText, htmlText } = processEmails(messageData);
      const emailDetail = {
        index,
        from,
        snippet,
        plainText,
        htmlText,
        category: Label.General,
      };
      return emailDetail;
    }
  );

  const emailDetails: emailDetailsType[] =
    (await Promise.all(emailDetailsPromises)) ?? [];
  return emailDetails;
};

export async function GET(request: NextRequest) {
  const cookie0 = request.cookies.get("accessToken");
  const accessToken = cookie0?.value;
  try {
    const { searchParams } = new URL(request.url);
    const maxResults = searchParams.get("maxResults");

    if (!accessToken || !maxResults) {
      console.error("Invalid params");
      return new Response("Invalid parameters", { status: 400 });
    }

    const emails = await fetchRecentEmails(accessToken, parseInt(maxResults));
    return Response.json({ emails: emails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return new Response("Failed to fetch emails", { status: 500 });
  }
}
