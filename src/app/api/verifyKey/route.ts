import type { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Bad Format", { status: 401 });
  }
  const apiKey = authHeader.slice(7);
  const client = new OpenAI({ apiKey });

  try {
    await client.models.list();
    return new Response("Valid API Key", { status: 200 });
  } catch (error) {
    return new Response("Invalid API Key", { status: 401 });
  }
}
