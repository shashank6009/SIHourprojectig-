import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

// Ensure Node.js runtime for pdf-parse/mammoth
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('Server: API endpoint called');
    
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
        
        // Create a temporary workaround for the pdf-parse test file issue
        const testFilePath = path.join(process.cwd(), './test/data/05-versions-space.pdf');
        const testDir = path.dirname(testFilePath);
        
        // Create the directory and dummy file if they don't exist
        if (!fs.existsSync(testDir)) {
          fs.mkdirSync(testDir, { recursive: true });
        }
        if (!fs.existsSync(testFilePath)) {
          fs.writeFileSync(testFilePath, 'dummy');
        }
        
        const pdfParse = (await import("pdf-parse")).default;
        const data = await pdfParse(buffer);
        text = data?.text || "";
        
        // Clean up the dummy file
        try {
          fs.unlinkSync(testFilePath);
          if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
          }
        } catch (e) {
          // Ignore cleanup errors
        }
        
        console.log('Server: PDF parsed, text length:', text.length);
      } catch (pdfError: any) {
        console.error('Server: PDF parsing error:', pdfError);
        // Check if it's the test file error and provide a better message
        if (pdfError.message?.includes('ENOENT') && pdfError.message?.includes('05-versions-space.pdf')) {
          return NextResponse.json({ 
            error: "PDF processing is temporarily unavailable. Please use the 'Paste Resume Text' option instead." 
          }, { status: 422 });
        }
        return NextResponse.json({ 
          error: "Failed to parse PDF. The file might be corrupted, password-protected, or in an unsupported format. Please try the text paste option." 
        }, { status: 422 });
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
  } catch (error: any) {
    console.error('Server: Unexpected error:', error);
    console.error('Server: Error stack:', error?.stack);
    return NextResponse.json({ error: error?.message || "Server error while processing file" }, { status: 500 });
  }
}


