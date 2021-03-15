import { flushPromises, mount } from '@vue/test-utils';
import useFileHandler from '../../composables/file-handler';
import useCSVRenderer from '../../composables/csv-renderer';
import CSVPreview from '../../pages/CSVPreview.vue';
const { exportedFiles } = useFileHandler();
const { selectedCSV } = useCSVRenderer();

const mockAxiosGet = jest.fn();

jest.mock('axios', () => ({ get: (url: string) => mockAxiosGet(url) }));

describe('CSVPreview', () => {
  beforeEach(() => {
    exportedFiles.value = ['elf-freunde-units.csv'];
  });

  afterEach(() => {
    exportedFiles.value = [];
  });

  it('shows a description', () => {
    const w = mount(CSVPreview);
    expect(w.find('h2').text()).toBe(
      'Wähle eine CSV-Datei aus um ihren Inhalt anzuzeigen'
    );
  });

  it('selects the first exported csv, if no other is selected', async () => {
    const w = mount(CSVPreview);
    await flushPromises();
    expect(selectedCSV.name).toBe('elf-freunde-units.csv');
    expect(mockAxiosGet).toHaveBeenCalled();
    expect(mockAxiosGet).toHaveBeenCalledWith(
      'http://localhost:4000/csv-preview/elf-freunde-units.csv'
    );
  });
});
