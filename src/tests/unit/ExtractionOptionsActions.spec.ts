import { mount, flushPromises } from '@vue/test-utils';
import ExtractionOptionsActions from '../../components/ExtractionOptionsActions.vue';
import useFileHandler from '../../composables/file-handler';
import usePDFPreview from '../../composables/pdf-preview';
const { files } = useFileHandler();
const { setPreviewPDF, previewPDFFile } = usePDFPreview();

const mockAxiosGet = jest.fn();
const mockAxiosPost = jest.fn();

jest.mock('axios', () => ({
  post: (url: string) => mockAxiosPost(url),
  get: (url: string) => mockAxiosGet(url),
}));

function setupFilesArray(): void {
  files.value = [];
  for (let index = 0; index < 5; index++) {
    files.value.push(
      new File([], `sample-${index}.jpg`, { type: 'image/png' })
    );
  }
}

function mountWithFilesLoaded() {
  setupFilesArray();
  return mount(ExtractionOptionsActions);
}

describe('ExtractionOptionsActions', () => {
  beforeEach(() => {
    files.value = [];
  });

  afterEach(() => {
    files.value = [];
  });

  it('has a button to open the directory picker', () => {
    const w = mount(ExtractionOptionsActions);
    expect(w.find('.btn__directory-picker').exists()).toBe(true);
    expect(w.find('.btn__directory-picker').text()).toBe(
      'PDFs Ordner auswählen'
    );
  });

  it('opens the directory picker and loads files', async () => {
    const w = mount(ExtractionOptionsActions);
    const openDirectoryHandleMock = jest.fn();
    w.vm.openDirectoryHandle = openDirectoryHandleMock;
    await w.find('.btn__directory-picker').trigger('click');
    expect(openDirectoryHandleMock).toHaveBeenCalled();
  });

  test('the clear files and post files buttons appear if files are loaded', () => {
    const w = mountWithFilesLoaded();
    expect(w.find('.btn--delete').exists()).toBe(true);
    expect(w.find('.btn--delete').text()).toBe('Dateien leeren');
    expect(w.find('.btn--submit').text()).toBe(
      `PDFs abschicken (${files.value.length})`
    );
    expect(w.find('.btn--submit').attributes().class).toBe('btn--submit');
    expect(w.find('.btn--submit').attributes().form).toBe('extract-data');
    expect(w.find('.btn--submit').attributes().type).toBe('submit');
  });

  test('the loaded files can be removed - also empties the preview pdf file', async () => {
    const file = new File([], `sample.jpg`, { type: 'image/img' });
    setPreviewPDF(file);

    const w = mountWithFilesLoaded();
    await w.find('.btn--delete').trigger('click');
    expect(files.value.length).toBe(0);
    expect(previewPDFFile.value).toBe(null);
  });
});
