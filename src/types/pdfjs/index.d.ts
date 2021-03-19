import {
  getDocument,
  GlobalWorkerOptions,
} from '../../../api/node_modules/pdfjs-dist/types/pdf';

export {
  PDFDocumentProxy,
  PDFPageProxy,
} from '../../../api/node_modules/pdfjs-dist/types/display/api';
export interface CustomWindow extends Window {
  'pdfjs-dist/build/pdf': {
    getDocument;
    GlobalWorkerOptions;
  };
}
