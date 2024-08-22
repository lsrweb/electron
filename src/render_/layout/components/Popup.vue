<template>
  <ElDrawer
    title="设置"
    direction="rtl"
    size="500px"
    v-model:model-value="dialogVisible"
    :close-on-click-modal="false"
  >
    <!-- 版本读取目录 -->
    <!-- 配置文件存储目录 -->
    <!-- java 版本 -->
    <ElForm
      :model="form"
      :rules="formRules"
      ref="settingsForm"
      :label-position="'top'"
    >
      <ElFormItem label="版本读取目录" prop="versionPath">
        <ElInput v-model="form.versionPath" placeholder="请输入版本读取目录" />
      </ElFormItem>
      <ElFormItem label="配置文件存储目录" prop="configPath">
        <ElInput
          v-model="form.configPath"
          placeholder="请输入配置文件存储目录"
        />
      </ElFormItem>
      <ElFormItem label="java 路径" prop="javaVersion">
        <ElInput v-model="form.javaVersion" placeholder="请输入java路径" />
      </ElFormItem>
      <Button type="primary" @click.stop="saveSetting">保存</Button>
    </ElForm>
  </ElDrawer>
</template>

<script setup lang="ts">
import Button from "@r/components/Button.vue";
import IpcMainMess from "@r/utils/ipc";

const props = defineProps<{
  dialogVisible: boolean;
  form?: {
    versionPath: string;
    configPath: string;
    javaVersion: string;
  };
}>();

const formRules = {
  versionPath: [
    { required: true, message: "请输入版本读取目录", trigger: "blur" },
  ],
  configPath: [
    { required: true, message: "请输入配置文件存储目录", trigger: "blur" },
  ],
  javaVersion: [{ required: true, message: "请输入java路径", trigger: "blur" }],
};

const { form } = toRefs(props);

const emit = defineEmits(["update:dialogVisible"]);
const dialogVisible = computed({
  get: () => props.dialogVisible,
  set: (val) => emit("update:dialogVisible", val),
});

const settingsForm = ref(null);

function saveSetting() {
  settingsForm.value.validate(async (valid: boolean) => {
    if (valid) {
      await IpcMainMess.sendSync("renderSetting.setGlobalSetting", form.value);
    }
  });
}
</script>

<style scoped></style>
