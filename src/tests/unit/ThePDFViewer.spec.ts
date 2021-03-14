import { mount } from '@vue/test-utils';
import ThePDFViewer from '../../components/ThePDFViewer.vue';
import usePDFPreview from '../../composables/pdf-preview';
const { setPreviewPDF, previewPDFFile } = usePDFPreview();

function mountWithFileSelected() {
  const file = new File([], `sample.jpg`, { type: 'image/img' });
  setPreviewPDF(file);
  return mount(ThePDFViewer);
}

describe('ThePDFViewer', () => {
  it('has a headline', () => {
    const w = mount(ThePDFViewer);
    expect(w.text()).toContain('PDF Preview');
  });

  it('displays a fallback text if no file is selected', () => {
    const w = mount(ThePDFViewer);
    expect(w.find('.fallback__empty').text()).toBe(
      'Keine Datei zur Vorschau geladen'
    );
  });

  it("displays the selected file's name", () => {
    const w = mountWithFileSelected();
    expect(w.find('.file__selected').text()).toBe(
      `Geladene Datei: ${previewPDFFile.value?.name}`
    );
  });
});
