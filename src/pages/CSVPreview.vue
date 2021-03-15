<template lang="pug">
section.csv-preview 
  h2 Wähle eine CSV-Datei aus um ihren Inhalt anzuzeigen
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
import useCSVRenderer from '../composables/csv-renderer';
import useFileHandler from '../composables/file-handler';

export default defineComponent({
  name: 'CSVPreview',
  setup: () => {
    const { exportedFiles } = useFileHandler();
    const { selectedCSV, fetchFileData } = useCSVRenderer();

    onBeforeMount(async () => {
      if (selectedCSV.name === '') {
        await fetchFileData(exportedFiles.value[0]);
      }
    });
  },
});
</script>

<style lang="sass" scoped>
</style>