<template lang="pug">
section.the-pdf-viewer
  h2 PDF Preview
  p.fallback__empty(v-if='previewPDFFile == null') Keine Datei zur Vorschau geladen
  p.file__selected(v-else) 
    small Geladene Datei: {{ previewPDFFile.name }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import usePDFPreview from '../composables/pdf-preview';

export default defineComponent({
  name: 'ThePDFViewer',
  setup: () => {
    const { previewPDFFile } = usePDFPreview();
    return { previewPDFFile };
  },
});
</script>

<style lang="scss" scoped>
h2 {
  text-align: center;
}

.fallback__empty {
  margin: 1em 0;
}
</style>