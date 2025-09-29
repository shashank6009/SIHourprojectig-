'use client';

// Client-side PDF parsing using PDF.js - works on ALL deployment platforms

export interface PdfJsLib {
  getDocument: (data: { data: ArrayBuffer }) => { promise: Promise<any> };
  GlobalWorkerOptions: { workerSrc: string };
}

// Dynamic import of PDF.js to avoid SSR issues
let pdfjsLib: PdfJsLib | null = null;

async function loadPdfJs(): Promise<PdfJsLib> {
  if (pdfjsLib) return pdfjsLib;
  
  if (typeof window === 'undefined') {
    throw new Error('PDF parsing is only available in the browser');
  }
  
  try {
    const module = await import('pdfjs-dist');
    pdfjsLib = module as any;
    
    // Configure PDF.js worker
    pdfjsLib!.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    
    return pdfjsLib!;
  } catch (error) {
    throw new Error('Failed to load PDF parsing library');
  }
}

export interface ParseResult {
  text: string;
  success: boolean;
  error?: string;
}

export async function parseFileClientSide(file: File): Promise<ParseResult> {
  try {
    console.log('Client-side parsing:', file.name, file.type);

    // Handle different file types
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      return await parsePdfClientSide(file);
    } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
      return await parseTextFile(file);
    } else if (file.name.toLowerCase().endsWith('.docx')) {
      // For DOCX, we'll ask user to copy-paste or convert to PDF/TXT
      return {
        success: false,
        text: '',
        error: 'DOCX files are not supported in client-side parsing. Please:\n• Convert to PDF format\n• Save as TXT file\n• Copy and paste the text below'
      };
    } else {
      return {
        success: false,
        text: '',
        error: 'Unsupported file format. Please upload PDF or TXT files, or use the text paste option below.'
      };
    }
  } catch (error) {
    console.error('Client-side parsing error:', error);
    return {
      success: false,
      text: '',
      error: error instanceof Error ? error.message : 'Unknown parsing error'
    };
  }
}

async function parsePdfClientSide(file: File): Promise<ParseResult> {
  try {
    console.log('Starting PDF parsing on client...');
    
    // Ensure we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('PDF parsing is only available in the browser');
    }
    
    // Load PDF.js dynamically
    const pdfjs = await loadPdfJs();
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    console.log('PDF loaded, pages:', pdf.numPages);
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
        
        console.log(`Page ${pageNum} extracted, length:`, pageText.length);
      } catch (pageError) {
        console.warn(`Error parsing page ${pageNum}:`, pageError);
        // Continue with other pages
      }
    }
    
    // Clean up the text
    fullText = fullText
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();
    
    console.log('PDF parsing complete, total text length:', fullText.length);
    
    if (!fullText || fullText.length < 10) {
      return {
        success: false,
        text: '',
        error: 'No readable text found in PDF. The PDF might contain only images or be password-protected. Please:\n• Use a PDF with selectable text\n• Convert scanned PDF to text\n• Use the text paste option below'
      };
    }
    
    return {
      success: true,
      text: fullText,
    };
    
  } catch (error) {
    console.error('PDF parsing error:', error);
    return {
      success: false,
      text: '',
      error: 'Failed to parse PDF. Please try:\n• Converting to a different PDF format\n• Using the text paste option below\n• Checking if the PDF is password-protected'
    };
  }
}

async function parseTextFile(file: File): Promise<ParseResult> {
  try {
    const text = await file.text();
    
    if (!text || text.trim().length === 0) {
      return {
        success: false,
        text: '',
        error: 'Text file appears to be empty.'
      };
    }
    
    return {
      success: true,
      text: text.trim(),
    };
  } catch (error) {
    console.error('Text file parsing error:', error);
    return {
      success: false,
      text: '',
      error: 'Failed to read text file.'
    };
  }
}
