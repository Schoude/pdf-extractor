<template lang="pug">
TheHeader
RouterView.page
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TheHeader from './components/layout/TheHeader.vue';

export default defineComponent({
  name: 'App',
  components: {
    TheHeader,
  },
});
</script>

<style lang="scss">
@use '../src/style/media' as *;

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.page {
  padding: 1em 0.5em;

  @include mq(laptop) {
    padding: 1em 4em;
  }
}
</style>