import { mount } from '@vue/test-utils';
import App from '../../App.vue';
import 'vue-router-mock';

describe('App.vue', () => {
  it('renders the header', () => {
    const w = mount(App);
    expect(w.findComponent({ name: 'TheHeader' }).exists()).toBe(true);
  });
});
