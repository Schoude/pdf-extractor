import { mount } from '@vue/test-utils';
import ExtractionOptionsEditor from '../../components/ExtractionOptionsEditor.vue';

const projectName = 'elf-freunde';
const roomMatcher = '\\d-Zimmer';
const sizeMatcher = 'Gesamt-Wohn-Nutzfläche';
const floorGuidString =
  'f07d83ac-4cb3-4dba-8e6d-68111609ae2f\nd4656ce9-3137-46c7-b386-b2b67f4c673e\n74e9cf9b-9ec6-4d57-a26a-580dd1562d52\nb18e2bf6-0559-404a-ab11-155c6d30d278\n2140f5e6-8dfc-430a-ab75-b2f858a3c2f7\nbe1d7218-1e3d-432e-9567-dcb69fb2150b';

function factory() {
  const w = mount(ExtractionOptionsEditor);
  w.vm.projectName = projectName;
  w.vm.roomMatcher = roomMatcher;
  w.vm.sizeMatcher = sizeMatcher;
  w.vm.floorGuidString = floorGuidString;
  return w;
}

describe('ExtractionOptionsEditor', () => {
  it('has the right id and name for the form', () => {
    const w = factory();
    expect(w.attributes().name).toBe('extract-data');
    expect(w.attributes().id).toBe('extract-data');
  });

  it('has three text inputs with tree labels and a label for the textarea', () => {
    const w = factory();
    expect(w.findAll('input[type="text"]').length).toBe(3);
    expect(w.findAll('label').length).toBe(4);
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

  it('has a textarea for the floor guids', () => {
    const w = factory();
    expect(w.find('.input__floors').exists()).toBe(true);
  });

  test('the input field has a default value filled out', () => {
    const w = factory();
    expect(
      (w.find('.input__floors').element as HTMLTextAreaElement).value
    ).toBe(floorGuidString);
  });

  it('shows the count of the given floors', () => {
    const w = factory();
    expect(w.find('.floors-count').text()).toBe(
      `${w.vm.floorsCount} Etagen erkannt`
    );
  });
});
