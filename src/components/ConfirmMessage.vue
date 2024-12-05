<template>
    <div class="confirm-overlay" v-if="visible">
      <div class="confirm-box">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="button-group">
          <button class="confirm-btn" @click="handleConfirm(true)">確認</button>
          <button class="cancel-btn" @click="handleConfirm(false)">取消</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ConfirmMessage",
    props: {
      title: {
        type: String,
        default: "確認",
      },
      message: {
        type: String,
        default: "",
      },
    },
    data() {
      return {
        visible: false,
        resolvePromise: null, // Promise 的 resolve 回調函數
      };
    },
    methods: {
      show() {
        this.visible = true;
        return new Promise((resolve) => {
            this.resolvePromise = resolve;
        });
      },
      handleConfirm(isConfirmed) {
        this.visible = false;
        if (this.resolvePromise) {
            this.resolvePromise(isConfirmed); // 解決 Promise，返回確認結果
        }
      },

    },
  };
  </script>
  
  <style scoped>
  .confirm-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .confirm-box {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
    width: 300px;
    text-align: center;
  }
  
  h3 {
    margin-bottom: 10px;
    font-size: 18px;
    color: #333;
  }
  
  p {
    margin-bottom: 20px;
    font-size: 16px;
    color: #555;
  }
  
  .button-group {
    display: flex;
    justify-content: space-between;
  }
  
  .confirm-btn,
  .cancel-btn {
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }
  
  .confirm-btn {
    background-color: #28a745;
    color: white;
  }
  
  .confirm-btn:hover {
    background-color: #218838;
  }
  
  .cancel-btn {
    background-color: #dc3545;
    color: white;
  }
  
  .cancel-btn:hover {
    background-color: #c82333;
  }
  </style>