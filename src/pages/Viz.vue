<template lang="pug">
section.viz Viz
  div
    div(v-for='file of filesData') {{ file }}
    div Mean size: <code>{{ meanFileSize }} KB</code>
</template>

<script lang="ts">
import * as d3 from "d3";
import { computed, defineComponent } from 'vue';
import useFileHandler from '../composables/file-handler';

export default defineComponent({
  name: 'Viz',
  setup: () => {
    const { files } = useFileHandler();
    const filesData = computed(() =>
      files.value.map((file) => ({ name: file.name, size: file.size }))
    );
    const meanFileSize = computed(() => {
      const sum = files.value.reduce((acc, file) => {
        return acc + file.size / 1000;
      }, 0);
      return Math.round(sum / files.value.length);
    });
    return { filesData, meanFileSize };
  },
});
</script>

<style lang="sass" scoped>
.viz
</style>