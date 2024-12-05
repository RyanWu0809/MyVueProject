<template>
    <div
      v-if="visible"
      class="pop-message"
      :class="{ 'fade-out': fadingOut, 'success': typeSuccess, 'warning': typeWarning, 'error': typeError }"
      @animationend="handleAnimationEnd"
    >
      <div class="icon-container">
        <!-- 使用 FontAwesome -->
        <i v-if="visible && typeSuccess" class="fas fa-check-circle icon" style="color: white;"></i>
        <i v-if="visible && typeWarning" class="fas fa-exclamation-circle icon" style="color: black;"></i>
        <i v-if="visible && typeError" class="fas fa-times-circle icon" style="color: white;"></i>

      </div>
      <div class="message-content">
        <span>{{ message }}</span>
        <button class="close-btn" 
        :class="{ 'success': typeSuccess, 'warning': typeWarning, 'error': typeError }"
        @click="fadeOut">✖</button>
      </div>
    </div>
  </template>
  
  <script>
  import '@fortawesome/fontawesome-free/css/all.css';
  import '@fortawesome/fontawesome-free/js/all.js';

  export default {
    name: 'PopMessage',
    props: {
      message: {
        type: String,
        required: true,
      },
      typeSuccess: {
        type: Boolean,
        required: true,
      },
      typeWarning: {
        type: Boolean,
        required: true,
      },
      typeError: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        visible: false, // 控制是否顯示
        fadingOut: false,  // 控制淡出動畫
      };
    },
    methods: {
      show() {
        this.visible = true;
        this.fadingOut = false; // 防止快速重複觸發
      },
      fadeOut() {
        this.fadingOut = true; // 啟動 fadeOut 動畫
      },
      close() {
        this.visible = false; //強制關閉
      },
      handleAnimationEnd() {
        if (this.fadingOut) {
          this.visible = false; // 動畫結束後隱藏
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .pop-message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #df1600;
    padding: 15px 20px;
    border-radius: 5px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: fadeIn 0.5s forwards; /* 淡入效果 */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  }

  .pop-message.fade-out {
    animation: fadeOut 0.5s forwards; /* 淡出效果 */
  }

  .success {
    background-color: #23d300;
    color: white;
  }

  .warning {
    background-color: #e3e700;
    color: black;
  }
  
  .error {
    background-color: #df1600;
    color: white;
  }

  .icon-container {
  margin-right: 15px;
  display: flex;
  align-items: center;
  }

  .icon {
    font-size: 24px; /* 調整圖標大小 */
  }

  .message-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
  }
  
  .pop-message .close-btn {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    margin-left: 20px;
    border-radius: 8px;
  }

  .pop-message .close-btn.success:hover {
    background: #499700;
  }

  .pop-message .close-btn.warning:hover {
    background: #b6b900;
  }

  .pop-message .close-btn.error:hover {
    background: #a11000;
  }
  
  /* 淡入效果 */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  /* 淡出效果 */
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  </style>