<template lang="pug">
.csv-renderer
  p.csv-name {{ csvData.name }}
  .csv-renderer__content
    .csv-headers
      template(v-for='cell in csvData.headers')
        span.csv-cell {{ cell }}
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CSVData } from '../types/csv-renderer';

export default defineComponent({
  name: 'CSVRenderer',
  props: {
    csvData: {
      type: Object as PropType<CSVData>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.csv-renderer__content {
  width: max-content;
}

.csv-headers {
  border: 2px solid white;
  .csv-cell + .csv-cell {
    border-left: 2px solid white;
  }
}

.csv-cell {
  line-height: 1.2;
  padding: 0.5em;
  display: inline-block;
  min-width: 200px;
}
</style>