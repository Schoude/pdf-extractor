import { mount } from '@vue/test-utils';
import ExtractionOptionsEditor from '../../components/ExtractionOptionsEditor.vue';

const projectName = 'elf-freunde';
const roomMatcher = '\\d-Zimmer';
const sizeMatcher = 'Gesamt-Wohn-Nutzfläche';

function factory() {
  const w = mount(ExtractionOptionsEditor);
  w.vm.projectName = projectName;
  w.vm.roomMatcher = roomMatcher;
  w.vm.sizeMatcher = sizeMatcher;
  return w;
}

describe('ExtractionOptionsEditor', () => {
  it('has the right id and name for the form', () => {
    const w = factory();
    expect(w.attributes().name).toBe('extract-data');
    expect(w.attributes().id).toBe('extract-data');
  });

  it('has three text inputs with tree labels', () => {
    const w = factory();
    expect(w.findAll('input[type="text"]').length).toBe(3);
    expect(w.findAll('label').length).toBe(3);
  });

  test('all inputs are required', () => {
    const w = factory();
    w.findAll('input[type="text"]').forEach((input) => {
      expect(input.attributes()).toHaveProperty('required');
    });
  });

  test('the inputs have a default value filled in', () => {
    const w = factory();
    const inputProjectName = w.find('#project-name');
    const inputRoomMatcher = w.find('#room-matcher');
    const inputSizeMatcher = w.find('#size-matcher');

    expect((inputProjectName.element as HTMLInputElement).value).toBe(
      projectName
    );
    expect((inputRoomMatcher.element as HTMLInputElement).value).toBe(
      roomMatcher
    );
    expect((inputSizeMatcher.element as HTMLInputElement).value).toBe(
      sizeMatcher
    );
  });

  it('shows the generated RegExp that will be used', () => {
    const w = factory();
    expect(w.vm.roomMatcherRegExp).toBe(`/${roomMatcher}}/g`);
    expect(w.vm.sizeMatcherRegExp).toBe(`/${sizeMatcher}}/g`);
  });
});
