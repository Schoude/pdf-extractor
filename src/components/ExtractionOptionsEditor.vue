<template lang="pug">
form#extract-data.extraction-options-editor.container(name='extract-data')
  .form-field
    label(for='project-name') Projektname
    input#project-name(
      type='text',
      name='project-name',
      required,
      v-model.trim='projectName'
    )
  .form-field
    label(for='room-matcher') Matcher Raumanzahl (RegExp)
    input#room-matcher(
      type='text',
      name='room-matcher',
      required,
      v-model.trim='roomMatcher'
    )
    span
      code {{ roomMatcherRegExp }}
  .form-field
    label(for='size-matcher') Matcher Wohnfläche (RegExp)
    input#size-matcher(
      type='text',
      name='size-matcher',
      required,
      v-model.trim='sizeMatcher'
    )
    span
      code {{ sizeMatcherRegExp }}
  .form-field
    label Etagen-Guids <small>(jede in neuer Zeile - Start mit EG oder KG)</small>
    textarea.input__floors(
      rows='6',
      cols='50',
      required,
      v-model.trim='floorGuidString'
    )
    pre.floors-count {{ floorsCount }} Etagen erkannt
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ExtractionOptionsEditor',
  setup: () => {
    const projectName = ref('elf-freunde');
    const roomMatcher = ref('\\d-Zimmer');
    const sizeMatcher = ref('Gesamt-Wohn-Nutzfläche');
    const floorGuidString = ref(
      'f07d83ac-4cb3-4dba-8e6d-68111609ae2f\nd4656ce9-3137-46c7-b386-b2b67f4c673e\n74e9cf9b-9ec6-4d57-a26a-580dd1562d52\nb18e2bf6-0559-404a-ab11-155c6d30d278\n2140f5e6-8dfc-430a-ab75-b2f858a3c2f7\nbe1d7218-1e3d-432e-9567-dcb69fb2150b'
    );
    const floorsCount = computed(
      () => floorGuidString.value.split('\n').length
    );

    const roomMatcherRegExp = computed(() => `/${roomMatcher.value}}/g`);
    const sizeMatcherRegExp = computed(() => `/${sizeMatcher.value}}/g`);

    return {
      projectName,
      roomMatcher,
      sizeMatcher,
      roomMatcherRegExp,
      sizeMatcherRegExp,
      floorGuidString,
      floorsCount,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '../style/style' as *;

.form-field {
  margin-bottom: 1em;

  & + .form-field {
    margin-top: 1em;
  }

  label,
  input {
    display: block;
  }

  label {
    margin-bottom: 0.5em;
    font-weight: 600;
  }

  input {
    background: transparent;
    color: currentColor;
    border: 1px solid rgba(255, 255, 255, 0.336);
    padding: 0.5em;
    width: 100%;
    transition: all 0.2s ease;

    &:hover {
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    &:focus {
      outline: none;
      background: rgba($color-accent, 0.12);
      border: 1px solid rgba(255, 255, 255, 1);
    }
  }

  textarea {
    resize: none;
    background: transparent;
    color: currentColor;
    border: 1px solid rgba(255, 255, 255, 0.336);
    padding: 0.5em;
    transition: all 0.2s ease;

    &:hover {
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    &:focus {
      outline: none;
      background: rgba($color-accent, 0.12);
      border: 1px solid rgba(255, 255, 255, 1);
    }
  }
}
</style>