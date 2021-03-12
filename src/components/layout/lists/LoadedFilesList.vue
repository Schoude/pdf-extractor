<template lang="pug">
ul.loaded-files-list
  template(v-for='file of files')
    li.loaded-files-list__list-item {{ file.name }}
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'LoadedFilesList',
  props: {
    files: {
      type: Array as PropType<File[]>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@use '../../../style/scrollbar' as *;

.loaded-files-list {
  font-weight: 300;
  max-height: 500px;
  overflow: auto;
  padding-inline-start: 0;
  padding-left: 0;
  @include scrollbar(true);

  li {
    list-style: none;
  }
}
</style>