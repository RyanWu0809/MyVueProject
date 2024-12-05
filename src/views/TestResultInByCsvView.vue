<template>
  <div class="TestResultInByCsv">
    <div class="operation-block">
      <!-- 匯入按鈕 -->
      <button class="import-btn" @click="ImportCsv">
        <img src="@/assets/Excel_Logo.png" alt="Excel Logo" class="excel-logo" />
        匯入.Csv
      </button>
      <input 
        type="file" 
        ref="fileInput" 
        accept=".csv" 
        class="hidden-file-input" 
        @change="handleFileSelect" 
      />

      <!-- 表格 -->
      <div v-if="tableData.length" class="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th> <!-- 行數欄位 -->
              <th v-for="(header, index) in tableHeaders" :key="index">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in tableData" :key="rowIndex" :class="{ 'row-error': row.status === 'NG' }">
              <td>{{ rowIndex + 1 }}</td> <!-- 顯示行數 -->
              <td v-for="(cell, cellIndex) in row.data" :key="cellIndex">
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
        
      <!-- 顯示 loading 動畫 -->
      <div v-if="loading" class="loading-overlay">
        <div class="loader"></div>
      </div>

      <!-- 確認按鈕 -->
      <div class= "confirm-result">
        <button v-if="tableData.length" class="confirm-button" @click="confirm">確認導入</button>
        <div>
          <font id="lblSucceed" v-if="ResultLabelSucceed">{{ResultLabelSucceed}}</font> <br />
          <font id="lblFailed" v-if="ResultLabelFailed">{{ResultLabelFailed}}</font>
        </div>
      </div>
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
  name: 'TestResultInByCsvView',
  components: {
    StationResultLog
  },
  data() {
    return {
      ResultLabelSucceed: "",
      ResultLabelFailed: "",
      loading: false, // 新增 loading 狀態
      tableData: [], // 儲存表格的資料
      tableHeaders: [], // 表格標題
      headerMapping: {
        SN: "主序號",
        TEST_VALUE: "壓力值",
        UPPER_LIMIT: "上限",
        LOWER_LIMIT: "下限",
        TEST_RESULT: "測試結果",
        // 添加更多映射：'原始欄位名': '顯示欄位名'
      },
      records: [] // 紀錄執行結果的陣列
    };
  },
  mounted() {
    this.$emit('update-title', '批量導入測試結果');
  },
  inject: ['showSuccess', 'showWarning','showError', 'showConfirm'], // 注入 App.vue 提供的方法
  methods: {
    // 觸發檔案選擇框
    ImportCsv(){
      this.$refs.fileInput.click();
    },

    // 處理檔案選擇
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const csvData = e.target.result;
          this.parseCsv(csvData);
        };
        reader.readAsText(file);
      }
      this.ResultLabelSucceed = null;
      this.ResultLabelFailed = null;
    },

    // CSV 解析器
    parseCsv(data) {
      const rows = data.split("\n").map((row) => row.trim()).filter(row => row); // 過濾空行
      const rawHeaders = rows[0]?.split(",") || []; // 原始表頭
      this.tableHeaders = rawHeaders.map((header) =>
        this.headerMapping[header] || header
      ); // 轉換表頭
      this.tableData = rows.slice(1).map((row) => ({
        data: row.split(","), // 資料
        status: "OK", //默認狀態是OK
      })); 
      
    },

    
    async confirm(){
      // 確認是否繼續
      /*
      if (!confirm("確定要導入這些測試結果嗎？")) {
        return;
      }*/
      const confirmResult = await this.showConfirm("確定欸", "確定要導入這些測試結果嗎？");
      if (!confirmResult) {
        return; // 用戶選擇取消，直接退出
      }

      this.loading = true; // 開始 loading 狀態
      this.ResultLabelSucceed = null;
      this.ResultLabelFailed = null;

      // 使用 Promise.all 確保所有請求完成後處理結果
      const requests = this.tableData.map((row) => {
        const [sn, testValue, upperLimit, lowerLimit, testResult] = row.data;
        return this.callWebService({
          mainSN: sn,
          TestResult: testResult,
          TestValue: testValue,
          UpperLimit: upperLimit,
          LowerLimit: lowerLimit,
        });
      });

      Promise.all(requests)
        .then((results) => {
          //const failed = results.filter((result) => result !== "OK");
          //const succeed = results.filter((result) => result == "OK");
          let failedCount = 0;
          let succeedCount = 0;

          results.forEach((result, index) => {
            if (result === "OK") {
              succeedCount++;
              this.tableData[index].status = 'OK'; // 成功状态
            } else {
              failedCount++;
              this.tableData[index].status = 'NG'; // 失败状态
            }
          });

          if (failedCount > 0) {
            this.ResultLabelFailed = `失敗！失敗數量：${failedCount}`;
            if(succeedCount > 0){
              this.ResultLabelSucceed = `成功 ! 成功數量：${succeedCount}`;
              this.showSuccess(this.ResultLabelSucceed);
            }
            this.showError(this.ResultLabelFailed);
          } else {
            this.ResultLabelSucceed = "所有資料導入成功！";
            this.showSuccess(this.ResultLabelSucceed);
          }
        })
        .catch((error) => {
          console.error("請求失敗", error);
          this.showError("請求失敗，請檢查網絡或資料正確性。");
        })
        .finally(() => {
          this.loading = false; // 停止 loading 狀態
        });

    },

    //確認導入
    async callWebService({ mainSN, TestResult, TestValue, UpperLimit, LowerLimit }) {

      // 構建 SOAP XML 請求
      const soapRequest = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
          <soapenv:Header/>
          <soapenv:Body>
            <tem:InsSNPassSEQ>
              <tem:SN>${mainSN}</tem:SN>
              <tem:SEQ>4</tem:SEQ>
              <tem:Components/>
              <tem:TestResults>
                <tem:TestResultItem>
                  <tem:TestType>Pressure</tem:TestType>
                  <tem:TestResult>${TestResult}</tem:TestResult>
                  <tem:TestValue>${TestValue}</tem:TestValue>
                  <tem:UpperLimit>${UpperLimit}</tem:UpperLimit>
                  <tem:LowerLimit>${LowerLimit}</tem:LowerLimit>
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
          return "OK";
        } else {
          this.showError(`${mainSN} : ${result}`);
          return "NG";
        }
      } catch (error) {
        result == '綁定失敗，請檢查網絡或參數。'+ error
        this.showError('綁定失敗，請檢查網絡或參數。');
        return "SOAP ERROR";

      } finally{

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
.TestResultInByCsv {
  font-family: Arial, sans-serif;
  max-width: 100%;
  margin-left: 10px;
  padding: 20px;
  display: flex; /* 讓子元素左右排列 */
  gap: 100px; /* 左右區塊之間的間距 */
}

.excel-logo {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.hidden-file-input {
  display: none;
}

.table-container {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  border: 1px solid #746f6f;
  padding: 8px;
  text-align: left;
}

table th {
  background-color: #a8a7a7;
  font-weight: bold;
}

table tbody tr:nth-child(even) {
  background-color: #dfdfdf;
}

table tbody tr.row-error {
  background-color: #ff9393; /* 粉红色背景 */
}

.confirm-result{
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  gap: 10px; /* 元素之間的間距 */
}

#lblSucceed{
  color: #23d300;
  white-space:nowrap;
}

#lblFailed{
  color: #ff1900;
  white-space:nowrap;
}

</style>