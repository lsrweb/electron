<template>
  <div class="spinner">
    <div class="spinner-circle"></div>
  </div>
</template>

<style>
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.spinner-circle {
  width: 100%;
  border: 4px solid #ccc;
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
