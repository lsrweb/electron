<template>
  <Dialog v-model="visible" title="生成密钥库">
    <ElForm :model="form" label-width="84px" :rules="formRules" v-model="form" ref="ElFormRef">
      <!-- 指定java版本 -->
      <ElFormItem label="JAVA" prop="java">
        <ElSelect v-model="form.java" placeholder="请选择JAVA版本">
          <ElOption
            v-for="item in javaList"
            :key="item.originalFloder"
            :label="item.version"
            :value="item.originalPath"
          >
            <span>{{ item.version }}</span>
            <span class="text-gray-500">({{ item.originalFloder }})</span>
          </ElOption>
        </ElSelect>
      </ElFormItem>
      <!-- 分割线 -->
      <div class="mb-4 flex justify-between items-center w-full border-b border-gray-300 pb-3">
        <span class="text-gray-500">证书信息-01</span>
        <Button type="button" @click="generalInfo('01')">随机生成</Button>
      </div>
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
        <span class="text-gray-500">证书信息-02</span>
        <Button type="button" @click="generalInfo('02')">随机生成</Button>
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
import { ElForm, ElLoading, ElNotification, FormRules } from "element-plus";
import { generateRandomAlias, generateRandomDname, generateRandomKeyFileName, generateRandomValidity } from "../utils";
import IpcMainMess from "@r/utils/ipc";

const props = withDefaults(
  defineProps<{
    visible?: boolean;
  }>(),
  {
    visible: false,
  }
);

const emit = defineEmits(["update:visible", "updateList"]);
const visible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val),
});

const form = reactive({
  java: "",
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

const formRules = reactive<FormRules>({
  java: [{ required: true, message: "请选择JAVA版本", trigger: "change" }],
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

function generalInfo(type: "01" | "02") {
  const dname = generateRandomDname();
  Object.assign(
    form,
    type == "01"
      ? {
          keystore: generateRandomKeyFileName(),
          alias: generateRandomAlias(),
          validity: generateRandomValidity(),
        }
      : dname
  );
}

const ElFormRef = ref();
function confirmCreate() {
  ElFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      ElLoading.service({ fullscreen: true });
      const formResult = {
        ...form,
        keystore: form.keystore + ".keystore",
      };
      const result = await IpcMainMess.sendSync("cache.generateKeyStoreFile", formResult);
      ElLoading.service().close();
      ElNotification({
        title: "密钥生成成功",
        message: result,
        type: "success",
        position: "bottom-left",
      });
      visible.value = false;
      emit("updateList");
    }
  });
}

defineExpose({ visible });

const javaList = ref([]);
onMounted(async () => {
  const result = await IpcMainMess.sendSync("cache.readJavaVersionList");
  javaList.value = result.map((item: any) => {
    return {
      ...(typeof item === "object" ? item : {}),
      originalFloder: item.originalPath.split("\\").pop(),
    };
  });
});
</script>

<style scoped></style>
