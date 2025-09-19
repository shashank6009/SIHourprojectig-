import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log('Server: Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = file.type || "";

    let text = "";

    if (contentType === "application/pdf") {
      try {
        // Parse PDF using pdf-parse
        console.log('Server: Parsing PDF...');
        
        // Create a temporary workaround for the pdf-parse test file issue
        const fs = require('fs');
        const path = require('path');
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
    } else if (contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      try {
        // Parse DOCX using mammoth
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
      return NextResponse.json({ error: `Unsupported file type: ${contentType}. Please upload PDF, DOCX, or TXT files.` }, { status: 415 });
    }

    if (!text || text.trim().length === 0) {
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
    return NextResponse.json({ error: error?.message || "Server error while processing file" }, { status: 500 });
  }
}


