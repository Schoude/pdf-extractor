<template lang="pug">
main.setup
  .col
    h2 Extrahierungs-Optionen
    .col__content
      ExtractionOptionsEditor
      .container.container__select
        ExtractionOptionsActions
        .container(v-if='files.length > 0')
          h3 {{ files.length }} Dateien geladen
          LoadedFilesList(:files='files')
  .col
    ExportedFilesDisplay(:projectName='projectName')
    ThePDFViewer
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useFileHandler from '../composables/file-handler';
import ExportedFilesDisplay from '../components/ExportedFilesDisplay.vue';
import ExtractionOptionsEditor from '../components/ExtractionOptionsEditor.vue';
import LoadedFilesList from '../components/layout/lists/LoadedFilesList.vue';
import useExtractionOptions from '../composables/extraction-options';
import ExtractionOptionsActions from '../components/ExtractionOptionsActions.vue';
import ThePDFViewer from '../components/ThePDFViewer.vue';

export default defineComponent({
  name: 'Setup',
  components: {
    ExtractionOptionsEditor,
    ExtractionOptionsActions,
    LoadedFilesList,
    ExportedFilesDisplay,
    ThePDFViewer,
  },
  setup: () => {
    const { files } = useFileHandler();
    const { projectName } = useExtractionOptions();

    return {
      files,
      projectName,
    };
  },
});
</script>

<style lang="scss" scoped>
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

.exported-files-display {
  margin-bottom: 1em;
}
</style>