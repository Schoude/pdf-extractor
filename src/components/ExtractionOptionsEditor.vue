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
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ExtractionOptionsEditor',
  setup: () => {
    const projectName = ref('elf-freunde');
    const roomMatcher = ref('\\d-Zimmer');
    const sizeMatcher = ref('Gesamt-Wohn-Nutzfläche');

    const roomMatcherRegExp = computed(() => `/${roomMatcher.value}}/g`);
    const sizeMatcherRegExp = computed(() => `/${sizeMatcher.value}}/g`);

    return {
      projectName,
      roomMatcher,
      sizeMatcher,
      roomMatcherRegExp,
      sizeMatcherRegExp,
    };
  },
});
</script>

<style lang="sass" scoped>
</style>