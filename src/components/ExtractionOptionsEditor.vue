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
import useExtractionOptions from '../composables/extraction-options';

export default defineComponent({
  name: 'ExtractionOptionsEditor',
  setup: () => {
    const {
      floorGuidString,
      projectName,
      roomMatcher,
      sizeMatcher,
      floorsCount,
    } = useExtractionOptions();

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
@use '../style/colors' as *;

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