<template>
  <ElContainer>
    <ElHeader> 
      <BlowUp />

    </ElHeader>
    <ElContainer>
      <RouterView />    
    </ElContainer>
  </ElContainer>
</template>

<script setup lang="ts">
import BlowUp from '../components/Icons/BlowUp';
</script>

<style scoped></style>
