<template lang="pug">
.extraction-options-actions
  button.btn__directory-picker(@click='openDirectoryHandle')
    | PDFs Ordner auswählen
    MBRipple
  template(v-if='files.length > 0')
    button.btn--delete(@click='clearFiles')
      | Dateien leeren
      MBRipple
  template(v-if='files.length > 0')
    button.btn--submit(
      type='submit',
      form='extract-data',
      :disabled='isLoading'
    ) 
      | PDFs abschicken ({{ files.length }})
      MBRipple
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useFileHandler from '../composables/file-handler';
import MBRipple from './vfx/MBRipple.vue';

export default defineComponent({
  name: 'ExtractionOptionsActions',
  components: {
    MBRipple,
  },
  setup: () => {
    const { files, clearFiles, isLoading } = useFileHandler();

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

    return {
      openDirectoryHandle,
      files,
      isLoading,
      clearFiles,
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