<template lang="pug">
section.home
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
            ) PDFs abschicken ({{ loadedFiles.length }})
        .container(v-if='files.length > 0')
          h3 {{ files.length }} Dateien geladen
          .loaded-files
            div(v-for='filename of loadedFiles') {{ filename }}
  .col
    h2 Exportierte Dateien
    template(v-if='exportedFiles.length === 0')
      div Keine exportierten Dateien vorhanden.
    template(v-else)
      .exported-files
        template(v-for='file of exportedFiles')
          .file
            span {{ file }}
            button.btn--icon(
              @click='downLoadFile(file)',
              title='Datei herunterladen'
            )
              svg(xmlns='http://www.w3.org/2000/svg', viewBox='0 0 512 512')
                path(
                  d='M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'
                ) 

      button.btn--delete(@click='onDeleteAllClick') Alle exportierten Dateien löschen
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, Ref } from 'vue';
import Axios from 'axios';

export default defineComponent({
  name: 'Home',
  setup() {
    const isLoading = ref(false);
    const projectName = ref('elf-freunde');
    const roomMatcher = ref('\\d-Zimmer');
    const sizeMatcher = ref('Gesamt-Wohn-Nutzfläche');
    const loadedFiles = ref([]);
    const files: Ref<File[]> = ref([]);
    const exportedFiles = ref([]);

    const floorGuidString = ref(
      'f07d83ac-4cb3-4dba-8e6d-68111609ae2f\nd4656ce9-3137-46c7-b386-b2b67f4c673e\n74e9cf9b-9ec6-4d57-a26a-580dd1562d52\nb18e2bf6-0559-404a-ab11-155c6d30d278\n2140f5e6-8dfc-430a-ab75-b2f858a3c2f7\nbe1d7218-1e3d-432e-9567-dcb69fb2150b'
    );
    const floorsCount = computed(
      () => floorGuidString.value.split('\n').length
    );

    async function fetchExportedFiles() {
      const res = await Axios.get('http://localhost:4000/export');
      exportedFiles.value = res.data.files ?? [];
    }

    async function openDirectoryHandle() {
      // @ts-ignore new Chrome File System API
      const dirHandle = await showDirectoryPicker();
      for await (const entry of dirHandle.values()) {
        if (entry.kind !== 'file' || !/(?:.pdf$)/.test(entry.name)) return;
        loadedFiles.value.push(entry.name as never);
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

    async function onDeleteAllClick() {
      try {
        const res = await Axios.post('http://localhost:4000/export/delete-all');
        if (res.status === 200) fetchExportedFiles();
      } catch (error) {
        console.log(error.message);
      }
    }

    function createDownloadLink(filenamePrefix: string, data: ArrayBuffer) {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      const blob = new Blob([new Uint8Array(data)]);
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `${filenamePrefix}-units.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }

    function clearFiles() {
      files.value = [];
      loadedFiles.value = [];
    }

    async function downLoadFile(filename: string) {
      console.log(filename);
      try {
        const res = await Axios.get(
          `http://localhost:4000/download/${filename}`
        );
        if (res.status === 200)
          createDownloadLink(projectName.value, res.data.file.data);
      } catch (error) {
        console.log(error.message);
      }
    }

    onMounted(async () => {
      await fetchExportedFiles();
    });

    return {
      isLoading,
      projectName,
      roomMatcher,
      sizeMatcher,
      floorGuidString,
      floorsCount,
      openDirectoryHandle,
      loadedFiles,
      files,
      postData,
      exportedFiles,
      onDeleteAllClick,
      clearFiles,
      downLoadFile,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '../style/scrollbar' as *;

section {
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
      background: rgba(black, 0.4);
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
      background: rgba(black, 0.4);
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

.exported-files {
  margin-bottom: 1em;
  max-height: 300px;
  padding-right: 1em;
  @include scrollbar(true);

  .file {
    margin-bottom: 1em;
    display: flex;
    align-items: center;

    span {
      flex: 1 0 auto;
      font-weight: 300;
    }

    * + * {
      margin-left: 1em;
    }
  }
}

.btn--delete {
  border-color: rgba(220, 20, 60, 0.363);
  &:hover,
  &:focus {
    background-color: rgba(220, 20, 60, 0.363);
  }
}

.btn--submit {
  font-weight: 600;
  border-color: rgba(20, 220, 70, 0.363);
  &:hover,
  &:focus {
    background-color: rgba(20, 220, 70, 0.363);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn--icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em;

  svg {
    width: 20px;
    height: 20px;
    path {
      fill: white;
    }
  }
}
</style>