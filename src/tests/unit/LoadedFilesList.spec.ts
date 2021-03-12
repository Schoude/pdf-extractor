import { mount } from '@vue/test-utils';
import LoadedFilesList from '../../components/layout/lists/LoadedFilesList.vue';

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
});
