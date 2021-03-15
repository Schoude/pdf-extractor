<template lang="pug">
section.csv-preview 
  h2 Wähle eine CSV-Datei aus, um ihren Inhalt anzuzeigen
  CSVRenderer(:csvData='selectedCSV')
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
import CSVRenderer from '../components/CSVRenderer.vue';
import useCSVRenderer from '../composables/csv-renderer';
import useFileHandler from '../composables/file-handler';

export default defineComponent({
  name: 'CSVPreview',
  components: {
    CSVRenderer,
  },
  setup: () => {
    const { exportedFiles } = useFileHandler();
    const { selectedCSV, fetchFileData } = useCSVRenderer();

    onBeforeMount(async () => {
      if (selectedCSV.name === '' || selectedCSV.headers.length === 0) {
        await fetchFileData(exportedFiles.value[0]);
      }
    });

    return { selectedCSV };
  },
});
</script>

<style lang="sass" scoped>
</style>