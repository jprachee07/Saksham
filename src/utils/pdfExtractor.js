import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure pdfjs worker for browser/Vite environment
try {
  if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker || `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.0.0'}/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn('PDF.js worker initialization warning:', e);
}

/**
 * Extracts all plain text content from a PDF File or ArrayBuffer.
 * @param {File | Blob | ArrayBuffer} fileOrBuffer
 * @returns {Promise<string>} Extracted text string
 */
export async function extractTextFromPDF(fileOrBuffer) {
  if (!fileOrBuffer) {
    throw new Error('No PDF file provided for text extraction.');
  }

  let arrayBuffer;
  if (fileOrBuffer instanceof ArrayBuffer) {
    arrayBuffer = fileOrBuffer;
  } else if (typeof fileOrBuffer.arrayBuffer === 'function') {
    arrayBuffer = await fileOrBuffer.arrayBuffer();
  } else {
    throw new Error('Unsupported file object passed to extractTextFromPDF.');
  }

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      isEvalSupported: false,
    });

    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const textPieces = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item) => (item.str ? item.str : ''))
        .join(' ');
      
      if (pageText.trim()) {
        textPieces.push(`--- Page ${pageNum} ---\n` + pageText.trim());
      }
    }

    const fullText = textPieces.join('\n\n').trim();

    if (!fullText) {
      throw new Error('No readable text could be extracted from this PDF. It may be a scanned image-only PDF.');
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(error.message || 'Failed to parse PDF document.', { cause: error });
  }
}
