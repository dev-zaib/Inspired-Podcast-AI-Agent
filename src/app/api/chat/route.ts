// Server-side API route - keeps JWT token secret
import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL; // No NEXT_PUBLIC_ prefix
const JWT_TOKEN = process.env.JWT_TOKEN; // No NEXT_PUBLIC_ prefix

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const message = searchParams.get("message");
  const sessionId = searchParams.get("sessionId");

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${N8N_WEBHOOK_URL}?message=${encodeURIComponent(
        message
      )}&sessionId=${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "N8N Response Error:",
        response.status,
        response.statusText,
        errorText
      );

      if (response.status === 404) {
        return NextResponse.json(
          {
            error:
              "Webhook URL not found. Please check your n8n workflow is active and the URL is correct.",
          },
          { status: 404 }
        );
      }

      if (response.status === 401 || errorText.includes("invalid signature")) {
        return NextResponse.json(
          {
            error:
              "JWT authentication failed. Please check your token matches the n8n secret.",
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: `N8N API error (${response.status}): ${errorText}` },
        { status: response.status }
      );
    }

    // Try to parse as JSON, fallback to text
    const contentType = response.headers.get("content-type");
    let data;

    try {
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log("N8N Response (text):", text);

        // If it's plain text, wrap it in a JSON structure
        data = { output: text, sessionId: sessionId };
      }
    } catch (parseError) {
      console.error("Error parsing N8N response:", parseError);
      const text = await response.text();
      data = { output: text || "No response from AI", sessionId: sessionId };
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("N8N API Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Handle POST requests if needed
  return GET(request);
}
