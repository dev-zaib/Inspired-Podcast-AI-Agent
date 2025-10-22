// Server-side API route - uses OpenAI Responses API
import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_PROMPT_ID = process.env.OPENAI_PROMPT_ID;
const OPENAI_PROMPT_VERSION = process.env.OPENAI_PROMPT_VERSION;

interface OpenAIResponseData {
  id: string;
  object: string;
  created_at: number;
  status: string;
  error: null | {
    code?: string;
    message?: string;
    type?: string;
  };
  output: Array<{
    id: string;
    type: string;
    status: string;
    content: Array<{
      type: string;
      text: string;
    }>;
    role: string;
  }>;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const message = searchParams.get("message");
  const sessionId = searchParams.get("sessionId");
  const previousResponseId = searchParams.get("previousResponseId");

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Prepare the request body
    const requestBody: Record<string, unknown> = {
      prompt: {
        id: OPENAI_PROMPT_ID,
        version: OPENAI_PROMPT_VERSION,
      },
      // Add the user message as input (not instructions)
      input: [
        {
          type: "message",
          content: [
            {
              type: "input_text",
              text: message,
            },
          ],
          role: "user",
        },
      ],
    };

    // If this is a follow-up message, reference the previous response
    if (previousResponseId) {
      requestBody.previous_response_id = previousResponseId;
    }

    const createResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error(
        "OpenAI Create Response Error:",
        createResponse.status,
        createResponse.statusText,
        errorText
      );

      if (createResponse.status === 401) {
        return NextResponse.json(
          { error: "Invalid OpenAI API key" },
          { status: 401 }
        );
      }

      if (createResponse.status === 404) {
        return NextResponse.json(
          {
            error: "OpenAI prompt not found. Check your prompt ID and version.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: `OpenAI API error (${createResponse.status}): ${errorText}` },
        { status: createResponse.status }
      );
    }

    const responseData: OpenAIResponseData = await createResponse.json();
    console.log("OpenAI Response:", JSON.stringify(responseData, null, 2));

    // Check if the response has an error
    if (responseData.error) {
      console.error("OpenAI Response Error:", responseData.error);
      return NextResponse.json(
        {
          error:
            "OpenAI returned an error: " + JSON.stringify(responseData.error),
        },
        { status: 500 }
      );
    }

    // Extract the response text from the outputs array.
    // Some responses include tool calls (e.g. file_search_call) before the assistant message,
    // so scan all outputs and return the first available output_text.
    let responseText = "I'm sorry, I couldn't generate a response.";

    if (responseData.output && responseData.output.length > 0) {
      for (const out of responseData.output) {
        if (!out || !out.content || out.content.length === 0) continue;

        const textContent = out.content.find(
          (content) => content.type === "output_text"
        );
        if (
          textContent &&
          typeof textContent.text === "string" &&
          textContent.text.trim().length > 0
        ) {
          responseText = textContent.text;
          break;
        }
      }
    }

    return NextResponse.json({
      output: responseText,
      sessionId: sessionId,
      responseId: responseData.id,
      status: responseData.status,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to process request with OpenAI" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Handle POST requests if needed
  return GET(request);
}
