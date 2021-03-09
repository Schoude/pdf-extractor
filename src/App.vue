<template lang="pug">
nav
  h1 PDF UNIT DATA EXTRACTOR
RouterView
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  img {
    display: inline;
  }
}

nav {
  background-color: #333;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;

  * + * {
    margin-left: 1em;
  }
}
</style>