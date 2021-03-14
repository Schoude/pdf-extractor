import { mount } from '@vue/test-utils';
import LoadedFilesList from '../../components/layout/lists/LoadedFilesList.vue';
import usePDFPreview from '../../composables/pdf-preview';
const { previewPDFFile } = usePDFPreview();

let files: File[] = [];

function setupFilesArray(): void {
  files = [];
  for (let index = 0; index < 5; index++) {
    files.push(new File([], `sample-${index}.jpg`, { type: 'image/png' }));
  }
}

function factory() {
  setupFilesArray();
  return mount(LoadedFilesList, { props: { files: files } });
}

describe('LoadedFilesList', () => {
  it('reveives an array of files as a prop', () => {
    const w = factory();
    expect((w.props().files as File[]).length).toBe(files.length);
  });

  it('renders an list item for every entry in the files array and shows the filename', () => {
    const w = factory();
    expect(w.findAll('.loaded-files-list__list-item').length).toBe(
      files.length
    );

    w.findAll('.loaded-files-list__list-item').forEach((listItem, index) => {
      expect(listItem.text()).toBe(files[index].name);
    });
  });

  test('each list item has a button to view the PDF in a viewer', () => {
    const w = factory();
    w.findAll('.loaded-files-list__list-item').forEach((listItem) => {
      expect(listItem.find('.btn--pdf-viewer').exists()).toBe(true);
      expect(listItem.find('.btn--pdf-viewer').attributes().title).toBe(
        'Als PDF ansehen'
      );
      expect(listItem.find('.btn--pdf-viewer').attributes().type).toBe(
        'button'
      );
    });
  });

  test('select the file to be display as the preview PDF', async () => {
    const w = factory();
    await w.find('.btn--pdf-viewer').trigger('click');
    expect(previewPDFFile.value).not.toBe(null);
  });

  it('disables the show preview button for the selected preview file', async () => {
    const w = factory();
    await w.find('.btn--pdf-viewer').trigger('click');
    expect(w.find('.btn--pdf-viewer').attributes()).toHaveProperty('disabled');
    expect(w.find('.btn--pdf-viewer').attributes().title).toBe(
      'Datei ist bereits ausgewählt'
    );
  });
});
