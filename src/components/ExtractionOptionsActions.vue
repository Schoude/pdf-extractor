<template lang="pug">
.extraction-options-actions
  button.btn__directory-picker(@click='openDirectoryHandle') PDFs Ordner auswählen
  template(v-if='files.length > 0')
    button.btn--delete(@click='clearFiles') Dateien leeren
  template(v-if='files.length > 0')
    button.btn--submit(
      @click.prevent='postData',
      type='submit',
      form='extract-data',
      :disabled='isLoading'
    ) PDFs abschicken ({{ files.length }})
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useExtractionOptions from '../composables/extraction-options';
import useFileHandler from '../composables/file-handler';
import Axios from 'axios';

export default defineComponent({
  name: 'ExtractionOptionsActions',
  setup: () => {
    const { files, clearFiles, fetchExportedFiles } = useFileHandler();
    const {
      floorGuidString,
      projectName,
      roomMatcher,
      sizeMatcher,
    } = useExtractionOptions();
    const isLoading = ref(false);

    async function openDirectoryHandle() {
      // @ts-ignore new Chrome File System API
      const dirHandle = await showDirectoryPicker();
      for await (const entry of dirHandle.values()) {
        if (entry.kind !== 'file' || !/(?:.pdf$)/.test(entry.name)) return;
        const fileHandle = await dirHandle.getFileHandle(entry.name, {
          create: true,
        });
        const file = await fileHandle.getFile();
        files.value.push(file as File);
      }
    }

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
      openDirectoryHandle,
      files,
      isLoading,
      clearFiles,
      postData,
    };
  },
});
</script>

<style lang="scss" scoped>
.extraction-options-actions {
  button {
    display: block;
  }
  button + button {
    margin-top: 1em;
  }
}
</style>