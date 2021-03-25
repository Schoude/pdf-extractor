<template lang="pug">
.mb-select(
  ref='rootEl',
  role='button',
  tabindex='0',
  @click='toggleList',
  @keyup.enter='toggleList',
  @keyup.space='toggleList'
)
  .selected-item {{ selectedItem.label }}
  transition(name='fade')
    .mb-select__list(v-if='listVisible')
      template(v-for='(item, index) of items', :key='index')
        .mb-select__list-item(
          :class='{ selected: item.value === selectedItem.value }',
          role='button',
          tabindex='0',
          :aria-label='item.label',
          @click.stop='onItemSelectClick(item)'
        ) {{ item.label }}
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  PropType,
  Ref,
  ref,
  watch,
} from 'vue';
import { MBSelectItem } from '../../types/mb-select';

export default defineComponent({
  name: 'MBSelect',
  emits: ['select-changed', 'update:modelValue'],
  props: {
    items: {
      type: Array as PropType<MBSelectItem[]>,
      required: true,
    },
    modelValue: {
      type: [String, Number, Boolean] as PropType<string | number | boolean>,
      default: null,
    },
  },
  setup: (props, { emit }) => {
    const rootEl: Ref<HTMLElement | null> = ref(null);
    const selectedItem: Ref<MBSelectItem> = ref({
      label: 'Keine Auswahl',
      value: '',
    });
    const listVisible = ref(false);

    function init() {
      selectedItem.value = props.items[0];
      emit('update:modelValue', props.items[0].value);
    }

    function initWithModelValue() {
      const foundItem = props.items.find(
        (item) => item.value === props.modelValue
      ) as MBSelectItem;
      selectedItem.value = foundItem;
    }

    function toggleList() {
      listVisible.value = !listVisible.value;
    }

    function onItemSelectClick(newSelectedItem: MBSelectItem) {
      selectedItem.value = newSelectedItem;
      emit('update:modelValue', newSelectedItem.value);
      emit('select-changed', newSelectedItem);
      toggleList();
    }

    function handleClickOutside(e: MouseEvent) {
      if (!(rootEl.value as HTMLElement).contains(e.target as Node)) {
        listVisible.value = false;
      }
    }

    watch(listVisible, (newVal) => {
      if (newVal === true) {
        document.body.addEventListener('click', handleClickOutside);
      } else if (newVal === false) {
        document.body.removeEventListener('click', handleClickOutside);
      }
    });

    onBeforeMount(() => {
      if (props.modelValue == null) {
        init();
      } else {
        initWithModelValue();
      }
    });

    onBeforeUnmount(() => {
      document.body.removeEventListener('click', handleClickOutside);
    });

    return {
      rootEl,
      selectedItem,
      listVisible,
      toggleList,
      onItemSelectClick,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '../../style/colors' as *;
@use '../../style/_media' as *;

.mb-select {
  padding: 7px;
  background-color: #fff;
  color: #02010a;
  position: relative;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.25s ease;
  @include mq(laptop) {
    padding: 14px 10px;
  }

  &:focus {
    outline: none;
  }

  &:hover,
  &:focus {
    background-color: #ddd;
  }
}

.mb-select__list {
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 6px 0;
  border-radius: 4px;
  max-height: 300px;
  overflow: auto;
  @include mq(laptop) {
    padding: 12px 0;
  }
}

.mb-select__list-item {
  color: #02010a;
  outline: none;
  padding: 10px;
  transition: background-color 0.25s ease, color 0.25s ease;
  @include mq(laptop) {
    padding: 14px;
  }

  &.selected {
    background-color: rgba(#02010a, 0.7);
    color: $color-accent;

    &:hover,
    &:focus {
      color: $color-accent;
    }
  }

  &:hover,
  &:focus {
    background-color: rgba(#02010a, 0.85);
    color: whitesmoke;
  }
}
</style>