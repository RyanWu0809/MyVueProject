<template>
    <div class="header-bar">
      <button class="toggle-button" @click="$emit('toggle-navbar')">
      ☰
      </button>
      <span class="page-title">{{ currentPageTitle }}</span>
      <!-- 登入帳號與登出按鈕 -->
      <div v-if="isAuthenticated" class="user-info">
        <span class="user-name">Hi, {{ username }}</span>
        <button class="logout-button" @click="logout">登出</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HeaderBar',
    props: {
      currentPageTitle: {
        type: String,
        required: true,
      },
    },
    data() {
    return {
      username: '', // 儲存登入使用者的帳號
      isAuthenticated: false, // 儲存是否已登入的狀態
      };
    },
    mounted() {
    this.checkAuthStatus(); // 檢查登入狀態
    },
    methods: {
      // 檢查是否已登入
      checkAuthStatus() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn'); // 檢查登入狀態
        if (isLoggedIn) {
          this.isAuthenticated = true;
          this.username = sessionStorage.getItem('username'); // 取得登入者的帳號
        }
      },
      // 登出功能
      logout() {
        sessionStorage.removeItem('isLoggedIn'); // 移除登入狀態
        sessionStorage.removeItem('username'); // 移除使用者帳號
        this.isAuthenticated = false;
        this.$router.push('/Login'); // 重新導向到登入頁面
      },
    },
  };
  </script>
  
  <style scoped>
  
  /* 頂部橫欄按鈕樣式 */
  .toggle-button {
    font-size: 25px;
    background-color: #2c3e50;
    color: #ecf0f1;
    border: none;
    border-radius: 5px;
    margin-right: 20px;
    margin-left: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .toggle-button:hover {
  background-color: #1a252f;
  }   

  .header-bar {

    background-color: #2c3e50;
    color: rgb(255, 255, 255);
    display: flex;
    align-items: center;
    padding: 0 20px;
    font-family: Arial, sans-serif;
    font-size: 30px;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .page-title {
    margin-left: 10px;
  }

  .user-info {
  margin-left: auto;
  display: flex;
  align-items: center;
  }

  .user-name {
    margin-right: 20px;
    font-size: 16px;
    color: rgba(194, 194, 194, 0.973);
  }

  .logout-button {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }

  .logout-button:hover {
    background-color: #c0392b;
  }

  </style>