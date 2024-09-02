<template>
  <ElDrawer :title="title" :direction="direction" :size="size" v-model:model-value="visable" :close-on-click-modal="false">
    <div class="p-2">
      <slot></slot>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
const emit = defineEmits(["update:modelValue"]);

const props = withDefaults(
  defineProps<{
    dialogVisible?: boolean;
    title?: string;
    direction?: "rtl" | "ltr";
    size?: string;
  }>(),
  {
    dialogVisible: false,
    title: "(⊙o⊙)…我是默认标题",
    direction: "rtl",
    size: "500px",
  }
);

const visable = computed({
  get: () => props.dialogVisible,
  set: (value) => emit("update:modelValue", value),
});
</script>

<style scoped></style>
