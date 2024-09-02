<template>
  <div class="view">
    <el-tabs :tab-position="'left'" v-model="modelSelect" class="h-full" stretch>
      <el-tab-pane v-for="(item, index) in labelArray" :key="index" :label="item"> </el-tab-pane>
      <RouterView> </RouterView>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();

const modelSelect = ref<string>("0");

const labelArray = ["Java设置", "Gradle设置", "密钥设置", "环境变量管理"] as const;
const pathArray: string[] = ["setting-java", "setting-gradle", "secret-genderal", "senv-manager"] as const;

watch(
  () => modelSelect.value,
  (val) => {
    router.push({ path: pathArray[Number(val)] });
  }
);
</script>

<style scoped></style>
