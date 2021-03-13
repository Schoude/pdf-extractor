<template lang="pug">
ul.loaded-files-list
  template(v-for='file of files')
    li.loaded-files-list__list-item
      button.btn--icon.btn--pdf-viewer(title='Als PDF ansehen', type='button')
        IconSVG(name='eye')
      span.text {{ file.name }}
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import IconSVG from '../../vfx/icons/IconSVG.vue';

export default defineComponent({
  name: 'LoadedFilesList',
  components: {
    IconSVG,
  },
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

  .loaded-files-list__list-item {
    display: flex;
    align-items: center;
    list-style: none;

    .text {
      margin-left: 1em;
    }

    & + .loaded-files-list__list-item {
      margin-top: 1em;
    }
  }
}
</style>