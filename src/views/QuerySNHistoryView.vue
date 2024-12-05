<template>
   <div class = "QuerySNHistoryView">
    <div class="section-box">
      <h4><b>查詢條件</b></h4>
      <div class="divider"></div>
      <div class="input-condition">
        <label for="mainSN">主序號</label>
        <input type="text" id="mainSN" class="input-query" v-model="mainSN" placeholder="請輸入主序號" style="width: 300px" />
      </div>
      <div class="input-condition">
        <label for="currentSEQ">當前站</label>
        <select id="selStatus" class="select2" data-placeholder="請選擇多個項目" style="width: 70%;" name="SEQ[]" multiple="multiple">
          <option value="1" selected>組件綁定</option>
          <option value="2" selected>治具綁定</option>
          <option value="3" selected>焊钎過站</option>
          <option value="4" selected>測試結果導入</option>
        </select>
      </div>
      <div class="input-condition">
        <label for="inputDate">入站日期</label>
        <Datepicker
          id="dateRange"
          v-model="inputDateRange"
          range
          format="yyyy/MM/dd"
          placeholder="請選擇日期範圍"
          class="input-query"
          style="width: 300px;"
        />
        <!-- 查詢按鈕 -->
        <button class="confirm-button" @click="Query_Click" style="width: 200px; margin-left: 20px;">
          <i class="fas fa-search" style="margin-right: 8px;"></i>查詢
        </button>
      </div>
    </div>
    <div class="QueryResults">
      <div class="section-box left-section">
        <h4><b>查詢結果</b></h4>
        
        <div class="divider"></div>

        <!-- 分頁元件 -->
        <Pagination v-if="queryResults.length > 0" :results="queryResults" :itemsPerPage="10" ref="Pagination">
          <template #default="{ results }">
            <!-- 箭頭容器 -->
            <div v-if="selectedArrowTop !== null && selectedSNCurrentPage == GetCurrentResultPage()" class="arrow-indicator" 
            :style="{ top: selectedArrowTop + 'px' }">
              ➡️
            </div>
            <!-- 表格 -->
            <table v-if="results.length > 0" class="table-container" ref="queryTable">
              <thead>
                <tr>
                  <th>序號</th>
                  <th>當前站</th>
                  <th>入站時間</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in results" :key="index" ref="rows"
                @click="QueryDtl_Click(item, index)" :class="{ 'selected-row': selectedSN === item.SN }">
                  <td style="border-left: none; border-bottom: none;">{{ item.SN }}</td>
                  <td style="border-bottom: none;">{{ getStationLabel(item.SEQ) }}</td>
                  <td style="border-right: none; border-bottom: none;">{{ item.UPDATE_DATE }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </Pagination>
      </div>
      <div class="section-box right-section">
        <h4><b>過站明細</b></h4>
        <div class="divider"></div>
        <table v-if="queryDtlResults.length > 0" class="table-container">
          <thead>
            <tr>
              <th>序號</th>
              <th>站別</th>
              <th>入站時間</th>
              <th>綁定組件/治具數</th>
              <th>測試數據項目數</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in queryDtlResults" :key="index">
              <td style="border-left: none; border-bottom: none;">{{ item.SN }}</td>
              <td style="border-bottom: none;">{{ getStationLabel(item.SEQ) }}</td>
              <td style="border-bottom: none;">{{ item.INPUT_TIME }}</td>
              <td style="border-bottom: none;">
                <a v-if="item.COUNT_COMPONENTS > 0" href="#" @click.prevent="showComponentPanel(item.SN, item.SEQ)">{{ item.COUNT_COMPONENTS }}</a>
              </td>
              <td style="border-right: none; border-bottom: none;">
                <a v-if="item.COUNT_TEST_RESULTS > 0" href="#" @click.prevent="showTestResultPanel(item.SN, item.SEQ)">{{ item.COUNT_TEST_RESULTS }}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 模態背景遮罩 -->
      <div v-if="isModal" class="modal-backdrop"></div>

      <!-- 彈出面板 -->
      <div v-if="isModal && isComponentPanel" id="componentPanel" class="modal-panel">
        <div class="modalPanel-header">
          <h4>{{ComponentPanelHeader}}</h4>
          <button @click="closeComponentPanel">關閉</button>
        </div>
        <table v-if="componentData.length > 0" class="modal-table">
          <thead>
            <tr>
              <th>組件類型</th>
              <th>組件序號</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in componentData" :key="index">
              <td style="border-left: none; border-bottom: none;">{{ item.COMPONENT_TYPE }}</td>
              <td style="border-right: none; border-bottom: none;">{{ item.COMPONENT_SN }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="isModal && isTestResultPanel" id="testResultPanel" class="modal-panel">
        <div class="modalPanel-header">
          <h4>{{TestResultPanelHeader}}</h4>
          <button @click="closeTestResultPanel">關閉</button>
        </div>
        <table v-if="testResultData.length > 0" class="modal-table">
          <thead>
            <tr>
              <th>測試類型</th>
              <th>測試值</th>
              <th>上限</th>
              <th>下限</th>
              <th>測試結果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in testResultData" :key="index">
              <td style="border-left: none; border-bottom: none;">{{ item.TEST_TYPE }}</td>
              <td style="border-bottom: none;">{{ item.TEST_VALUE }}</td>
              <td style="border-bottom: none;">{{ item.UPPER_LIMIT }}</td>
              <td style="border-bottom: none;">{{ item.LOWER_LIMIT }}</td>
              <td style="border-right: none; border-bottom: none;">{{ item.TEST_RESULT }}</td>
            </tr>
          </tbody>
        </table>
      </div>


    </div>


    <!-- 顯示 loading 動畫 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import $ from 'jquery';
import 'select2';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Pagination from '../components/Pagination.vue'; // 引入 Pagination 組件

export default {
  name: 'QuerySNHistoryView',
  components: {
    Datepicker,
    Pagination,
  },
  data() {
    return {
      loading: false, // 新增 loading 狀態
      mainSN: '', // 綁定主序號的值
      inputDateRange: null, // 日期範圍值（開始日期與結束日期）
      selectedSN: null, // 當前選中的序號
      selectedArrowTop: null,  // 箭頭的垂直位置
      selectedSNCurrentPage: null, // 當前選中序號的頁碼
      queryResults: [], // 查詢結果
      queryDtlResults: [], // 查詢過站明細
      isModal: false, // 控制modal面板顯示
      isComponentPanel: false, // 控制組件細節面板顯示
      isTestResultPanel: false, // 控制測試結果面板顯示
      componentData: [], // 組件細節
      testResultData: [], // 測試結果數據
      ComponentPanelHeader: null, //組件細節面板標題
      TestResultPanelHeader: null, //測試結果面板標題
    };
  },
  mounted() {
    this.$emit('update-title', '序號追蹤');
    // 初始化 select2 插件
    $('#selStatus').select2({
      placeholder: '請選擇多個項目', // 設置佔位提示
      theme: "classic",
    });
  },
  computed: {
    formattedDateRange() {
      // 檢查是否有選擇範圍
      if (this.inputDateRange && this.inputDateRange.length === 2) {
        // 將 ISO 日期格式轉換為 yyyy/MM/dd
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const startDate = new Date(this.inputDateRange[0]).toLocaleDateString('zh-TW', options);
        const endDate = new Date(this.inputDateRange[1]).toLocaleDateString('zh-TW', options);
        return `${startDate} - ${endDate}`;
      }
      return null;
    },
  },
  inject: ['showSuccess', 'showWarning', 'showError'], // 注入 App.vue 提供的方法
  methods: {
    // Click 動作
    Query_Click(){
      let SN = this.mainSN;
      if (this.inputDateRange && (this.inputDateRange[0] === null || this.inputDateRange[1] === null)) {
        this.showWarning('未選擇日期範圍');
        return;
      }

      let SEQ = '';
      var selStatus = document.getElementById("selStatus")
      for (var i = 0; i < selStatus.length; i++) {
        if (selStatus.options[i].selected == true) {
          SEQ += selStatus.options[i].value + ",";
        }
      }
      this.fetchData(SN, SEQ, this.formattedDateRange);
      this.queryDtlResults = [];
      this.selectedArrowTop = null;
      this.selectedSN = null;
    },

    QueryDtl_Click(item, index){
      this.selectedSN = item.SN; // 設置選中的序號
      this.selectedSNCurrentPage = this.GetCurrentResultPage(); // 訪問Pagnation的當前頁碼
      this.fetchDtlData(item.SN);

      // 使用 nextTick 確保 DOM 更新完成後再進行位置計算

        // 獲取點擊的行元素
        const rowElement = this.$refs.rows[index];
        if (rowElement) {
          // 使用 getBoundingClientRect() 計算元素的 top 屬性
          const rowRect = rowElement.getBoundingClientRect();
          // 設置箭頭的位置
          this.selectedArrowTop = rowRect.top + window.scrollY; // 加上頁面滾動位置
        }

    },

    GetCurrentResultPage() {
      return this.$refs.Pagination.currentPage; // 訪問Pagnation的當前頁碼
    },

    showComponentPanel(SN, SEQ) {
      this.ComponentPanelHeader = SN + " - " + this.getStationLabel(SEQ) + "_已綁組件"

      this.fetchComponentData(SN, SEQ);
      this.isModal = true; // 顯示細節面板
      this.isComponentPanel = true;
    },

    showTestResultPanel(SN, SEQ) {
    this.TestResultPanelHeader = SN + " - " + this.getStationLabel(SEQ) + "_測試資料"

      this.fetchTestResultData(SN, SEQ);
      this.isModal = true; // 顯示細節面板
      this.isTestResultPanel = true;
    },

    // 關閉modal面板
    closeComponentPanel() {
      this.isModal = false;
      this.isComponentPanel = false;
      this.componentData = []; // 清空數據
    },
    closeTestResultPanel(){
      this.isModal = false;
      this.isTestResultPanel = false;
      this.testResultData = []; // 清空數據
    },



    // call API
    async fetchData(SN, SEQ, StartEndDate) {
      try {
        this.loading = true; // 開始顯示 loading
        const response = await axios.post('/MFG/QueryCustomerSNInfo/', {
            sAdAccount: null,
            SN: SN,
            SEQ: SEQ,
            StartEndDate: StartEndDate,
        }, {
          timeout: 60000, // 超時設定
        });

        if (response.data['RTN_COD'] !== '0000') {
          this.showError(response.data['RTN_MSG']);
          return;
        }
        var parsed = JSON.parse(response.data['RTN_RST']);
        // 設置查詢結果 ==>排序：根據入站時間（UPDATE_DATE）排序，從最新到最舊
        this.queryResults = parsed.sort((a, b) => {
          return new Date(b.UPDATE_DATE) - new Date(a.UPDATE_DATE);
        });
        
      } catch (error) {
        console.error('API 請求錯誤', error);
        this.showError("API 請求錯誤" + error);
      }
      finally{ this.loading = false; // loading動畫結束
      }
    },

    async fetchDtlData(SN) {
      try {
        this.loading = true; // 開始顯示 loading

        const response = await axios.post('/MFG/QueryCustomerSNDetail/', {
            sAdAccount: null,
            SN: SN,
        }, {
          timeout: 60000, // 超時設定
        });

        if (response.data['RTN_COD'] !== '0000') {
          this.showError(response.data['RTN_MSG']);
          return;
        }
        var parsed = JSON.parse(response.data['RTN_RST']);
        // 設置查詢結果 ==>排序：根據入站時間（SEQ）排序，從最新到最舊
        this.queryDtlResults = parsed.sort((a, b) => {
          return parseInt(a.SEQ) - parseInt(b.SEQ);
        });
        
      } catch (error) {
        console.error('API 請求錯誤', error);
        this.showError("API 請求錯誤" + error);
      }
      finally{ this.loading = false; // loading動畫結束
      }
    },

    async fetchComponentData(SN, SEQ) {
      try {
        this.loading = true; // 開始顯示 loading
        const response = await axios.post('/MFG/QueryCustomerSNComponents/', {
            sAdAccount: null,
            SN: SN,
            SEQ: SEQ,
        }, {
          timeout: 60000, // 超時設定
        });

        if (response.data['RTN_COD'] !== '0000') {
          this.showError(response.data['RTN_MSG']);
          return;
        }
        var parsed = JSON.parse(response.data['RTN_RST']);
        // 設置查詢結果 ==>排序：根據入站時間（SEQ）排序，從最新到最舊
        this.componentData = parsed;
        
      } catch (error) {
        console.error('API 請求錯誤', error);
        this.showError("API 請求錯誤" + error);
      }
      finally{ this.loading = false; // loading動畫結束
      }
    },

    async fetchTestResultData(SN, SEQ) {
      try {
        this.loading = true; // 開始顯示 loading
        const response = await axios.post('/MFG/QueryCustomerTestResultRec/', {
            sAdAccount: null,
            SN: SN,
            SEQ: SEQ,
        }, {
          timeout: 60000, // 超時設定
        });

        if (response.data['RTN_COD'] !== '0000') {
          this.showError(response.data['RTN_MSG']);
          return;
        }
        var parsed = JSON.parse(response.data['RTN_RST']);
        // 設置查詢結果 ==>排序：根據入站時間（SEQ）排序，從最新到最舊
        this.testResultData = parsed;
        
      } catch (error) {
        console.error('API 請求錯誤', error);
        this.showError("API 請求錯誤" + error);
      }
      finally{ this.loading = false; // loading動畫結束
      }
    },



    // 根據 SEQ 值來顯示對應的當前站描述
    getStationLabel(value) {
      switch (value) {
        case 1: return "組裝綁定(1)";
        case 2: return "治具綁定(2)";
        case 3: return "焊钎過站(3)";
        case 4: return "測試結果導入(4)";
        default: return "未知站別";
      }
    },


  },
  
};
</script>

<style scoped src="@/assets/styles/common.css"></style>
<style scoped>

.QuerySNHistoryView {
  font-family: Arial, sans-serif;
  padding: 20px;
  height: 100vh;
}

/* ::v-deep 深度選擇器 */
::v-deep .select2-container--classic .select2-selection--multiple {
  height: 40px;
}
::v-deep .select2-container--classic .select2-search--inline .select2-search__field{
  height: 70%;
  margin-left: 10px;
  margin-right: 10px;
}
::v-deep .select2-container--classic .select2-selection--multiple .select2-selection__choice {
  background-color: #397597 !important;
  border: 1px solid #265a79 !important;
  color: #fff !important;
}
::v-deep .select2-container--classic .select2-selection--multiple .select2-selection__choice__remove{
  color: #fff !important;
}

.QueryResults{
  display: flex;
  justify-content: flex-start;
}

.left-section {
  width: 35%;
  margin-right: 20px;
}

/* 表格行hover效果 */
.left-section tr:hover{
  background-color: #f0f0f0;
}

.right-section {
  width: 65%;
}

.table-container {
  margin-top: 20px;
  margin-bottom: 20px;
  border: none;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: none;
}

table th {
  background-color: #3498db;
  font-weight: bold;
  color: #fff;
  border: 1px solid #fff;
  padding: 10px;
  text-align: left;
  white-space:nowrap;
}

table td {
  border: 1px solid #afb6b8;
  padding: 10px;
  text-align: left;
  white-space:nowrap;
}

/* 被選中的行樣式 */
.selected-row {
  background-color: #f0f0f0;
}

/*選中行箭頭 */
.arrow-indicator {
  position: absolute;
  left: 289px; /* 根據需求調整箭頭的水平位置 */
  font-size: 14px; /* 可調整箭頭大小 */
  transition: top 0.3s ease; /* 平滑過渡效果 */
  transform: translateY(50%);
}


</style>
