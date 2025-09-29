import { NextResponse } from "next/server";

// Ensure Node.js runtime for pdf-parse/mammoth (required for Buffer operations)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120; // Maximum timeout for complex PDFs

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
        
        // BULLETPROOF pdf-parse loading with multiple attempts
        let pdfParse;
        let importAttempts = 0;
        const maxImportAttempts = 3;
        
        while (importAttempts < maxImportAttempts) {
          try {
            importAttempts++;
            console.log(`Server: pdf-parse import attempt ${importAttempts}...`);
            
            const pdfParseModule = await import("pdf-parse");
            pdfParse = pdfParseModule.default || pdfParseModule;
            
            // Verify the function is callable
            if (typeof pdfParse !== 'function') {
              throw new Error('pdf-parse is not a function');
            }
            
            console.log('Server: pdf-parse module loaded and verified successfully');
            break;
            
          } catch (importError) {
            console.error(`Server: pdf-parse import attempt ${importAttempts} failed:`, importError);
            
            if (importAttempts >= maxImportAttempts) {
              console.error('Server: All pdf-parse import attempts failed');
              throw new Error('PDF parsing library cannot be loaded in this environment - please use text paste option');
            }
            
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        // Validate buffer before parsing
        if (!buffer || buffer.length === 0) {
          throw new Error('Empty or invalid PDF buffer');
        }
        
        console.log('Server: Buffer size:', buffer.length, 'bytes');
        
        // Try multiple parsing approaches for better reliability
        let data;
        
        // First attempt: Standard parsing
        try {
          console.log('Server: Attempting standard PDF parsing...');
          const options = {
            max: 0, // No page limit
          };
          data = await pdfParse(buffer, options);
        } catch (standardError) {
          console.log('Server: Standard parsing failed, trying alternative approach...');
          
          // Second attempt: Simple parsing without options
          try {
            data = await pdfParse(buffer);
          } catch (simpleError) {
            console.log('Server: Simple parsing also failed');
            throw standardError; // Throw the original error
          }
        }
        
        text = data?.text || "";
        console.log('Server: PDF parsed successfully, text length:', text.length);
        
        // Validate extracted text
        if (!text || text.trim().length === 0) {
          console.log('Server: PDF parsing succeeded but no text extracted');
          throw new Error('No text could be extracted from the PDF - it may contain only images or be corrupted');
        }
        
      } catch (pdfError: unknown) {
        console.error('Server: PDF parsing error:', pdfError);
        console.error('Server: Error details:', {
          name: pdfError instanceof Error ? pdfError.name : 'Unknown',
          message: pdfError instanceof Error ? pdfError.message : 'Unknown error',
          stack: pdfError instanceof Error ? pdfError.stack : 'No stack trace'
        });
        
        // Provide more specific error information
        let errorMessage = "Failed to process PDF resume: ";
        if (pdfError instanceof Error) {
          if (pdfError.message.includes('library not available')) {
            errorMessage += "PDF processing is temporarily unavailable on the server. ";
          } else if (pdfError.message.includes('Cannot read property') || pdfError.message.includes('undefined')) {
            errorMessage += "PDF parsing library error. ";
          } else if (pdfError.message.includes('Invalid PDF') || pdfError.message.includes('corrupted')) {
            errorMessage += "Invalid or corrupted PDF file. ";
          } else if (pdfError.message.includes('password')) {
            errorMessage += "Password-protected PDF detected. ";
          } else if (pdfError.message.includes('No text could be extracted')) {
            errorMessage += "PDF appears to contain only images or no readable text. ";
          } else {
            errorMessage += `PDF processing error: ${pdfError.message}. `;
          }
        } else {
          errorMessage += "Unknown PDF processing error. ";
        }
        
        errorMessage += "\n\nPlease try:\n• Use the 'Paste Resume Text' option below\n• Convert PDF to Word/TXT format\n• Ensure PDF is not password-protected\n• Use a PDF with selectable text (not scanned images)";
        
        return NextResponse.json({ 
          error: errorMessage,
          type: 'PDF_PROCESSING_ERROR'
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
  } catch (error: unknown) {
    console.error('Server: Unexpected error:', error);
    console.error('Server: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error while processing file" }, { status: 500 });
  }
}


