<template>
  <Dialog v-model="visible" title="生成密钥库">
    <ElForm :model="form" label-width="84px" :rules="formRules" v-model="form" ref="ElFormRef">
      <ElFormItem label="秘钥名称" prop="keystore">
        <ElInput v-model="form.keystore" placeholder="请输入秘钥名称" />
      </ElFormItem>
      <ElFormItem label="别名" prop="alias">
        <ElInput v-model="form.alias" placeholder="请输入证书别名" />
      </ElFormItem>
      <ElFormItem label="有效期" prop="validity">
        <ElInput v-model="form.validity" placeholder="请选择有效期" />
      </ElFormItem>
      <ElFormItem label="存储密码" prop="storepass">
        <ElInput v-model="form.storepass" placeholder="请输入存储密码" show-password maxlength="6" />
      </ElFormItem>
      <ElFormItem label="秘钥密码" prop="keypass">
        <ElInput v-model="form.keypass" placeholder="请输入秘钥密码" show-password maxlength="6" />
      </ElFormItem>
      <!-- 分割线 -->
      <div class="mb-4 flex justify-between items-center w-full border-b border-gray-300 pb-3">
        <span class="text-gray-500">证书信息</span>
        <Button type="button" @click="generalInfo()">随机生成</Button>
      </div>
      <!-- CN=www.test.com,OU=ID,O=TEST,L=BJ,ST=BJ,C=CN  -->
      <ElFormItem label="CN" prop="CN">
        <ElInput v-model="form.CN" placeholder="请输入 CN" />
      </ElFormItem>
      <ElFormItem label="OU" prop="OU">
        <ElInput v-model="form.OU" placeholder="请输入 OU" />
      </ElFormItem>
      <ElFormItem label="O" prop="O">
        <ElInput v-model="form.O" placeholder="请输入 O" />
      </ElFormItem>
      <ElFormItem label="L" prop="L">
        <ElInput v-model="form.L" placeholder="请输入 L" />
      </ElFormItem>
      <ElFormItem label="ST" prop="ST">
        <ElInput v-model="form.ST" placeholder="请输入 ST" />
      </ElFormItem>
      <ElFormItem label="C" prop="C">
        <ElInput v-model="form.C" placeholder="请输入 C" />
      </ElFormItem>
    </ElForm>

    <Button @click="confirmCreate">确定</Button>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "@r/components/ui/Dialog.vue";
import { ElForm, FormRules } from "element-plus";
import { generateRandomDname } from "../utils";
import IpcMainMess from "@r/utils/ipc";

const props = withDefaults(
  defineProps<{
    visible?: boolean;
  }>(),
  {
    visible: false,
  }
);

const emit = defineEmits(["update:visible"]);
const visible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val),
});

const form = reactive({
  keystore: "",
  alias: "",
  validity: "",
  storepass: "",
  keypass: "",
  CN: "",
  OU: "",
  O: "",
  L: "",
  ST: "",
  C: "",
});

//   dname: "",
const dname = computed(() => {
  return `CN=${form.CN},OU=${form.OU},O=${form.O},L=${form.L},ST=${form.ST},C=${form.C}`;
});

const formRules = reactive<FormRules>({
  keystore: [
    {
      required: true,
      message: "请输入秘钥名称",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^[a-zA-Z0-9_-]{1,64}$/,
      message: "秘钥名称只能包含字母、数字、下划线和短横线",
      trigger: ["blur", "change"],
    },
    {
      min: 1,
      max: 20,
      message: "长度在 1 到 20 个字符",
      trigger: ["blur", "change"],
    },
  ],
  alias: [
    { required: true, message: "请输入别名", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_-]{1,64}$/,
      message: "别名只能包含字母、数字、下划线和短横线",
      trigger: ["blur", "change"],
    },
    {
      min: 1,
      max: 10,
      message: "长度在 1 到 10 个字符",
      trigger: ["blur", "change"],
    },
  ],
  validity: [{ required: true, message: "请选择有效期", trigger: "change" }],
  storepass: [
    { required: true, message: "请输入存储密码", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_-]{1,64}$/,
      message: "存储密码只能包含字母、数字、下划线和短横线",
      trigger: ["blur", "change"],
    },
    {
      min: 6,
      max: 6,
      message: "长度在 6 个字符",
      trigger: ["blur", "change"],
    },
  ],
  keypass: [
    { required: true, message: "请输入秘钥密码", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_-]{1,64}$/,
      message: "秘钥密码只能包含字母、数字、下划线和短横线",
      trigger: ["blur", "change"],
    },
    {
      trigger: ["blur", "change"],
      min: 6,
      max: 6,
      message: "长度在 6 个字符",
    },
  ],
});

function generalInfo() {
  const dname = generateRandomDname();
  Object.assign(form, dname);
}

const ElFormRef = ref();
function confirmCreate() {
  ElFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // validity 需要计算出天数
      const formResult = {
        ...form,
        keystore: form.keystore + ".keystore",
      };
      const result = await IpcMainMess.sendSync("cache.generateKeyStoreFile", formResult);
    }
  });
}

defineExpose({ visible });
</script>

<style scoped></style>
