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
            <ElOption label="生成随机密钥" value="1" />
            <ElOption label="选择已有密钥" value="2" />
          </ElSelect>
        </ElFormItem>

        <Button type="primary" @click="confirmCreate">确定</Button>
      </ElForm>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
import { generateRandomPackageName } from "./utils";

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

onMounted(() => {
  // 初始化获取密钥库列表
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
  package: [{ required: true, message: "请输入package", trigger: ["blur", "change"] }],
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
      console.log(form);
    }
  });
}
</script>

<style scoped></style>
