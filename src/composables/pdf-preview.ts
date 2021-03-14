import { Ref, ref } from 'vue';

const previewPDFFile: Ref<File | null> = ref(null);

function usePDFPreview() {
  function setPreviewPDF(file: File | null) {
    previewPDFFile.value = file;
  }
  return { previewPDFFile, setPreviewPDF };
}

export default usePDFPreview;
