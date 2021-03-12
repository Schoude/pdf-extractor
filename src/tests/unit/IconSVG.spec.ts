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

  it('sets the paths, the viewBox and existing classes according to the given icon name', () => {
    const w = mount(IconSVG, { props: { name: 'arrow-alt-square-left' } });
    expect(w.attributes().viewBox).toBe(icons['arrow-alt-square-left'].viewBox);

    icons['arrow-alt-square-left'].paths.forEach((pathData, i) => {
      expect(w.findAll('path')[i].attributes().d).toBe(pathData.d);
      if (pathData.class) {
        expect(w.findAll('path')[i].classes()).toContain(pathData.class);
      }
    });

    const wAlt = mount(IconSVG, { props: { name: 'download' } });
    expect(wAlt.attributes().viewBox).toBe(icons['download'].viewBox);

    icons['download'].paths.forEach((pathData, i) => {
      expect(wAlt.findAll('path')[i].attributes().d).toBe(pathData.d);
      if (pathData.class) {
        expect(wAlt.findAll('path')[i].classes()).toContain(pathData.class);
      }
    });
  });

  it('is display: inline-block by default', () => {
    const w = mount(IconSVG, { props: { name: 'download' } });
    expect(w.attributes().style).toBe('display: inline-block;');
  });
});
