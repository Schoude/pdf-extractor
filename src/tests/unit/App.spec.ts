import { mount } from '@vue/test-utils';
import App from '../../App.vue';
import 'vue-router-mock';

describe('App.vue', () => {
  it('exists', () => {
    const w = mount(App);
    expect(w.exists()).toBe(true);
  });
  test('root route', () => {
    const w = mount(App);
    expect(w.router.currentRoute.value.path).toBe('/');
  });
});
