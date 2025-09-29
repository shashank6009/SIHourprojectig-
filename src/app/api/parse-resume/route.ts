import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

// Ensure Node.js runtime for pdf-parse/mammoth
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('Server: API endpoint called');
    console.log('Server: Environment check - Node.js runtime:', typeof process !== 'undefined');
    console.log('Server: Current working directory:', process.cwd());
    
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      console.log('Server: No file uploaded');
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log('Server: File received:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      console.log('Server: File too large:', file.size);
      return NextResponse.json({ error: "File too large. Please upload a file smaller than 5MB." }, { status: 400 });
    }

    console.log('Server: Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Some browsers (esp. iOS/Safari) provide an empty type. Fallback to file extension.
    let contentType = file.type || "";
    const lowerName = (file.name || "").toLowerCase();
    if (!contentType || contentType === "application/octet-stream") {
      if (lowerName.endsWith(".pdf")) contentType = "application/pdf";
      else if (lowerName.endsWith(".docx")) contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      else if (lowerName.endsWith(".txt")) contentType = "text/plain";
    }

    console.log('Server: Detected content type:', contentType);

    let text = "";

    if (contentType.includes("pdf")) {
      try {
        console.log('Server: Parsing PDF...');
        console.log('Server: Attempting to import pdf-parse...');
        
        const pdfParse = (await import("pdf-parse")).default;
        console.log('Server: pdf-parse imported successfully');
        
        console.log('Server: Processing buffer of size:', buffer.length);
        const data = await pdfParse(buffer);
        text = data?.text || "";
        
        console.log('Server: PDF parsed successfully, text length:', text.length);
      } catch (pdfError: unknown) {
        console.error('Server: PDF parsing error:', pdfError);
        console.error('Server: Error details:', {
          message: pdfError instanceof Error ? pdfError.message : 'Unknown error',
          stack: pdfError instanceof Error ? pdfError.stack : 'No stack trace',
          type: typeof pdfError
        });
        
        // Provide more specific error messages
        let errorMessage = "Failed to process resume: ";
        if (pdfError instanceof Error) {
          if (pdfError.message.includes('Invalid PDF')) {
            errorMessage += "Invalid PDF format. Please ensure the file is a valid PDF.";
          } else if (pdfError.message.includes('encrypted')) {
            errorMessage += "PDF is password-protected. Please remove password protection and try again.";
          } else if (pdfError.message.includes('ENOENT')) {
            errorMessage += "PDF processing dependency issue. Please use the text paste option.";
          } else {
            errorMessage += "Failed to parse PDF. The file might be corrupted, password-protected, or in an unsupported format.";
          }
        } else {
          errorMessage += "Unknown PDF processing error.";
        }
        errorMessage += " Please use the text paste option.";
        
        return NextResponse.json({ error: errorMessage }, { status: 422 });
      }
    } else if (contentType.includes("wordprocessingml")) {
      try {
        console.log('Server: Parsing DOCX...');
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ buffer });
        text = result?.value || "";
        console.log('Server: DOCX parsed, text length:', text.length);
      } catch (docxError) {
        console.error('Server: DOCX parsing error:', docxError);
        return NextResponse.json({ error: "Failed to parse DOCX. The file might be corrupted." }, { status: 422 });
      }
    } else if (contentType === "text/plain") {
      text = buffer.toString("utf8");
      console.log('Server: Text file read, length:', text.length);
    } else {
      console.log('Server: Unsupported file type:', contentType);
      return NextResponse.json({ error: `Unsupported file type: ${contentType || 'unknown'}. Please upload PDF, DOCX, or TXT files.` }, { status: 415 });
    }

    if (!text || text.trim().length === 0) {
      console.log('Server: No text extracted from file');
      return NextResponse.json({ error: "The file appears to be empty or contains no readable text." }, { status: 422 });
    }

    // Clean up the text a bit
    text = text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\t/g, ' ') // Replace tabs with spaces
      .replace(/  +/g, ' ') // Replace multiple spaces with single space
      .trim();

    console.log('Server: Returning text, first 200 chars:', text.substring(0, 200));
    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error('Server: Unexpected error:', error);
    console.error('Server: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error while processing file" }, { status: 500 });
  }
}


