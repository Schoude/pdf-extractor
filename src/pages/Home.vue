<template lang="pug">
section.home
  .col
    h2 Extrahierungs-Optionen
    .container
      .form-field
        label(for='project-name') Projektname
        input#project-name(
          type='text',
          name='project-name',
          v-model='projectName'
        )
      .form-field
        label(for='room-matcher') Matcher Raumanzahl (regex)
        input#room-matcher(
          type='text',
          name='room-matcher',
          v-model='roomMatcher'
        )
        span 
          i /{{ roomMatcher }}/g
      .form-field
        label(for='size-matcher') Matcher Wohnfläche (regex)
        input#size-matcher(
          type='text',
          name='size-matcher',
          v-model='sizeMatcher'
        )
        span 
          i /{{ sizeMatcher }}/g
    .container.container__select
      button(@click='openDirectoryHandle') PDFs Ordner auswählen
      .container(v-if='loadedFiles.length > 0')
        div(v-for='filename of loadedFiles') {{ filename }}
    .container(v-if='files.length > 0')
      button(@click='postData') PDFs abschicken
  .col
    h2 Exportierte Dateien
    template(v-if='exportedFiles.length === 0')
      div Keine exportierten Dateien vorhanden.
    template(v-else)
      .exported-files(v-for='file of exportedFiles') {{ file }}
      button.btn--delete(@click='onDeleteAllClick') Alle exportierten Dateien löschen
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import Axios from 'axios';

export default defineComponent({
  name: 'Home',
  setup() {
    const projectName = ref('Kronenhöfe');
    const roomMatcher = ref('\\d Zimmer');
    const sizeMatcher = ref('Wohnfläche');
    const loadedFiles = ref([]);
    const files: Ref<File[]> = ref([]);
    const exportedFiles = ref([]);

    async function fetchExportedFiles() {
      const res = await Axios.get('http://localhost:4000/export');
      exportedFiles.value = res.data.files ?? [];
    }

    async function openDirectoryHandle() {
      // @ts-ignore new Chrome File System API
      const dirHandle = await showDirectoryPicker();
      for await (const entry of dirHandle.values()) {
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

      try {
        const res = await Axios.post('http://localhost:4000/pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (res.status === 200) fetchExportedFiles();
        if (res.data.file) {
          createDownloadLink(projectName.value, res.data.file.data);
        }
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

    fetchExportedFiles();

    return {
      projectName,
      roomMatcher,
      sizeMatcher,
      openDirectoryHandle,
      loadedFiles,
      files,
      postData,
      exportedFiles,
      onDeleteAllClick,
    };
  },
});
</script>

<style lang="scss" scoped>
section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1em 2em;
}

.col {
  h2 {
    margin-bottom: 1em;
  }
}

.container__select {
  margin-bottom: 1em;
  display: flex;
  gap: 1em;
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
    margin-bottom: 1em;
  }
}

.exported-files {
  margin-bottom: 1em;
}

.btn--delete {
  &:hover {
    background-color: rgba(220, 20, 60, 0.589);
  }
}
</style>