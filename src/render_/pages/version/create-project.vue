<template>
  <ElDrawer v-model:model-value="dialogVisible" :title="`添加项目${version}`" direction="rtl" size="500px">123 </ElDrawer>
</template>

<script setup lang="ts">
const emit = defineEmits(["update:visible"]);

const props = withDefaults(
  defineProps<{
    visible: boolean;
    version: string;
  }>(),
  {
    visible: false,
    version: "",
  }
);

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => {
    emit("update:visible", val);
  },
});
</script>

<style scoped></style>
