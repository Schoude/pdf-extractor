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
@use '../../style/media' as *;

.the-header {
  padding: 0.2em 0;
  background-color: #0f0e15;
  height: 65px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;

  @include mq(tablet) {
    padding: 0 8em;
    height: 56px;
  }

  @include mq(laptop) {
    padding: 0 12em;
  }
}

.logo {
  display: flex;
  align-items: center;
  cursor: default;
  user-select: none;

  h1 {
    font-weight: 300;
    font-size: 1.1rem;

    @include mq(laptop) {
      font-size: 1.3rem;
    }
  }

  * + * {
    margin-left: 0.4em;
  }
}

nav {
  display: flex;
  a + a {
    margin-left: 1.5em;
  }

  @include mq(tablet) {
    margin-left: auto;
  }
}

.pdf-file {
  fill: $color-accent;
}
</style>