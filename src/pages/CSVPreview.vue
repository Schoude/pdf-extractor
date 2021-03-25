<template lang="pug">
section.csv-preview 
  h2 Wähle eine CSV-Datei aus, um ihren Inhalt anzuzeigen
  MBSelect(
    v-model='selectedCSV.name',
    :items='selectItems',
    @select-changed='updateCSV'
  )
  CSVRenderer(:csvData='selectedCSV')
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount } from 'vue';
import CSVRenderer from '../components/CSVRenderer.vue';
import MBSelect from '../components/ui/MBSelect.vue';
import useCSVRenderer from '../composables/csv-renderer';
import useFileHandler from '../composables/file-handler';

export default defineComponent({
  name: 'CSVPreview',
  components: {
    MBSelect,
    CSVRenderer,
  },
  setup: () => {
    const { exportedFiles } = useFileHandler();
    const { selectedCSV, fetchFileData } = useCSVRenderer();

    onBeforeMount(async () => {
      if (selectedCSV.name === '') {
        await fetchFileData(exportedFiles.value[0]);
      } else {
        await fetchFileData(selectedCSV.name);
      }
    });

    const selectItems = computed(() =>
      exportedFiles.value.map((fileName) => ({
        label: fileName,
        value: fileName,
      }))
    );

    async function updateCSV(item: { label: string; value: string }) {
      await fetchFileData(item.value);
    }

    return { selectedCSV, selectItems, updateCSV };
  },
});
</script>

<style lang="scss" scoped>
@use '../style/media' as *;

h2 {
  font-size: 1.2rem;
  @include mq(laptop) {
    font-size: revert;
  }
}

.mb-select {
  margin: 1.5em 0;

  @include mq(laptop) {
    width: 350px;
  }

  &:deep(.selected-item) {
    font-weight: 600;
  }
}
</style>