import { mount } from '@vue/test-utils';
import TheHeader from '../../components/layout/TheHeader.vue';
import useFileHandler from '../../composables/file-handler';

describe('TheHeader', () => {
  it('shows the logo', () => {
    const w = mount(TheHeader);
    expect(w.find('.logo').exists()).toBe(true);
  });
  it('has a nav section with two router links', () => {
    const w = mount(TheHeader);
    expect(w.find('nav').exists()).toBe(true);
    expect(w.find('nav').findAll('.router-link').length).toBe(3);
  });
  test('link to /viz is disabled if no files are loaded', () => {
    const w = mount(TheHeader);
    expect(w.find('.route-viz').classes()).toContain('disabled');
  });
  test('link to /viz is clickable if files are loaded', async () => {
    const { files } = useFileHandler();

    const file = new File([], 'sample.jpg', { type: 'image/png' });
    files.value.push(file);
    const w = mount(TheHeader);
    expect(w.find('.route-viz').classes()).not.toContain('disabled');
  });

  it('link to /csv is disabled if not files are loaded', async () => {
    const w = mount(TheHeader);
    expect(w.find('.route-csv').classes()).toContain('disabled');
  });

  it('link to /csv is clickable if files are loaded', async () => {
    const { exportedFiles } = useFileHandler();
    exportedFiles.value = ['test-export.csv'];
    const w = mount(TheHeader);
    expect(w.find('.route-csv').classes()).not.toContain('disabled');
  });
});
