<template>
    <div class="pagination">
      <slot :results="pagedResults"></slot>
      <div class="pagination-controls">
        <!-- 左切換按鈕 -->
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">‹</button>
  
        <!-- 頁碼按鈕 -->
        <button
          v-for="page in totalPages"
          :key="page"
          :class="{ 'active-page': page === currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
  
        <!-- 右切換按鈕 -->
        <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">›</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "pagiNation",
    props: {
      results: {
        type: Array,
        required: true,
      },
      itemsPerPage: {
        type: Number,
        default: 10,
      },
    },
    data() {
      return {
        currentPage: 1,
      };
    },
    computed: {
      // 計算分頁後的數據
      pagedResults() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.results.slice(start, end);
      },
      // 計算總頁數
      totalPages() {
        return Math.ceil(this.results.length / this.itemsPerPage);
      },
    },
    methods: {
      // 頁碼切換
      changePage(page) {
        this.currentPage = page;
      },
    },
  };
  </script>
  
<style scoped>

.pagination {
  align-items: center;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 10px;
}

.pagination-controls button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #3498db;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.pagination-controls button.active-page {
  background-color: #3498db;
  color: white;
}

.pagination-controls button:disabled {
  cursor: not-allowed;
  color: #bbb;
  background-color: #f9f9f9;
}

.pagination-controls button:hover:not(.active-page):not(:disabled) {
  background-color: #eef6fd;
}
</style>