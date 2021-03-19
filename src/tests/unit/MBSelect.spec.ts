import { mount } from '@vue/test-utils';
import MBSelect from '../../components/ui/MBSelect.vue';
import { MBSelectItem } from '../../types/mb-select';

const mockItems: MBSelectItem[] = [
  {
    value: 'test.csv',
    label: 'test.csv',
  },
  {
    value: 'example.csv',
    label: 'example.csv',
  },
];

function factory(propsData?: Record<string, string | number | boolean>) {
  return mount(MBSelect, { props: { items: mockItems, ...propsData } });
}

describe('MBSelect', () => {
  it('has a role of button and a tabindex of 0', () => {
    const w = factory();
    expect(w.attributes().role).toBe('button');
    expect(w.attributes().tabindex).toBe('0');
  });

  it('receives an items array as a prop', () => {
    const w = factory();
    expect(w.props().items).toStrictEqual(mockItems);
  });

  it('sets the first item of the items array as selectedItem and updates the modelValue to it if no initial modelValue is provided', () => {
    const w = factory();
    expect(w.vm.selectedItem).toStrictEqual(mockItems[0]);
    expect(w.props().modelValue).toBe(mockItems[0].value);

    expect(w.emitted()['update:modelValue'].length).toBe(1);
    expect((w.emitted()['update:modelValue'][0] as string | number[])[0]).toBe(
      mockItems[0].value
    );
  });

  it('sets the selected item initially to the modelValue if provided', () => {
    const w = factory({ modelValue: 'example.csv' });
    expect(w.vm.selectedItem).toEqual(w.vm.items[1]);
  });

  it('displays the label of the selectedItem', () => {
    const w = factory();
    expect(w.find('.selected-item').text()).toBe(mockItems[0].label);
  });

  it('renders a list of the SelectItems if the root element gets clicked', async () => {
    const w = factory();
    await w.trigger('click');
    expect(w.vm.listVisible).toBe(true);
    expect(w.findAll('.mb-select__list-item').length).toEqual(mockItems.length);
    w.findAll('.mb-select__list-item').forEach((el, index) => {
      expect(el.text()).toBe(mockItems[index].label);
    });
  });

  it('the .mb-select__list-item has some attributes', async () => {
    const w = factory();
    await w.trigger('click');
    expect(w.find('.mb-select__list-item').attributes().tabindex).toBe('0');
    expect(w.find('.mb-select__list-item').attributes().role).toBe('button');
    expect(w.find('.mb-select__list-item').attributes()['aria-label']).toBe(
      mockItems[0].label
    );
  });

  it("the selected md-select__list-item has a 'selected' class", async () => {
    const w = factory();
    await w.trigger('click');
    expect(w.find('.mb-select__list-item').classes()).toContain('selected');
  });

  it('updates the selected item and the modelValue if a list item gets clicked', async () => {
    const w = factory({ modelValue: mockItems[0].value });
    await w.trigger('click');
    await w.findAll('.mb-select__list-item')[1].trigger('click');

    // events
    expect(w.emitted()['update:modelValue'].length).toEqual(1);
    expect((w.emitted()['update:modelValue'][0] as string | number[])[0]).toBe(
      mockItems[1].value
    );
    expect(w.emitted()['select-changed'].length).toEqual(1);
    expect(
      (w.emitted()['select-changed'][0] as string | number[])[0]
    ).toStrictEqual(mockItems[1]);

    // state change
    expect(w.vm.selectedItem).toStrictEqual(mockItems[1]);
    expect(w.vm.listVisible).toBe(false);
  });
});
