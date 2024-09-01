<template>
  <ElDrawer v-model:model-value="dialogVisible" :title="`添加项目${version}`" direction="rtl" size="500px" :close-on-click-modal="false">
    <!-- dcloud_appid  开发者需登录https://dev.dcloud.net.cn/申请签名 -->
    <!-- package 包名 -->
    <!-- dcloud_appkey  开发者需登录https://dev.dcloud.net.cn/申请签名 -->
    <!-- appname -->
    <!-- appversion -->
    <!-- 密钥库 -->
    <div class="p-2">
      <ElForm ref="formRef" :model="form" label-width="100px" :rules="rules">
        <ElFormItem label="dcloud_appid" prop="dcloud_appid">
          <ElInput v-model="form.dcloud_appid" placeholder="开发者需登录https://dev.dcloud.net.cn/申请签名" />
          <!-- 打开decloud -->
        </ElFormItem>
        <ElFormItem label="package" prop="package">
          <!-- <ElInput v-model="form.package" placeholder="请输入应用包名" /> -->
          <!-- 输入框果和一个按钮,用来生成测试包名 -->
          <ElInput v-model="form.package" placeholder="请输入应用包名">
            <template #append>
              <ElButton type="primary" @click="form.package = generateRandomPackageName()">T</ElButton>
            </template>
          </ElInput>
        </ElFormItem>
        <ElFormItem label="dcloud_appkey" prop="dcloud_appkey">
          <ElInput v-model="form.dcloud_appkey" placeholder="开发者需登录https://dev.dcloud.net.cn/申请签名" />
        </ElFormItem>
        <ElFormItem label="appname" prop="appname">
          <ElInput v-model="form.appname" placeholder="请输入应用名称" />
        </ElFormItem>
        <ElFormItem label="appversion" prop="appversion">
          <ElInput
            v-model="form.appversion"
            placeholder="请输入应用版本"
            :parser="(value:any) => value.replace('v ', '')"
            :formatter="(value:any) => `v ${value}`"
          />
        </ElFormItem>

        <ElFormItem label="密钥库" prop="keystore">
          <ElSelect v-model="form.keystore" placeholder="请选择">
            <ElOption v-for="item in keyStoreList" :key="item.alias" :label="item.keystore" :value="item.alias">
              <span>{{ item.keystore }}</span>
              <span class="float-end">Alias: {{ item.alias }}</span>
            </ElOption>
          </ElSelect>
        </ElFormItem>
      </ElForm>

      <Button type="primary" @click.stop="confirmCreate" class="mt-2">保存</Button>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
import { generateRandomPackageName } from "./utils";
import IpcMainMess from "@r/utils/ipc";

const emit = defineEmits(["update:visible"]);

const props = withDefaults(
  defineProps<{
    visible: boolean;
    version: string;
    CATCH: string;
  }>(),
  {
    visible: false,
    version: "",
  }
);

// 密钥库列表
const keyStoreList = ref<
  {
    keystore: string;
    alias: string;
  }[]
>([]);
onMounted(() => {
  // 初始化获取密钥库列表
  IpcMainMess.sendSync("cache.readKeyStoreList").then((res) => {
    keyStoreList.value = res;
  });
});

const formRef = ref(null);
const form = reactive({
  dcloud_appid: "",
  package: "",
  dcloud_appkey: "",
  appname: "",
  appversion: "1.0.0",
  keystore: "",
});

// 版本规则
const rules = {
  dcloud_appid: [{ required: true, message: "请输入dcloud_appid", trigger: ["blur", "change"] }],
  package: [
    { required: true, message: "请输入package", trigger: ["blur", "change"] },
    { pattern: /^[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/, message: "请输入正确的package", trigger: ["blur", "change"] },
  ],
  dcloud_appkey: [{ required: true, message: "请输入dcloud_appkey", trigger: ["blur", "change"] }],
  appname: [{ required: true, message: "请输入appname", trigger: ["blur", "change"] }],
  appversion: [{ required: true, message: "请输入appversion", trigger: ["blur", "change"] }],
  keystore: [{ required: true, message: "请选择密钥库", trigger: ["blur", "change"] }],
};

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => {
    emit("update:visible", val);
  },
});

//
function confirmCreate() {
  (formRef.value as any).validate(async (valid: boolean) => {
    if (valid) {
      // 创建项目
      IpcMainMess.sendSync("cache.createProject", { ...form, CATCH: props.CATCH });
    }
  });
}
</script>

<style scoped></style>
