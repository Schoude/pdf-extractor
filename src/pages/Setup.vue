<template lang="pug">
main.setup
  .col
    h2 Extrahierungs-Optionen
    .col__content
      ExtractionOptionsEditor
      .container.container__select
        div
          button(@click='openDirectoryHandle', tp) PDFs Ordner auswählen
          .container__button(v-if='files.length > 0')
            button.btn--delete(@click='clearFiles') Dateien leeren
          .container__button(v-if='files.length > 0')
            button.btn--submit(
              @click.prevent='postData',
              type='submit',
              form='extract-data',
              :disabled='isLoading'
            ) PDFs abschicken ({{ files.length }})
        .container(v-if='files.length > 0')
          h3 {{ files.length }} Dateien geladen
          LoadedFilesList(:files='files')
  .col
    ExportedFilesDisplay(:projectName='projectName')
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Axios from 'axios';
import useFileHandler from '../composables/file-handler';
import ExportedFilesDisplay from '../components/ExportedFilesDisplay.vue';
import ExtractionOptionsEditor from '../components/ExtractionOptionsEditor.vue';
import LoadedFilesList from '../components/layout/lists/LoadedFilesList.vue';
import useExtractionOptions from '../composables/extraction-options';

export default defineComponent({
  name: 'Setup',
  components: {
    ExtractionOptionsEditor,
    LoadedFilesList,
    ExportedFilesDisplay,
  },
  setup: () => {
    const { fetchExportedFiles, files, clearFiles } = useFileHandler();
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
        console.log(error.message);
      } finally {
        isLoading.value = false;
      }
    }

    return {
      isLoading,
      openDirectoryHandle,
      files,
      postData,
      clearFiles,
      projectName,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '../style/style' as *;
@use '../style/scrollbar' as *;

.setup {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
}

.col {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2em;
  }

  h2 {
    margin-bottom: 1em;
  }
}

.container__select {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.container__button {
  margin-top: 1em;
}
</style>