import { ClassifyEmails } from "@/app/action";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response("Bad Format", { status: 401 });
    }
    if (!request.body) {
      return new Response("Bad Request", { status: 400 });
    }
    const apiKey = authHeader.slice(7);
    const data = await request.json();
    const classifiedEmails = await ClassifyEmails(data, apiKey);
    return Response.json({ classifiedEmails: classifiedEmails });
  } catch (e) {
    console.error("ERROR->\n", e);
    return new Response("Error", { status: 500 });
  }
}
