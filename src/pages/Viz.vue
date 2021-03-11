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
import { line } from 'd3-shape';
import { transition } from 'd3-transition';
import { easeLinear } from 'd3-ease';
// workaround to get selection.transition() working
// if 'transition' is no under the same namespace as 'select',
// then transition() is missing on the selection prototype
const d3 = {
  select,
  max,
  scaleLinear,
  scaleBand,
  axisBottom,
  axisLeft,
  line,
  transition,
  easeLinear,
};

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
        return acc + file.size;
      }, 0);
      return Math.round(sum / files.value.length);
    });

    function renderBarChart() {
      const svg = d3.select('.viz-box__file-size').append('svg');
      svg.attr(
        'viewBox',
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      );

      const tooltip = select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      const xScale = scaleBand()
        .domain(filesData.value.map((d) => d.name))
        .range([margin.left, width - margin.right])
        .padding(0.15);

      const xScaleMean = scaleBand()
        .domain(filesData.value.map((d) => d.name))
        .range([margin.left, width + margin.right + margin.left])
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
        .attr('class', 'bar')
        .attr('x', (d) => xScale(d.name))
        .attr('width', () => xScale.bandwidth())
        .attr('y', () => yScale(0))
        .attr('height', () => 0)
        .on('mouseover', function (e, data) {
          console.log(e);

          select(this).style('fill', '#2e8c63');
          tooltip
            // @ts-ignore
            .text(`${data.value / 1000} KB`)
            .style('opacity', 0.8)
            .style('left', e.clientX + 0 + 'px')
            .style('top', e.clientY - 50 + 'px');
        })
        .on('mousemove', function (e, data) {
          tooltip
            // @ts-ignore
            .text(`${data.value / 1000} KB`)
            .style('opacity', 0.86)
            .style('left', e.clientX + 0 + 'px')
            .style('top', e.clientY - 50 + 'px');
        })
        .on('mouseout', function () {
          tooltip.style('opacity', 0);
          select(this).style('fill', '#73ba9b');
        })
        .transition()
        .duration(800)
        .delay(() => Math.random() * 500)
        .attr('y', (d) => yScale(d.value))
        .attr('height', (d) => yScale(0) - yScale(d.value));

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

      const lineAvg = line()
        // @ts-ignore
        .x((d) => {
          // @ts-ignore
          return xScaleMean(d.name);
        })
        .y(() => yScale(meanFileSize.value));

      svg
        .append('path')
        .datum(filesData.value)
        .attr('class', 'mean')
        // @ts-ignore
        .attr('d', lineAvg)
        .on('mouseover', function (e) {
          select(this)
            .style('stroke-width', '5px')
            .style('stroke-opacity', '0.8');

          tooltip
            // @ts-ignore
            .text(`Ø ${meanFileSize.value / 1000} KB`)
            .style('opacity', 0.8)
            .style('left', e.clientX + 0 + 'px')
            .style('top', e.clientY - 50 + 'px');
        })
        .on('mousemove', function (e) {
          tooltip
            // @ts-ignore
            .text(`Ø ${meanFileSize.value / 1000} KB`)
            .style('opacity', 0.86)
            .style('left', e.clientX + 0 + 'px')
            .style('top', e.clientY - 50 + 'px');
        })
        .on('mouseout', function () {
          tooltip.style('opacity', 0);
          select(this)
            .style('stroke-width', '2px')
            .style('stroke-opacity', '0.5');
        })
        .attr('stroke-dasharray', function () {
          return this.getTotalLength() + ' ' + this.getTotalLength();
        })
        .attr('stroke-dashoffset', function () {
          return this.getTotalLength();
        })
        .transition()
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)
        .duration(800);
    }

    onMounted(() => renderBarChart());

    return { filesData, meanFileSize, height, width };
  },
});
</script>

<style lang="scss">
@use '../style/style' as *;

.viz {
  padding: 2em;
}

.viz-box {
  h1 {
    margin-left: 30px;
  }
}

.bar {
  transition: fill 0.3s ease;
  fill: #73ba9b;
}

.mean {
  stroke-width: 3px;
  transition: stroke-width 0.3s ease;
  stroke: $color-danger;
  stroke-opacity: 0.5;
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

.tooltip,
.tooltip__avg {
  position: absolute;
  text-align: left;
  width: auto;
  height: auto;
  padding: 0.5em;
  font-size: 16px;
  font-weight: 600;
  background: rgb(187, 187, 187);
  border-radius: 0px;
  pointer-events: none;
  color: rgb(27, 27, 27);
}
</style>