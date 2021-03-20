import { mount } from '@vue/test-utils';
import MBRipple from '../../components/vfx/MBRipple.vue';

describe('MBRipple', () => {
  it('creates a span element mb-ripple_animation after clicking', async () => {
    const w = mount(MBRipple);
    await w.trigger('click');
    expect(w.find('.mb-ripple__animation').exists()).toBe(true);
  });

  it('has a centerd prop', async () => {
    const w = mount(MBRipple, { props: { centered: true } });
    await w.trigger('click');
    expect(w.find('.mb-ripple__animation').exists()).toBe(true);
  });
});
