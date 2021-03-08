<template lang="pug">
section.home
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
  .container
    button(@click.prevent()='openDirectoryHandle') PDFs auswählen
  .container(v-if='loadedFiles.length > 0')
    div(v-for='filename of loadedFiles') {{ filename }}

  .container(v-if='files.length > 0')
    button(@click.prevent='postData') PDFs abschicken
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import Axios from 'axios';

export default defineComponent({
  name: 'Home',
  setup: () => {
    const projectName = ref('Kronenhöfe');
    const roomMatcher = ref('\\d Zimmer');
    const sizeMatcher = ref('Wohnfläche');
    const loadedFiles = ref([]);
    const files: Ref<File[]> = ref([]);

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

      console.log(Array.from(formData.entries()));
      await Axios.post('http://localhost:4000/pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    return {
      projectName,
      roomMatcher,
      sizeMatcher,
      openDirectoryHandle,
      loadedFiles,
      files,
      postData,
    };
  },
});
</script>

<style lang="scss" scoped>
section {
  margin-top: 2em;
}

.container {
  margin: 0 auto;
  width: min-content;
}

.form-field {
  & + .form-field {
    margin-top: 1em;
  }

  label,
  input {
    display: block;
  }
}
</style>