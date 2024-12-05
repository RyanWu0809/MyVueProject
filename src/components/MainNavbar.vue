<template>
  <div :class="['navbar', { 'collapsed': isCollapsed }]" >
    <div class="logo" @click="goToHome">
      <img src = "@/assets/cooler_logo.png" alt="Company.Logo">
      <span class="company-name">
        <p :class="{'fade-out': isCollapsed, 'fade-in': !isCollapsed}">Cooler Master</p>
      </span>
    </div>
    
    <div class="divider"></div>
    <div class="menu">
      <ul>
        <li><router-link to="/BindComponents">
          <p :class="{'fade-out': isCollapsed, 'fade-in': !isCollapsed}">組裝綁定</p>
        </router-link></li>
        <li><router-link to="/BindJig">
          <p :class="{'fade-out': isCollapsed, 'fade-in': !isCollapsed}">治具綁定</p>
        </router-link></li>
        <li><router-link to="/Soldering">
          <p :class="{'fade-out': isCollapsed, 'fade-in': !isCollapsed}">焊钎過站</p>
        </router-link></li>
        <!-- 可收合的測試結果導入選單 -->
        <li @click="toggleSubmenu">
          <div class="submenu-header">
            <p :class="{'fade-out': isCollapsed, 'fade-in': !isCollapsed}">測試結果導入 &nbsp;
              <span class="arrow" :class="{ 'open': isSubmenuOpen }">▶</span>
            </p>
          </div>
        </li>
        <ul v-if="isSubmenuOpen" class="submenu">
          <li>
            <router-link to="/TestResultIn">
              <p :class="{'fade-out': isCollapsed, 'fade-in': !isCollapsed}">單筆導入</p>
            </router-link>
          </li>
          <li>
            <router-link to="/TestResultInByCsv">
              <p :class="{'fade-out': isCollapsed, 'fade-in': !isCollapsed}">批量導入</p>
            </router-link>
          </li>
        </ul>
        <li><router-link to="/QuerySNHistory">
          <p :class="{'fade-out': isCollapsed, 'fade-in': !isCollapsed}">序號追蹤</p>
        </router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainNavbar',
  props: {
    isCollapsed: {
      type: Boolean,
    },
    AppVueIsCollapsed: { //父物件是否是收合狀態
      type: Boolean,
    },
  },
  data() {
    return {
      isSubmenuOpen: false, //選單下拉
    };
  },
  methods: {
    // 點擊 Logo 區塊跳轉至主頁
    goToHome() {
      this.$router.push('/');
    },
    toggleSubmenu() {
      this.isSubmenuOpen = !this.isSubmenuOpen;
    },
    
  },

};
</script>

<style scoped>

.navbar {
  font-family: Arial, sans-serif;
  width: 250px;
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 左對齊 */
  padding: 20px 0; /* 上下有間距，左右無留白 */
  transition: width 0.3s ease;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.3); /* 加入陰影效果 */
}

.navbar.collapsed {
  width: 95px;
}

/* Logo 的樣式 */
.logo {
  display: flex;
  align-items: center;
  padding-left: 20px;
  margin-bottom: 20px;
  cursor: pointer; /* 指標顯示為手形，表示可點擊 */
  width: 100%;
}

.logo img {
  max-width: 60px;
  height: auto;
  border-radius: 50%; /* 圓角樣式 */
  margin-right: 10px;
}

.company-name {
  font-size: 18px;
  font-weight: bold;
  color: #b9b9b9;
  white-space:nowrap;
  overflow: hidden; /* 因.logo有設定display: flex水平佈局，因此收合時需隱藏溢出的文字 */
}

/* 分隔線樣式 */
.divider {
  width: 100%;
  height: 1px;
  background-color: #7f8c8d; /* 分隔線顏色 */
  margin-bottom: 20px;
}

/* 選單樣式 */
.menu {
  list-style: none;
  padding: 0;
  width: 100%;
  transition: opacity 0.3s ease;
  opacity: 1;
}

.menu li {
  margin: 15px 0;
}

.menu li a, .menu li .submenu-header {
  color: #ecf0f1; /* 字體顏色 */
  text-decoration: none;
  font-size: 18px;
  padding: 10px;
  display: block;
  border-radius: 5px;
  transition: background-color 0.3s, opacity 0.3s;
  white-space:nowrap
}

.navbar.collapsed .menu li a p,
.navbar.collapsed .submenu-header p,
.navbar.collapsed .company-name p {
  visibility: hidden;
}

/* 選單 hover 效果 */
.menu li a:hover, .submenu-header:hover {
  background-color: #34495e;
}

/* 子選單標題樣式 */
.submenu-header {
  cursor: pointer;
}

/* 子選單樣式 */
.submenu li {
  margin: 10px 0;
}

.submenu li a {
  font-size: 16px;
}

/* 下拉選單箭頭圖示樣式 */
.arrow {
  display: inline-block;
  transition: transform 0.3s;
  font-size: 16px;
}

.arrow.open {
  transform: rotate(90deg);
}

/* 字體淡入淡出效果 */
p {
  transition: opacity 0.9s ease;
}

.fade-out {
  opacity: 0;
}

.fade-in {
  opacity: 1;
}


</style>
