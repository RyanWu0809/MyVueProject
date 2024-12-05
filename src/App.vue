<template>
  <div class="app-container">
    <!-- 左側導航欄 -->
    <MainNavbar v-if="showMainLayout" :isCollapsed="!isNavbarVisible" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"/>

    <!-- 右側內容區域 -->
    <div ref="mainContent" :class="['main-content', { 'collapsed': !bNavbarStatus && showMainLayout, 'expanded': bNavbarStatus && showMainLayout, 'center-content': !showMainLayout }]">
      <!-- 頂部橫欄 -->
      <HeaderBar v-if="showMainLayout" :currentPageTitle="currentPageTitle" @toggle-navbar="toggleNavbar" />
      <div v-if="showMainLayout" class="divider"></div>
      <!-- 主內容區域 -->
      <div class="content">
        <router-view @update-title="updateTitle" />
      </div>

      <!-- 錯誤提示框 -->
      <PopMessage :typeSuccess="isSuccess" :typeWarning="isWarning" :typeError="isError" :message="popMessage" ref="popMsg" />
      <!-- 確認提示框 -->
      <ConfirmMessage :title="confirmTitle" :message="confirmMessage" ref="confirmMsg" />
    </div>
  </div>
</template>

<script>
//import { useRoute } from 'vue-router';
import MainNavbar from './components/MainNavbar.vue';
import HeaderBar from './components/HeaderBar.vue';
import PopMessage from './components/PopMessage.vue';
import ConfirmMessage from './components/ConfirmMessage.vue';


export default {
  name: 'App',
  components: {
    MainNavbar,
    HeaderBar,
    PopMessage,
    ConfirmMessage,
  },
  data() {
    return {
      currentPageTitle: '主頁',
      bNavbarStatus: true, // 控制導航欄收合狀態
      isNavbarVisible: true, // 控制導航欄顯示狀態
      isSuccess: false, // 彈出訊息類別
      isWarning: false, // 彈出訊息類別
      isError: false, // 彈出訊息類別
      popMessage: '', // 彈出訊息
      confirmTitle: '', //確認訊息標題
      confirmMessage: '', //確認訊息
      popMessageTimeoutId: null, // 保存彈出訊息自動淡出的TimeoutID
    };
  },
  computed: {
    showMainLayout() {
      return this.$route.path !== '/Login'; // 判斷當前路由是否為 Login
    },
  },
  provide() {
    return {
      showSuccess: this.showSuccess, // 提供給子組件的方法
      showWarning: this.showWarning, // 提供給子組件的方法
      showError: this.showError, // 提供給子組件的方法
      showConfirm: this.showConfirm, // 提供給子組件的方法
    };
  },
  methods: {
    updateTitle(newTitle) {
      this.currentPageTitle = newTitle;
    },
    toggleNavbar() {
      this.isNavbarVisible = !this.isNavbarVisible;
      this.bNavbarStatus = !this.bNavbarStatus;
      if (this.bNavbarStatus) {
        this.$refs.mainContent.classList.add('expanded');
        this.$refs.mainContent.classList.remove('collapsed');
      } else {
        this.$refs.mainContent.classList.add('collapsed');
        this.$refs.mainContent.classList.remove('expanded');
      }
    },
    handleMouseEnter() {
      if(!this.bNavbarStatus){
        this.isNavbarVisible = true;
      }
    },
    handleMouseLeave() {
      if(!this.bNavbarStatus){
        this.isNavbarVisible = false;
      }
    },
    showSuccess(message) {
      this.resetPopMessageState();
      this.isSuccess = true;
      this.popMessage = message;
      this.$nextTick(() => {
        this.$refs.popMsg.close();
        // 顯示錯誤提示框
        this.$refs.popMsg.show();
        this.popMessageTimeoutId = setTimeout(() => {
          this.$refs.popMsg.fadeOut(); // 啟動淡出效果
        }, 5000); // 5 秒後自動淡出
      });
    },
    showWarning(message) {
      this.resetPopMessageState();
      this.isWarning = true;
      this.popMessage = message;
      this.$nextTick(() => {
        this.$refs.popMsg.close();
        // 顯示錯誤提示框
        this.$refs.popMsg.show();
        this.popMessageTimeoutId = setTimeout(() => {
          this.$refs.popMsg.fadeOut(); // 啟動淡出效果
        }, 5000); // 5 秒後自動淡出
      });
    },
    showError(message) {
      this.resetPopMessageState();
      this.isError = true;
      this.popMessage = message;
      this.$nextTick(() => {
        this.$refs.popMsg.close();
        // 顯示錯誤提示框
        this.$refs.popMsg.show();
        this.popMessageTimeoutId = setTimeout(() => {
          this.$refs.popMsg.fadeOut(); // 啟動淡出效果
        }, 5000); // 5 秒後自動淡出
      });
    },
    // 重置消息狀態
    resetPopMessageState() {
      this.isSuccess = false;
      this.isWarning = false;
      this.isError = false;
      this.popMessage = ''; // 清空消息內容

      if (this.$refs.popMsg) {
        if(this.popMessageTimeoutId) {
          clearTimeout(this.popMessageTimeoutId); // 清除前面的定時器
        }
        this.$refs.popMsg.close(); // 關閉當前顯示的消息框
      }
    },
    
    showConfirm(title, message) {
      this.confirmTitle = title;
      this.confirmMessage = message;

      return this.$refs.confirmMsg.show();
      //const confirmInstance = this.$refs.confirmMsg;
      //return confirmInstance.show();
    },

  },
};
</script>

<style>
/* 設定整體字體為 Arial，移除頁面留白 */
* {
  margin: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  overflow-y: auto;
}

/* 主容器設置 */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 左側導航欄樣式 */
.navbar {
  background-color: #2c3e50;
  color: #ffffff;
  position: fixed;
  z-index: 1000;
}

/* 右側主內容區域 */
.main-content {
  position: relative;
  height: 100vh;
  padding-left: 250px;
  transition: margin-left 0.3s ease;
}

/* 左導行欄展開時 */
.main-content.collapsed {
  margin-left: -170px; /* 收合後的內容區域位置調整 */
}

/* 左導行欄收合時 */
.main-content.expanded {
  margin-left: 0px; /* 展開後的內容區域位置調整 */
}

/* 當未登入，內容居中樣式 */
.main-content.center-content {
  background-color: #e7f0fa;
  padding-left: 0; /* 清除左側導航欄的空間 */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

/* 頂部橫欄樣式 */
.header-bar {
  width: 100%;
  height: 80px;
  background-color: #34495e;
  color: #ecf0f1;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 900;
}

/* 分隔線樣式 */
.divider {
  height: 1px;
  background-color: #7f8c8d;
}

/* 內容區域樣式 */
.content {
  flex: 1;
  padding: 20px;
}

</style>