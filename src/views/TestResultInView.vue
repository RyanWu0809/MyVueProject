<template>
  <div class="TestResultIn">
    <div class="operation-block">
      <!-- 主序號輸入框 -->
      <div class="input-group">
        <label for="mainSN">主序號</label>
        <input type="text" id="mainSN" v-model="mainSN" placeholder="請輸入主序號" />
      </div>

      <!-- 測試項 -->
      <div class="section-box">
        <div class="input-group">
          <label for="TestResult">測試結果</label>
          <input type="text" id="TestResult" v-model="TestResult" placeholder="請輸入測試結果" />
        </div>

        <div class="input-group">
          <label for="TestValue">壓力值</label>
          <input type="text" id="TestValue" v-model="TestValue" placeholder="請輸入壓力值" />
        </div>

        <div class="input-group">
          <label for="UpperLimit">上限</label>
          <input type="text" id="UpperLimit" v-model="UpperLimit" placeholder="請輸入上限" />
        </div>

        <div class="input-group">
          <label for="LowerLimit">上限</label>
          <input type="text" id="LowerLimit" v-model="LowerLimit" placeholder="請輸入下限" />
        </div>
      </div>

      <!-- 顯示 loading 動畫 -->
      <div v-if="loading" class="loading-overlay">
        <div class="loader"></div>
      </div>

      <!-- 確認按鈕 -->
      <button class="confirm-button" @click="confirm">確認</button>
    </div>

    <div class ="result-block">
      <StationResultLog :records="records" />
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import StationResultLog from '@/components/StationResultLog.vue';

export default {
  name: 'TestResultInView',
  components: {
    StationResultLog
  },
  data() {
    return {
      mainSN: '',
      TestResult: '',
      TestValue: '',
      UpperLimit: '',
      LowerLimit: '',
      loading: false, // 新增 loading 狀態
      records: [] // 紀錄執行結果的陣列
    };
  },
  mounted() {
    this.$emit('update-title', '單筆導入測試結果');
  },
  inject: ['showSuccess', 'showWarning','showError'], // 注入 App.vue 提供的方法
  methods: {
    async confirm() {
      // 檢查必填欄位
      if (!this.mainSN.trim() || !this.TestResult.trim() || !this.TestValue.trim() || !this.UpperLimit.trim() || !this.LowerLimit.trim()) {
        this.showWarning('請輸入所有欄位！');
        return;
      }

      this.loading = true; // 開始顯示 loading

      // 構建 SOAP XML 請求
      const soapRequest = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
          <soapenv:Header/>
          <soapenv:Body>
            <tem:InsSNPassSEQ>
              <tem:SN>${this.mainSN}</tem:SN>
              <tem:SEQ>4</tem:SEQ>
              <tem:Components/>
              <tem:TestResults>
                <tem:TestResultItem>
                  <tem:TestType>Pressure</tem:TestType>
                  <tem:TestResult>${this.TestResult}</tem:TestResult>
                  <tem:TestValue>${this.TestValue}</tem:TestValue>
                  <tem:UpperLimit>${this.UpperLimit}</tem:UpperLimit>
                  <tem:LowerLimit>${this.LowerLimit}</tem:LowerLimit>
                </tem:TestResultItem>
              </tem:TestResults>
            </tem:InsSNPassSEQ>
          </soapenv:Body>
        </soapenv:Envelope>
      `;

      let result = "";
      try {
        // 發送 SOAP 請求
        const response = await axios.post(
          '/IPublicCustomerShopFloor.asmx',
          soapRequest,
          {
            headers: {
              'Content-Type': 'text/xml;charset=UTF-8',
            },
          }
        );

        // 解析回應
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, 'text/xml');
        result = xmlDoc.getElementsByTagName('InsSNPassSEQResult')[0]?.textContent;

        // 顯示結果
        if (result=="OK") {
          result += "導入並過站成功"
          this.showSuccess(result);
        } else {
          this.showError(`${result}`);
        }
      } catch (error) {
        result == '綁定失敗，請檢查網絡或參數。'+ error
        this.showError('綁定失敗，請檢查網絡或參數。');

      } finally {
        this.loading = false; // 請求結束，隱藏 loading

        // 添加新紀錄
        const currentTime = new Date().toLocaleString(); // 當前時間

        this.records.push({
          Time: currentTime,
          mainSN: this.mainSN,
          result: result
        });

      }
    },
  },
};
</script>

<style scoped src="@/assets/styles/common.css"></style>
<style scoped>
/* 整體字體與背景設定 */
.TestResultIn {
  font-family: Arial, sans-serif;
  max-width: 1000px;
  margin-left: 10px;
  padding: 20px;
  display: flex; /* 讓子元素左右排列 */
  gap: 100px; /* 左右區塊之間的間距 */

}

</style>