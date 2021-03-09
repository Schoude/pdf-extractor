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
          label Etagen-Guids (jede in neuer Zeile)
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
            button.btn--submit(
              @click.prevent='postData',
              type='submit',
              form='extract-data'
            ) PDFs abschicken ({{ loadedFiles.length }})
          .container__button(v-if='files.length > 0')
            button.btn--delete(@click='clearFiles') Dateien leeren
        .container(v-if='files.length > 0')
          h3 {{ files.length }} Dateien
          .loaded-files
            div(v-for='filename of loadedFiles') {{ filename }}
  .col
    h2 Exportierte Dateien
    template(v-if='exportedFiles.length === 0')
      div Keine exportierten Dateien vorhanden.
    template(v-else)
      .exported-files(v-for='file of exportedFiles') {{ file }}
      button.btn--delete(@click='onDeleteAllClick') Alle exportierten Dateien löschen
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, Ref } from 'vue';
import Axios from 'axios';

export default defineComponent({
  name: 'Home',
  setup() {
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
        if (entry.kind !== 'file') return;
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
        // if (res.data.file) {
        //   createDownloadLink(projectName.value, res.data.file.data);
        // }
      } catch (error) {
        console.log(error.message);
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

    onMounted(async () => {
      await fetchExportedFiles();
    });

    return {
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
    };
  },
});
</script>

<style lang="scss" scoped>
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
  margin-bottom: 1em;
  display: flex;
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
  max-height: 300px;
  overflow: auto;
  padding-right: 1em;
}

.exported-files {
  margin-bottom: 1em;
}

.btn--delete {
  &:hover {
    background-color: rgba(220, 20, 60, 0.589);
  }
}

.btn--submit {
  &:hover {
    background-color: rgba(20, 220, 70, 0.589);
  }
}
</style>