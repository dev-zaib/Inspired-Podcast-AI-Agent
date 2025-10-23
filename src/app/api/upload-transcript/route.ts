// API route for uploading transcripts to OpenAI vector store
import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VECTOR_STORE_ID = "vs_68f7fad33e5c81919c8bc5822dccf428";

export async function POST(request: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith(".txt") && !file.type.includes("text")) {
      return NextResponse.json(
        { error: "Only text files are allowed" },
        { status: 400 }
      );
    }

    // Step 1: Upload file to OpenAI
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("purpose", "assistants");

    const uploadResponse = await fetch("https://api.openai.com/v1/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("File upload error:", errorText);
      return NextResponse.json(
        { error: `Failed to upload file: ${errorText}` },
        { status: uploadResponse.status }
      );
    }

    const uploadData = await uploadResponse.json();
    const fileId = uploadData.id;

    console.log("File uploaded successfully:", fileId);

    // Step 2: Add file to vector store
    const addToVectorStoreResponse = await fetch(
      `https://api.openai.com/v1/vector_stores/${VECTOR_STORE_ID}/files`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2",
        },
        body: JSON.stringify({
          file_id: fileId,
        }),
      }
    );

    if (!addToVectorStoreResponse.ok) {
      const errorText = await addToVectorStoreResponse.text();
      console.error("Vector store add error:", errorText);
      return NextResponse.json(
        { error: `Failed to add file to vector store: ${errorText}` },
        { status: addToVectorStoreResponse.status }
      );
    }

    const vectorStoreData = await addToVectorStoreResponse.json();
    console.log("File added to vector store:", vectorStoreData);

    return NextResponse.json({
      success: true,
      fileId: fileId,
      fileName: file.name,
      vectorStoreFile: vectorStoreData,
      message: "Transcript uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload transcript" },
      { status: 500 }
    );
  }
}
