<template lang="pug">
main.setup
  .col
    h2 Extrahierungs-Optionen
    .col__content
      form#extract-data.container(name='extract-data')
        .form-field
          label(for='project-name') Projektname
          input#project-name(
            type='text',
            name='project-name',
            v-model.trim='projectName',
            required
          )
        .form-field
          label(for='room-matcher') Matcher Raumanzahl (regex)
          input#room-matcher(
            type='text',
            name='room-matcher',
            v-model.trim='roomMatcher',
            required
          )
          span
            code /{{ roomMatcher }}/g
        .form-field
          label(for='size-matcher') Matcher Wohnfläche (regex)
          input#size-matcher(
            type='text',
            name='size-matcher',
            v-model.trim='sizeMatcher',
            required
          )
          span
            code /{{ sizeMatcher }}/g
        .form-field
          label Etagen-Guids <small>(jede in neuer Zeile - Start mit EG oder KG)</small>
          textarea(
            rows='6',
            cols='50',
            v-model.trim='floorGuidString',
            required
          )
          pre {{ floorsCount }} Etagen erkannt
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
            ) PDFs abschicken ({{ loadedFileNames.length }})
        .container(v-if='files.length > 0')
          h3 {{ files.length }} Dateien geladen
          .loaded-files
            div(v-for='filename of loadedFileNames') {{ filename }}
  .col
    ExportedFilesDisplay(:projectName='projectName')
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import Axios from 'axios';
import useFileHandler from '../composables/file-handler';
import ExportedFilesDisplay from '../components/ExportedFilesDisplay.vue';

export default defineComponent({
  name: 'Setup',
  components: {
    ExportedFilesDisplay,
  },
  setup: () => {
    const {
      loadedFileNames,
      fetchExportedFiles,
      exportedFiles,
      files,
      clearFiles,
      deleteAllFiles,
    } = useFileHandler();
    const isLoading = ref(false);
    const projectName = ref('elf-freunde');
    const roomMatcher = ref('\\d-Zimmer');
    const sizeMatcher = ref('Gesamt-Wohn-Nutzfläche');

    const floorGuidString = ref(
      'f07d83ac-4cb3-4dba-8e6d-68111609ae2f\nd4656ce9-3137-46c7-b386-b2b67f4c673e\n74e9cf9b-9ec6-4d57-a26a-580dd1562d52\nb18e2bf6-0559-404a-ab11-155c6d30d278\n2140f5e6-8dfc-430a-ab75-b2f858a3c2f7\nbe1d7218-1e3d-432e-9567-dcb69fb2150b'
    );
    const floorsCount = computed(
      () => floorGuidString.value.split('\n').length
    );

    async function openDirectoryHandle() {
      // @ts-ignore new Chrome File System API
      const dirHandle = await showDirectoryPicker();
      for await (const entry of dirHandle.values()) {
        if (entry.kind !== 'file' || !/(?:.pdf$)/.test(entry.name)) return;
        loadedFileNames.value.push(entry.name as string);
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
      projectName,
      roomMatcher,
      sizeMatcher,
      floorGuidString,
      floorsCount,
      openDirectoryHandle,
      loadedFileNames,
      files,
      postData,
      exportedFiles,
      deleteAllFiles,
      clearFiles,
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
  padding: 1em 2em;
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

.loaded-files {
  font-weight: 300;
  max-height: 500px;
  overflow: auto;
  padding-right: 1em;
  @include scrollbar(true);
}
</style>