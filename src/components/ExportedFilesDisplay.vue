<template lang="pug">
section.exported-files-display
  h2 Exportierte Dateien
  template(v-if='exportedFiles.length === 0')
    p.fallback-text--empty Keine exportierten Dateien vorhanden.
  template(v-else)
    .exported-files__list
      template(v-for='filename in exportedFiles')
        .exported-file
          span {{ filename }}
          button.btn--icon.btn--download(
            @click='downloadFile(filename)',
            title='Datei herunterladen'
          )
            IconSVG(name='download')
          button.btn--icon.btn--delete.btn--delete--single(
            @click='deleteSingleFile(filename)',
            title='Datei löschen'
          )
            IconSVG(name='trash-alt')
    button.btn--delete.btn--delete-all(@click='deleteAllFiles') Alle exportierten Dateien löschen
</template>

<script lang="ts">
import Axios from 'axios';
import { defineComponent, onMounted } from 'vue';
import useFileHandler from '../composables/file-handler';
import IconSVG from './vfx/icons/IconSVG.vue';

export default defineComponent({
  name: 'ExportedFilesDisplay',
  components: {
    IconSVG,
  },
  props: {
    projectName: {
      type: String,
      required: true,
      default: 'sample project',
    },
  },
  setup: (props) => {
    const {
      exportedFiles,
      fetchExportedFiles,
      deleteAllFiles,
    } = useFileHandler();

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

    async function downloadFile(filename: string) {
      try {
        const res = await Axios.get(
          `http://localhost:4000/download/${filename}`
        );
        if (res.status === 200)
          createDownloadLink(props.projectName, res.data.file.data);
      } catch (error) {
        return;
      }
    }

    async function deleteSingleFile(filename: string) {
      try {
        const res = await Axios.delete(
          `http://localhost:4000/delete/${filename}`
        );
        if (res.status === 200) {
          await fetchExportedFiles();
        }
      } catch (error) {
        return;
      }
    }

    onMounted(async () => await fetchExportedFiles());
    return {
      exportedFiles,
      deleteAllFiles,
      downloadFile,
      deleteSingleFile,
    };
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