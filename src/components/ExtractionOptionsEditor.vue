<template lang="pug">
form#extract-data.extraction-options-editor.container(
  name='extract-data',
  @submit.prevent='postData'
)
  .form-field
    MBTextField#project-name(
      v-model.trim='projectName',
      name='projekt-name',
      required,
      autocomplete='off'
    )
      template(#label)
        | Projektname
  .form-field
    MBTextField#room-matcher(
      v-model.trim='roomMatcher',
      name='room-matcher',
      required,
      autocomplete='off'
    )
      template(#label)
        | Matcher Raumanzahl (RegExp)
    span
      code {{ roomMatcherRegExp }}
  .form-field
    MBTextField#size-matcher(
      v-model.trim='sizeMatcher',
      name='size-matcher',
      required,
      autocomplete='off'
    )
      template(#label)
        | Matcher Wohnfläche (RegExp)
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
import useFileHandler from '../composables/file-handler';
import MBTextField from './ui/MBTextField.vue';
import Axios from 'axios';

export default defineComponent({
  name: 'ExtractionOptionsEditor',
  components: {
    MBTextField,
  },
  setup: () => {
    const {
      floorGuidString,
      projectName,
      roomMatcher,
      sizeMatcher,
      floorsCount,
    } = useExtractionOptions();
    const { files, fetchExportedFiles, isLoading } = useFileHandler();

    const roomMatcherRegExp = computed(() => `/${roomMatcher.value}/g`);
    const sizeMatcherRegExp = computed(() => `/${sizeMatcher.value}/g`);

    async function setupFormData() {
      const formData = new FormData();

      files.value.forEach((file) => {
        formData.append(file.name, file);
      });

      return formData;
    }

    async function postData() {
      isLoading.value = true;
      const formData = await setupFormData();

      formData.append('projectName', projectName.value);
      formData.append('roomMatcher', roomMatcher.value);
      formData.append('sizeMatcher', sizeMatcher.value);
      formData.append('floorGuidString', floorGuidString.value);

      try {
        const res = await Axios.post('http://localhost:4000/pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (res.status === 200) fetchExportedFiles();
      } catch (error) {
        return;
      } finally {
        isLoading.value = false;
      }
    }

    return {
      projectName,
      roomMatcher,
      sizeMatcher,
      roomMatcherRegExp,
      sizeMatcherRegExp,
      floorGuidString,
      floorsCount,
      postData,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '../style/colors' as *;

.form-field {
  & + .form-field {
    margin-top: 3em;
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