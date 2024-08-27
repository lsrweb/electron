<script setup lang="ts">
import dataTable from "@r/components/ui/data-table";

const columns = ref([
  {
    label: "Name",
    key: "name",
  },
  {
    label: "Age",
    key: "age",
  },
  {
    label: "Address",
    key: "address",
  },
]);

const data = ref([
  {
    name: "John Brown",
    age: 18,
    address: "New York No. 1 Lake Park",
  },
  {
    name: "Jim Green",
    age: 24,
    address: "London No. 1 Lake Park",
  },
  {
    name: "Joe Black",
    age: 30,
    address: "Sydney No. 1 Lake Park",
  },
  {
    name: "Jon Snow",
    age: 26,
    address: "Ottawa No. 2 Lake Park",
  },
]);
</script>

<template>
  <div>
    <data-table :data="data" :columns="columns" />
  </div>
</template>

<style scoped lang="scss"></style>
