<template>
   <div class = "HomeView">
    <h1>歡迎來到主頁</h1> <br>
    <p>請從左側選單選擇功能頁面。</p>
  </div>
</template>

<script>

export default {
  name: 'HomeView',
  mounted() {
    this.$emit('update-title', '主頁');
  },
};
</script>

<style scoped>
.HomeView {
  font-family: Arial, sans-serif;
  padding: 20px;
}
</style>
