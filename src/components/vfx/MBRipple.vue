<template lang="pug">
.mb-ripple(ref='ripple')
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue';

export default defineComponent({
  name: 'MBRipple',
  props: {
    centered: {
      type: Boolean,
    },
  },
  setup(props) {
    const ripple: Ref<HTMLElement | null> = ref(null);
    const rippleDot = document.createElement('span');
    rippleDot.classList.add('mb-ripple__animation');

    function setRippleEm() {
      const longerSide =
        (ripple.value as HTMLElement).offsetWidth >
        (ripple.value as HTMLElement).offsetHeight
          ? (ripple.value as HTMLElement).offsetWidth
          : (ripple.value as HTMLElement).offsetHeight;
      rippleDot.style.width = `${Math.ceil(longerSide / 40)}px`;
      rippleDot.style.height = `${Math.ceil(longerSide / 40)}px`;

      (ripple.value as HTMLElement).addEventListener('click', (e) => {
        if (props.centered) {
          (rippleDot as HTMLElement).style.left = '50%';
          (rippleDot as HTMLElement).style.top = '50%';
          (rippleDot as HTMLElement).style.transform = `translate(-50%, -50%)`;
        } else {
          const x =
            e.pageX - (e.target as HTMLElement).getBoundingClientRect().left;
          const y =
            e.pageY - (e.target as HTMLElement).getBoundingClientRect().top;
          (rippleDot as HTMLElement).style.left = `${x}px`;
          (rippleDot as HTMLElement).style.top = `${y}px`;
        }
        (ripple.value as HTMLElement).appendChild(rippleDot);
      });
    }
    onMounted(() => {
      setRippleEm();
    });

    return {
      ripple,
    };
  },
});
</script>

<style lang="scss">
.mb-ripple {
  border-radius: inherit;
  width: 100%;
  height: 100%;
  contain: strict;
  color: inherit;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
}

@keyframes ripple {
  100% {
    transform: scale(100);
    opacity: 0;
  }
}

.mb-ripple__animation {
  position: absolute;
  border-radius: 50%;
  display: inline-block;
  transform: scale(1);
  opacity: 0.33;
  pointer-events: none;
  background-color: white;
  animation: ripple 1s ease-out forwards;
}
</style>
