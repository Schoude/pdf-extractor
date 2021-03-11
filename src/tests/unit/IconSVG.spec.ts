import { mount } from '@vue/test-utils';
import IconSVG from '../../components/vfx/icons/IconSVG.vue';
import icons from '../../components/vfx/icons/icon-paths';

describe('IconSVG', () => {
  it('has a name property', () => {
    const w = mount(IconSVG, { props: { name: 'download' } });
    expect(w.props().name).toBe('download');
  });

  it('has a color property', () => {
    const w = mount(IconSVG, { props: { name: 'download', color: 'red' } });
    expect(w.props().color).toBe('red');
    expect(w.attributes().fill).toBe('red');
  });

  it('has a default with of 20px', () => {
    const w = mount(IconSVG, { props: { name: 'download' } });
    expect(w.attributes().width).toBe('20');
  });

  it('sets the path and the viewBox according to the given icon name', () => {
    const w = mount(IconSVG, { props: { name: 'download' } });
    expect(w.attributes().viewBox).toBe(icons.download.viewBox);
    expect(w.find('path').attributes().d).toBe(icons.download.path);
  });

  it('is display: inline-block by default', () => {
    const w = mount(IconSVG, { props: { name: 'download' } });
    expect(w.attributes().style).toBe('display: inline-block;');
  });
});
