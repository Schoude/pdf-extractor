<template lang="pug">
section.viz
  .viz-box.viz-box__file-size
    h1 Dateigrößen im Vergleich
</template>

<script lang="ts">
import { select } from 'd3-selection';
import { max } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';

import { computed, defineComponent, onMounted } from 'vue';
import useFileHandler from '../composables/file-handler';

export default defineComponent({
  name: 'Viz',
  setup: () => {
    const margin = { top: 20, right: 0, bottom: 40, left: 80 };
    const height = 600;
    const width = 800;
    const { files } = useFileHandler();
    const filesData = computed(() =>
      files.value.map((file) => ({ name: file.name, value: file.size }))
    );
    const meanFileSize = computed(() => {
      const sum = files.value.reduce((acc, file) => {
        return acc + file.size / 1000;
      }, 0);
      return Math.round(sum / files.value.length);
    });

    function renderBarChart() {
      const svg = select('.viz-box__file-size').append('svg');
      svg.attr(
        'viewBox',
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      );

      const xScale = scaleBand()
        .domain(filesData.value.map((d) => d.name))
        .range([margin.left, width - margin.right])
        .padding(0.15);

      const yScale = scaleLinear()
        // @ts-ignore
        .domain([0, max(filesData.value, (d) => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      // @ts-ignore
      svg
        .attr('class', `bar-chart`)
        .attr('width', width + margin.left)
        .attr('height', height + margin.bottom + margin.top)
        .append('g')
        .selectAll('rect')
        .data(filesData.value)
        .join('rect')
        .style('fill', '#73ba9b')
        .attr('x', (d) => xScale(d.name))
        .attr('y', (d) => yScale(d.value))
        .attr('height', (d) => yScale(0) - yScale(d.value))
        .attr('width', xScale.bandwidth());

      // @ts-ignore
      const xAxis = (g) =>
        g
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(axisBottom(xScale).tickSizeOuter(0));

      // @ts-ignore
      const yAxis = (g) =>
        g
          .attr('transform', `translate(${margin.left},0)`)
          .call(axisLeft(yScale).tickFormat((val) => `${val / 1000} KB`))
          // @ts-ignore
          .call((g) => g.select('.domain').remove());

      svg.append('g').attr('class', 'axis axis__x').call(xAxis);

      svg.append('g').attr('class', 'axis axis__y').call(yAxis);
    }

    onMounted(() => renderBarChart());

    return { filesData, meanFileSize, height, width };
  },
});
</script>

<style lang="scss">
.viz {
  padding: 2em;
}

.viz-box {
  h1 {
    margin-left: 30px;
  }
}

.axis {
  text {
    font-size: 0.8rem;
  }

  &__x {
    text {
      transform: translateY(5%) translateX(-4%) rotate(-45deg);
    }
  }
}
</style>