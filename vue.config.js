const { defineConfig } = require('@vue/cli-service')
const CMES_SERVICE_URL = process.env.CMES_SERVICE;
const EQP_SERVICE_URL = process.env.EQP_SERVICE;
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      /* 過站用 */
      '/IPublicCustomerShopFloor.asmx': {
        target: `${CMES_SERVICE_URL}`, // 目標伺服器
        changeOrigin: true, // 更改來源
        secure: false, // 如果使用 HTTPS，設置為 true
        headers: {
          'SOAPAction': 'http://tempuri.org/InsSNPassSEQ',
        },
        onProxyReq: (proxyReq) => {
          // 移除預檢請求的 'origin' header
          proxyReq.removeHeader('origin');
        },
      },

      /* 登入用 */
      '/OutsourcingCustom.asmx': {
        target: `${CMES_SERVICE_URL}`, // 目標伺服器
        changeOrigin: true, // 更改來源
        secure: false, // 如果使用 HTTPS，設置為 true
        headers: {
          'SOAPAction': 'http://tempuri.org/Login',
        },
        onProxyReq: (proxyReq) => {
          // 移除預檢請求的 'origin' header
          proxyReq.removeHeader('origin');
        },
      },
      
      /* 查詢Report用 */
      '/MFG': {
        target: `${EQP_SERVICE_URL}`, // API 地址
        changeOrigin: true, // 更改來源
        secure: false, // 如果使用 HTTPS，設置為 true

      },
      
    },
  },
  configureWebpack: {
    devtool: 'source-map'
  }
});