<template lang="pug">
section.exported-files-display
  h2 Exportierte Dateien
  template(v-if='exportedFiles.length === 0')
    p.fallback-text--empty Keine exportierten Dateien vorhanden.
  template(v-else)
    .exported-files__list
      template(v-for='file in exportedFiles')
        .exported-file
          span {{ file }}
          button.btn--icon.btn--download
            IconSVG(name='download')
    button.btn--delete.btn--delete-all(@click='deleteAllFiles') Alle exportierten Dateien löschen
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import useFileHandler from '../composables/file-handler';
import IconSVG from './vfx/icons/IconSVG.vue';

export default defineComponent({
  name: 'ExportedFilesDisplay',
  components: {
    IconSVG,
  },
  setup: () => {
    const {
      exportedFiles,
      fetchExportedFiles,
      deleteAllFiles,
    } = useFileHandler();
    onMounted(async () => await fetchExportedFiles());
    return { exportedFiles, deleteAllFiles };
  },
});
</script>

<style lang="scss" scoped>
@use '../style/scrollbar' as *;

h2 {
  margin-bottom: 1em;
  text-align: center;
}

.exported-files__list {
  margin-bottom: 1em;
  max-height: 300px;
  padding-right: 1em;
  @include scrollbar(true);

  .exported-file {
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
</style>