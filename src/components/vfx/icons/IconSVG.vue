<template lang="pug">
svg.icon-svg(
  xmlns='http://www.w3.org/2000/svg',
  aria-hidden='true',
  focusable='false',
  :fill='color',
  :width='width',
  :viewBox='selectedIcon.viewBox',
  style='display: inline-block'
)
  template(v-for='path of selectedIcon.paths')
    path(:d='path.d', :class='path.class')
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import icons, { SVGIconNames } from './icon-paths';

export default defineComponent({
  name: 'IconSVG',
  props: {
    name: {
      type: String as PropType<SVGIconNames>,
      required: true,
    },
    color: {
      type: String,
      default: 'black',
    },
    width: {
      type: String,
      default: '20',
    },
  },
  setup: (props) => {
    const selectedIcon = computed(() => {
      return icons[props.name];
    });
    return { selectedIcon };
  },
});
</script>

<style lang="scss" scoped>
.icon-path--primary {
  opacity: 1;
}

.icon-path--secondary {
  opacity: 0.4;
}
</style>