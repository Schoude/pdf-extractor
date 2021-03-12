import { flushPromises, mount } from '@vue/test-utils';
import ExportedFilesDisplay from '../../components/ExportedFilesDisplay.vue';
import useFileHandler from '../../composables/file-handler';
const { exportedFiles } = useFileHandler();

const mockAxiosGet = jest.fn();
mockAxiosGet.mockReturnValue({ data: { files: ['text.pdf', 'text2.pdf'] } });

const mockAxiosDeleteAll = jest.fn();
mockAxiosDeleteAll.mockReturnValueOnce({ status: 200 });
mockAxiosDeleteAll.mockRejectedValueOnce(new Error('failed'));

jest.mock('axios', () => ({
  get: (url: string) => mockAxiosGet(url),
  post: (url: string) => mockAxiosDeleteAll(url),
}));

describe('ExportedFilesDisplay', () => {
  beforeEach(() => {
    exportedFiles.value = [];
  });

  it('has a headline', () => {
    const w = mount(ExportedFilesDisplay);
    expect(w.find('h2').exists()).toBe(true);
    expect(w.find('h2').text()).toBe('Exportierte Dateien');
  });

  it('shows a fallback text, if no exported files are loaded', () => {
    const w = mount(ExportedFilesDisplay);
    expect(w.find('.fallback-text--empty').exists()).toBe(true);
    expect(w.find('.fallback-text--empty').text()).toBe(
      'Keine exportierten Dateien vorhanden.'
    );
    expect(w.find('.btn--delete-all').exists()).toBe(false);
  });

  it('lists the exported files - with name and download button', () => {
    const { exportedFiles } = useFileHandler();
    exportedFiles.value = ['text.pdf', 'text2.pdf'];
    const w = mount(ExportedFilesDisplay);
    expect(w.find('.fallback-text--empty').exists()).toBe(false);
    expect(w.vm.exportedFiles.length).toBe(2);
    expect(w.findAll('.exported-file').length).toBe(2);
    exportedFiles.value.forEach((name, i) => {
      expect(w.findAll('.exported-file')[i].text()).toBe(name);
      expect(
        w.findAll('.exported-file')[i].find('.btn--download').exists()
      ).toBe(true);
    });
  });

  it("shows a 'delete all' button if files are present", () => {
    exportedFiles.value = ['text.pdf', 'text2.pdf'];
    const w = mount(ExportedFilesDisplay);
    expect(w.find('.btn--delete-all').exists()).toBe(true);
    expect(w.find('.btn--delete-all').text()).toBe(
      'Alle exportierten Dateien löschen'
    );
  });

  it('fetches the exported files when mounted', async () => {
    mount(ExportedFilesDisplay);
    await flushPromises();

    expect(exportedFiles.value.length).toBe(2);
    expect(mockAxiosGet).toHaveBeenCalled();
    expect(mockAxiosGet).toHaveBeenCalledWith('http://localhost:4000/export');
  });

  test('delete all files when clicking the button', async () => {
    exportedFiles.value = ['text.pdf', 'text2.pdf'];
    const w = mount(ExportedFilesDisplay);

    await w.find('.btn--delete-all').trigger('click');
    await flushPromises();
    expect(mockAxiosDeleteAll).toHaveBeenCalled();
    expect(mockAxiosDeleteAll).toHaveBeenCalledWith(
      'http://localhost:4000/export/delete-all'
    );
    expect(exportedFiles.value.length).toBe(0);
  });

  test('deleting all files can throw', async () => {
    exportedFiles.value = ['text.pdf', 'text2.pdf'];
    const w = mount(ExportedFilesDisplay);

    await w.find('.btn--delete-all').trigger('click');
    await flushPromises();
    expect(mockAxiosDeleteAll).toHaveBeenCalled();
    expect(exportedFiles.value.length).toBe(2);
  });
});
