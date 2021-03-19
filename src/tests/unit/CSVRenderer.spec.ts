import { mount } from '@vue/test-utils';
import CSVRenderer from '../../components/CSVRenderer.vue';
import { CSVData } from '../../types/csv-renderer';

export const mockCSVData: CSVData = {
  name: 'test-export-units.csv',
  headers: [
    'meta/de/name',
    'number_of_rooms',
    'area_size',
    'floor',
    'generals',
  ],
  rows: [
    ['02_1_03', '2', '49.43', 'd4656ce9-3137-46c7-b386-b2b67f4c673e', ''],
    [
      '02_3_09',
      '2',
      '68.72',
      'b18e2bf6-0559-404a-ab11-155c6d30d278',
      '47b2d9fb-14c3-4215-98af-833b2096eabc',
    ],
    [
      '02_4_10',
      '4',
      '126.12',
      '2140f5e6-8dfc-430a-ab75-b2f858a3c2f7',
      '0c8dd81e-4403-4435-974d-0e2ec616ea16,47b2d9fb-14c3-4215-98af-833b2096eabc',
    ],
    [
      '02_5_13',
      '3',
      '117.04',
      'be1d7218-1e3d-432e-9567-dcb69fb2150b',
      '0c8dd81e-4403-4435-974d-0e2ec616ea16,47b2d9fb-14c3-4215-98af-833b2096eabc',
    ],
    [
      '02_5_12',
      '3',
      '109.50',
      'be1d7218-1e3d-432e-9567-dcb69fb2150b',
      '47b2d9fb-14c3-4215-98af-833b2096eabc',
    ],
    [
      '02_2_06',
      '2',
      '68.36',
      '74e9cf9b-9ec6-4d57-a26a-580dd1562d52',
      '47b2d9fb-14c3-4215-98af-833b2096eabc',
    ],
    [
      '02_4_11',
      '4',
      '133.01',
      '2140f5e6-8dfc-430a-ab75-b2f858a3c2f7',
      '0c8dd81e-4403-4435-974d-0e2ec616ea16,47b2d9fb-14c3-4215-98af-833b2096eabc',
    ],
    [
      '02_2_04',
      '3',
      '100.36',
      '74e9cf9b-9ec6-4d57-a26a-580dd1562d52',
      '47b2d9fb-14c3-4215-98af-833b2096eabc',
    ],
    [
      '02_2_05',
      '3',
      '100.08',
      '74e9cf9b-9ec6-4d57-a26a-580dd1562d52',
      '47b2d9fb-14c3-4215-98af-833b2096eabc',
    ],
    [
      '02_3_08',
      '3',
      '104.57',
      'b18e2bf6-0559-404a-ab11-155c6d30d278',
      '47b2d9fb-14c3-4215-98af-833b2096eabc',
    ],
    [
      '02_1_02',
      '3',
      '114.45',
      'd4656ce9-3137-46c7-b386-b2b67f4c673e',
      '47b2d9fb-14c3-4215-98af-833b2096eabc',
    ],
    [
      '02_3_07',
      '3',
      '103.26',
      'b18e2bf6-0559-404a-ab11-155c6d30d278',
      '47b2d9fb-14c3-4215-98af-833b2096eabc',
    ],
    [
      '02_0_01',
      '4',
      '143.88',
      'f07d83ac-4cb3-4dba-8e6d-68111609ae2f',
      'fcddc2ad-3e74-4e8b-8769-d4ebfa037cc4,f3d1f2d7-9ad7-449a-a738-e275eddbba55,47b2d9fb-14c3-4215-98af-833b2096eabc',
    ],
  ],
};

function factory() {
  return mount(CSVRenderer, { props: { csvData: mockCSVData } });
}

describe('CSVRenderer', () => {
  it('receices a csvData prop', () => {
    const w = factory();
    expect(w.props().csvData).toStrictEqual(mockCSVData);
  });

  it('renders headers row', () => {
    const w = factory();
    expect(w.find('.csv-headers').exists()).toBe(true);
    expect(w.find('.csv-headers').findAll('.csv-cell').length).toBe(
      mockCSVData.headers.length
    );
  });

  it('renders the rows', () => {
    const w = factory();
    expect(w.findAll('.csv-row').length).toBe(mockCSVData.rows.length);
  });

  it('renders the calls for each row', () => {
    const w = factory();
    expect(w.find('.csv-row').findAll('.csv-cell').length).toBe(
      mockCSVData.rows[0].length
    );
  });
});
