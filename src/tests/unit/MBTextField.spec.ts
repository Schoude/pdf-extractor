import { mount } from '@vue/test-utils';
import MBTextField from '../../components/ui/MBTextField.vue';

function factory(
  props: Record<string, string | number | boolean>,
  attrs?: Record<string, string>,
  slots?: Record<string, string>
) {
  return mount(MBTextField, {
    props,
    attrs,
    slots,
  });
}

describe('MBTextField', () => {
  it('has a modelValue prop that sets the value of the input field', () => {
    const w = factory({ modelValue: 'test' });
    expect(w.props().modelValue).toBe('test');
    expect(w.find('input').element.value).toBe('test');
  });

  it('emits the modelValue on input', async () => {
    const w = factory({ modelValue: 'test' });
    w.find('input').element.value = 'test edit';
    await w.find('input').trigger('input');
    expect(w.props().modelValue).toBe('test edit');
    expect(w.emitted()['update:modelValue'].length).toBe(1);
    expect(w.emitted()['update:modelValue'].flat()[0]).toBe('test edit');
  });

  test('the actual input element receives the attributes given to the mounted component', () => {
    const mockAttributes = {
      type: 'text',
      autocomplete: 'given-name',
      id: 'my-input',
      name: 'my-input',
    };
    const w = factory({ modelValue: 'test' }, mockAttributes);
    expect(w.find('input').attributes()).toEqual(mockAttributes);
  });

  it('passes through the required attribute', () => {
    const w = factory({ modelValue: 'test' }, { required: '' });
    expect(w.find('input').attributes()).toHaveProperty('required');
  });

  it('shows a clear icon if value is present', () => {
    const w = factory({ modelValue: 'test' });
    expect(w.find('.btn--text-field__clear').exists()).toBe(true);
    expect(w.find('.btn--text-field__clear').attributes().type).toBe('button');
    expect(w.find('.btn--text-field__clear').attributes().tabindex).toBe('-1');
    expect(w.find('.btn--text-field__clear').attributes().title).toBe(
      'Eingabe löschen'
    );
  });

  test('the clear button clears the input and modelvalue on click', async () => {
    const w = factory({ modelValue: 'test' });
    await w.find('.btn--text-field__clear').trigger('click');
    expect(w.props().modelValue).toBe('');
    expect(w.find('input').element.value).toBe('');
  });

  it('has a label slot', () => {
    const w = factory(
      { modelValue: 'test' },
      { name: 'test-input' },
      { label: 'My Label' }
    );
    expect(w.find('label').attributes().for).toBe('test-input');
    expect(w.find('label').text()).toBe('My Label');
  });
});
