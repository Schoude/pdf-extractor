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
    ExportedFilesDisplay
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
@use '../style/_media' as *;

.setup {
  @include mq(tablet-landscape) {
    display: grid;
    justify-content: center;
    grid-template-columns: 1fr 1fr;
    gap: 1.5em;
  }
}

.col {
  display: flex;
  flex-direction: column;
  align-items: center;

  & + & {
    margin-top: 1.5em;

    @include mq(laptop) {
      margin-top: 0;
    }
  }

  &__content {
    width: 100%;

    @include mq(laptop) {
      display: grid;
      gap: 1em;
      grid-template-columns: 1fr 1fr;
      gap: 2em;
    }
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

.the-pdf-viewer {
  width: 100%;
  flex: 1;
}
</style>