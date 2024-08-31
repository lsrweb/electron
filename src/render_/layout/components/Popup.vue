<template>
  <ElDrawer title="设置" direction="rtl" size="500px" v-model:model-value="dialogVisible" v-if="dialogVisible" :close-on-click-modal="false">
    <!-- 版本读取目录 -->
    <!-- 配置文件存储目录 -->
    <!-- java 版本 -->
    <ElForm v-model="form" :model="form" :rules="formRules" ref="settingsForm" :label-position="'top'">
      <!-- 配置文件存储目录 STORE_PATH -->
      <ElFormItem label="配置文件存储目录" prop="APP_HOME_CACHE_PATH">
        <ElInput v-model="form.APP_HOME_CACHE_PATH" placeholder="请输入配置文件存储目录" />
      </ElFormItem>

      <ElFormItem label="读取目录" prop="UNI_BUILD_VERSION_MANAGER_PATH">
        <ElInput v-model="form.UNI_BUILD_VERSION_MANAGER_PATH" placeholder="请输入版本读取目录" />
      </ElFormItem>
      <!-- <ElFormItem label="配置文件存储目录" prop="configPath">
        <ElInput
          v-model="form.configPath"
          placeholder="请输入配置文件存储目录" 
        />
      </ElFormItem> -->
      <!-- <ElFormItem label="Java1.8 jdk dir" prop="javaVersion">
        <ElInput v-model="form.javaVersion" placeholder="请输入java路径" />
      </ElFormItem> -->

      <!-- <ElAlert
        type="success"
        show-icon
        :closable="false"
        class="!mt-2"
        :description="'解压jdk1.8.0_201版本'"
      >
      </ElAlert> -->
    </ElForm>

    <Button type="primary" @click.stop="saveSetting" class="mt-2">保存</Button>
  </ElDrawer>
</template>

<script setup lang="ts">
import Button from "@r/components/Button.vue";
import IpcMainMess from "@r/utils/ipc";
import { ElNotification } from "element-plus";

const props = defineProps<{
  dialogVisible: boolean;
}>();

watch(
  () => props.dialogVisible,
  async (val) => {
    if (val) {
      // 初始化之前先读取已有配置
      form.value = await IpcMainMess.sendSync("cache.getData");
      console.log(form.value);
    }
  }
);

const formRules = {
  APP_HOME_CACHE_PATH: [{ required: true, message: "请输入配置文件存储目录", trigger: "blur" }],
  UNI_BUILD_VERSION_MANAGER_PATH: [{ required: true, message: "请输入版本读取目录", trigger: "blur" }],
};

const form = ref({
  APP_HOME_CACHE_PATH: "",
  UNI_BUILD_VERSION_MANAGER_PATH: "",
});

const emit = defineEmits(["update:dialogVisible"]);
const dialogVisible = computed({
  get: () => props.dialogVisible,
  set: (val) => emit("update:dialogVisible", val),
});

const settingsForm = ref(null);

function saveSetting() {
  settingsForm.value.validate(async (valid: boolean) => {
    if (valid) {
      await IpcMainMess.sendSync("cache.setData", form.value);
      await nextTick();
      ElNotification({
        title: "成功",
        message: "保存成功",
        type: "success",
        position: "bottom-right",
      });
      dialogVisible.value = false;
    }
  });
}
</script>

<style scoped></style>
