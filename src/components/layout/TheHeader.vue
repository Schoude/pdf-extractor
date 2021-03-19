<template lang="pug">
header.the-header
  .logo
    IconSVG.pdf-file(name='file-pdf', color='green', width='18')
    h1 PDF Unit Data Extractor
  nav
    router-link.router-link(to='/') Setup
    router-link.router-link.route-viz(
      :class='{ disabled: !filesLoaded }',
      to='/viz'
    ) Viz
    router-link.router-link.route-csv(
      :class='{ disabled: exportedFiles.length === 0 }',
      to='/csv'
    ) CSV-Preview
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useFileHandler from '../../composables/file-handler';
import IconSVG from '../vfx/icons/IconSVG.vue';

export default defineComponent({
  name: 'TheHeader',
  components: {
    IconSVG,
  },
  setup: () => {
    const { filesLoaded, exportedFiles } = useFileHandler();
    return {
      filesLoaded,
      exportedFiles,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '../../style/colors' as *;

.the-header {
  background-color: #0f0e15;
  height: 56px;
  padding: 0 12em;
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  cursor: default;
  user-select: none;

  h1 {
    font-weight: 300;
    font-size: 1.3rem;
  }

  * + * {
    margin-left: 0.4em;
  }
}

nav {
  margin-left: auto;
  display: flex;
  a + a {
    margin-left: 1.5em;
  }
}

.pdf-file {
  fill: $color-accent;
}
</style>