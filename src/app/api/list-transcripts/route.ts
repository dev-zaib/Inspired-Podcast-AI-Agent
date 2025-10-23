// API route for listing files in the vector store
import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VECTOR_STORE_ID = "vs_68f7fad33e5c81919c8bc5822dccf428";

export async function GET(request: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "100"; // Default to 100 files per page
    const after = searchParams.get("after"); // Cursor for pagination

    // Build URL with pagination parameters
    let url = `https://api.openai.com/v1/vector_stores/${VECTOR_STORE_ID}/files?limit=${limit}`;
    if (after) {
      url += `&after=${after}`;
    }

    // Get list of files in vector store
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("List files error:", errorText);
      return NextResponse.json(
        { error: `Failed to list files: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Get detailed info for each file
    const filesWithDetails = await Promise.all(
      data.data.map(async (vectorStoreFile: { id: string; status: string; created_at: number }) => {
        try {
          // Get file details from OpenAI files API
          const fileDetailsResponse = await fetch(
            `https://api.openai.com/v1/files/${vectorStoreFile.id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
              },
            }
          );

          if (fileDetailsResponse.ok) {
            const fileDetails = await fileDetailsResponse.json();
            return {
              ...vectorStoreFile,
              filename: fileDetails.filename || "Unknown",
              bytes: fileDetails.bytes || 0,
            };
          }
        } catch (error) {
          console.error("Error fetching file details:", error);
        }

        return {
          ...vectorStoreFile,
          filename: "Unknown",
          bytes: 0,
        };
      })
    );

    return NextResponse.json({
      files: filesWithDetails,
      has_more: data.has_more || false,
      last_id: data.last_id || null,
    });
  } catch (error) {
    console.error("List files error:", error);
    return NextResponse.json(
      { error: "Failed to list transcripts" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Remove file from vector store
    const response = await fetch(
      `https://api.openai.com/v1/vector_stores/${VECTOR_STORE_ID}/files/${fileId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Delete file error:", errorText);
      return NextResponse.json(
        { error: `Failed to delete file: ${errorText}` },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete transcript" },
      { status: 500 }
    );
  }
}
