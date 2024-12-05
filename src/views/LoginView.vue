<template>
  <div class="login-container">
    <div class="Login-Picture">
      <form @submit.prevent="login" class="login-form">
        <label for="username" class="">帳號</label>
          <input id="username" v-model="username" type="text" placeholder="請輸入工號" />
          <label for="password">密碼</label>
          <input id="password" v-model="password" type="password" placeholder="請輸入密碼" />
          <button type="submit" class="confirm-button" style="margin-top: 40px;">登入</button>
      </form>
    </div>

    <!-- 顯示 loading 動畫 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loader"></div>
    </div>

  </div>
</template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'LoginView',
    data() {
      return {
        username: '',
        password: '',
        loading: false, // 新增 loading 狀態
      };
    },
    inject: ['showSuccess', 'showWarning', 'showError'], // 注入 App.vue 提供的方法
    methods: {
      async login() {

        // 檢查必填欄位
        if (!this.username.trim() || !this.password.trim()) {
            this.showWarning('請輸入帳號密碼！');
            return;
        }

        this.loading = true; // 開始顯示 loading

        // 構建 SOAP XML 請求
        const soapRequest = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
              <soapenv:Header/>
              <soapenv:Body>
                <tem:Login>
                  <tem:emp_id>${this.username}</tem:emp_id>
                  <tem:password>${this.password}</tem:password>
                </tem:Login>
              </soapenv:Body>
            </soapenv:Envelope>
        `;

        try {
            // 發送 SOAP 請求
            const response = await axios.post(
            '/OutsourcingCustom.asmx',
            soapRequest,
            {
                headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'SOAPAction': 'http://tempuri.org/Login', // 確保 SOAPAction 正確
                },
            }
            );

            // 解析回應
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, 'text/xml');
            const result = xmlDoc.getElementsByTagName('Login')[0]?.textContent;

            // 顯示結果
            if (result == null) {
              sessionStorage.setItem('isLoggedIn', true); // 儲存登入狀態
              sessionStorage.setItem('username', this.username); // 儲存登入者帳號
              this.showSuccess("登入成功!");
              this.$router.push('/'); // 導航到首頁
            } else {
              this.showError(`${result}`);
            }
        } catch (error) {
            if (error.response && error.response.status === 500) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(error.response.data, 'text/xml');
            const faultString = xmlDoc.getElementsByTagName('faultstring')[0]?.textContent;

            if (faultString) {
                this.showError(faultString); // 顯示後端的 Exception 訊息
            } else {
                this.showError("系統錯誤，無法解析錯誤訊息。"); // 顯示後端的 Exception 訊息
            }
            } else {
            this.showError("請求失敗，請檢查網絡或參數。"); // 顯示後端的 Exception 訊息
            }
        } finally {
            this.loading = false; // 請求結束，隱藏 loading
        }

      },
    },
  };
  </script>
  
  <style scoped src="@/assets/styles/common.css"></style>
  <style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .Login-Picture {
  position: relative; /* 設定相對定位 */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45vw;
  height: 90vh;
  background-image: url('@/assets/LoginPage.png'); /* 使用背景圖片 */
  background-position: center; /* 居中圖片 */
  background-size: cover; /* 覆蓋圖片 */
  border-radius: 8px; /* 添加圓角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加陰影效果 */
 }

.login-form {
  position: absolute; /* 絕對定位 */
  top: 50%; /* 垂直居中 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 偏移自身寬高的一半，實現居中 */
  display: flex;
  flex-direction: column;
  width: 20vw;
  height: 35vh;
  min-height: 280px; /* 設置最小高度 */
  min-width: 280px; /* 設置最小寬度 */
  padding: 20px;
  border-radius: 40px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加陰影效果 */
  
 }

  </style>