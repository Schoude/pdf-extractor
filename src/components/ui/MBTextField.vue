<template lang="pug">
.mb-text-field
  .mb-text-field__control(:class='{ "has-value": hasValue }')
    label(:for='$attrs.name')
      slot(name='label')
    .mb-text-field__input-wrapper
      input(
        v-bind='$attrs',
        :value='modelValue',
        @input='$emit("update:modelValue", $event.target.value)'
      )
      transition(name='fade')
        button.btn--text-field.btn--text-field__clear(
          v-if='hasValue',
          type='button',
          tabindex='-1',
          title='Eingabe löschen',
          @click='onClearClick'
        )
          IconSVG(name='times', color='whitesmoke', width='15')
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import IconSVG from '../vfx/icons/IconSVG.vue';

export default defineComponent({
  name: 'MBTextField',
  emits: ['update:modelValue'],
  components: {
    IconSVG,
  },
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
      default: '',
    },
  },
  setup: (props, { emit }) => {
    const hasValue = computed(() => props.modelValue !== '');
    function onClearClick() {
      emit('update:modelValue', '');
    }
    return { hasValue, onClearClick };
  },
});
</script>

<style lang="scss" scoped>
@use '../../style/colors' as *;

.mb-text-field {
  border: 1px solid rgba(255, 255, 255, 0.336);
  transition: all 0.2s ease;

  &:hover,
  &:focus-within {
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  &:focus-within {
    background: rgba($color-accent, 0.12);
  }
}

.mb-text-field__control {
  position: relative;
  display: flex;
  align-items: center;
  cursor: text;
  transition: all 0.3s ease;
  padding-left: 0.5em;

  &:focus-within,
  &.has-value {
    label {
      transform: translateY(-36px) translateX(-8px);
      font-size: 0.8rem;
    }
  }
}

label {
  position: absolute;
  left: 8px;
  line-height: 1;
  transition: all 0.3s ease;
  pointer-events: none;
  font-weight: 600;
}

.mb-text-field__input-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
}

input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.5em 0;
  background-color: transparent;
  font-weight: 500;
  color: whitesmoke;
}

.btn--text-field {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em;
  align-self: stretch;
  border: none;
  background-color: transparent;

  &:hover,
  &:focus {
    background-color: transparent;
  }
}
</style>