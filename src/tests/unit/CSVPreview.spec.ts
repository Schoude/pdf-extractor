import { flushPromises, mount } from '@vue/test-utils';
import useFileHandler from '../../composables/file-handler';
import useCSVRenderer from '../../composables/csv-renderer';
import CSVPreview from '../../pages/CSVPreview.vue';
import { mockCSVData } from './CSVRenderer.spec';
const { exportedFiles } = useFileHandler();
const { selectedCSV } = useCSVRenderer();

const mockAxiosGet = jest.fn();
mockAxiosGet.mockReturnValue({ data: { ...mockCSVData } });

jest.mock('axios', () => ({ get: (url: string) => mockAxiosGet(url) }));

describe('CSVPreview', () => {
  beforeEach(() => {
    exportedFiles.value = ['test-export-units.csv'];
  });

  afterEach(() => {
    exportedFiles.value = [];
  });

  it('shows a description', () => {
    const w = mount(CSVPreview);
    expect(w.find('h2').text()).toBe(
      'Wähle eine CSV-Datei aus, um ihren Inhalt anzuzeigen'
    );
  });

  it('selects the first exported csv, if no other is selected', async () => {
    mount(CSVPreview);
    await flushPromises();
    expect(mockAxiosGet).toHaveBeenCalled();
    expect(mockAxiosGet).toHaveBeenCalledWith(
      'http://localhost:4000/csv-preview/test-export-units.csv'
    );

    expect(selectedCSV.name).toBe('test-export-units.csv');
    expect(selectedCSV.headers).toStrictEqual(mockCSVData.headers);
    expect(selectedCSV.rows).toStrictEqual(mockCSVData.rows);
  });

  it('shows the CSVRenderer', () => {
    const w = mount(CSVPreview);
    expect(w.findComponent({ name: 'CSVPreview' }).exists()).toBe(true);
  });
});
