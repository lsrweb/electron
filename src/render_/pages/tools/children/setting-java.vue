<template>
  <div class="setting-java__wrapper">
    <!-- 此页面负责检测java环境变量,java环境目录 -->
    <el-card class="box-card">
      <!--  java版本列表  -->
      <el-row>
        <el-col :span="24">
          <h3 class="mb-2">Java版本列表</h3>
          <el-table :data="[]" style="width: 100%" stripe border height="400">
            <el-table-column
              prop="name"
              label="名称"
              width="180"
            ></el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
            <el-table-column prop="version" label="版本"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template #default="{ row }">
                <el-button type="text" size="small">编辑</el-button>
                <el-button type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  // 页面初始化的时候检测java环境变量
});
</script>

<style scoped lang="scss">
.setting-java__wrapper {
  @apply antialiased;
  h1 {
    @apply mb-2;
  }
}
</style>
