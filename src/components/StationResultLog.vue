<template>
    <div class="section-box">
      <!-- 標題 -->
      <h3>過站結果紀錄</h3>
      
      <!-- 分隔線 -->
      <div class="divider"></div>
      
      <!-- 結果區塊 -->
      <ul ref="logList">
        <li 
          v-for="(record, index) in records" 
          :key="index" 
        >
          {{ record.Time }} : 
          <p :class="{'text-ok': record.result.includes('OK'), 'text-fail': !record.result.includes('OK')}">
            序號: {{ record.mainSN }}，{{ record.result }}
          </p>
      </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { onMounted, watch, ref } from 'vue';
  import { nextTick } from 'vue';
  
  export default {
    name: 'StationResultLog',
    props: {
      records: {
        type: Array,
        required: true
      }
    },
    setup(props) {
      const logList = ref(null);

      // 滾動到最新紀錄
      const scrollToLatest = () => {
        nextTick(() => {
          if (logList.value) {
            logList.value.scrollTop = logList.value.scrollHeight;
          }
        });
      };

      // 監聽 records 的變化
      watch(
        () => props.records,
        () => {
          scrollToLatest();
        },
        { deep: true }
      );

      // 初始滾動
      onMounted(() => {
        scrollToLatest();
      });

      return {
        logList
      };
    }
  };
  </script>
  
  <style scoped src="@/assets/styles/common.css"></style>
  
  <style scoped>
  /* 滾動效果讓列表能適應長內容 */
  ul {
    max-height: 700px; /* 設置最大高度 */
    overflow-y: auto; /* 垂直滾動支持 */
    padding: 0;
    margin: 0;
    list-style-type: none;
  }

  li {
    margin-bottom: 10px; /* 每條紀錄的間距 */
  }

  .section-box{
    height: 100%;
  }

  /* 成功樣式 */
.text-ok {
  color: green;
  font-weight: bold;
}

/* 失敗樣式 */
.text-fail {
  color: red;
  font-weight: bold;
}

  </style>