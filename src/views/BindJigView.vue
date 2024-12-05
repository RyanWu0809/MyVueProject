<template>
  <div class="BindJig">

    <div class="operation-block">
      <!-- 主序號輸入框 -->
      <div class="input-group">
        <label for="mainSN">主序號</label>
        <input type="text" id="mainSN" v-model="mainSN" placeholder="請輸入主序號" />
      </div>

      <!-- 治具區塊 -->
      <div class="section-box">
        <div class="input-group">
          <label for="jig">治具</label>
          <input type="text" id="jig" v-model="jig" placeholder="請輸入治具序號" />
        </div>
      </div>

      <!-- 顯示 loading 動畫 -->
      <div v-if="loading" class="loading-overlay">
        <div class="loader"></div>
      </div>

      <!-- 確認按鈕 -->
      <button class="confirm-button" @click="confirmBinding">確認綁定</button>
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
  name: 'BindJigView',
  components: {
    StationResultLog
  },
  data() {
    return {
      mainSN: '',
      jig: '',
      loading: false, // 新增 loading 狀態
      records: [] // 紀錄執行結果的陣列
    };
  },
  mounted() {
    this.$emit('update-title', '綁定治具');
  },
  inject: ['showSuccess', 'showWarning','showError'], // 注入 App.vue 提供的方法
  methods: {
    async confirmBinding() {
      // 檢查必填欄位
      if (!this.mainSN.trim() || !this.jig.trim()) {
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
              <tem:SEQ>2</tem:SEQ>
              <tem:Components>
                <tem:ComponentItem>
                  <tem:ComponentType>JIG</tem:ComponentType>
                  <tem:ComponentSN>${this.jig}</tem:ComponentSN>
                </tem:ComponentItem>
              </tem:Components>
              <tem:TestResults/>
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
          result += "綁定成功"
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
.BindJig {
  font-family: Arial, sans-serif;
  max-width: 1000px;
  margin-left: 10px;
  padding: 20px;
  display: flex; /* 讓子元素左右排列 */
  gap: 100px; /* 左右區塊之間的間距 */

}

</style>