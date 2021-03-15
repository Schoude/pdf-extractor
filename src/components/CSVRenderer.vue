<template lang="pug">
.csv-renderer
  p.csv-name {{ csvData.name }}
  .csv-renderer__content
    .csv-headers
      template(v-for='cell in csvData.headers')
        span.csv-cell {{ cell }}
    .csv-rows
      template(v-for='row in csvData.rows.sort()')
        .csv-row
          template(v-for='cell in row')
            span.csv-cell(:title='cell') {{ cell ? cell : "&nbsp;" }}
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
  display: flex;
  .csv-cell + .csv-cell {
    border-left: 2px solid white;
  }
}

.csv-rows {
  border: 1px solid white;
}

.csv-row {
  display: flex;
}

.csv-cell {
  line-height: 1.2;
  padding: 0.5em;
  display: inline-block;
  width: 250px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  & + .csv-cell {
    border-left: 1px solid white;
  }
}
</style>