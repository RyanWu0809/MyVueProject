# MyVueProject
ShopFloor Practice

## 目錄結構
```
.
├── dist (npm run build 打包生成)
│   └── web.config (打包時由generate-web-config.js 生成)
├── node_modules (node安裝的工具模組)
├── public 
│   ├── index.html 
│   └── Logo.ico (客製主圖示)
├── src (原始碼)
│   ├── assets 
│   │   └── styles 
│   │       └── common.css 
│   ├── components (客製組件.vue原碼)
│   ├── router 
│   │   └── index.js (路由邏輯)
│   ├── views (頁面.vue原碼)
│   ├── App.vue 
│   └── main.js 
├── .env (dev環境 webserivce IP設定)
├── .env.production (prod環境 webserivce IP設定)
├── vue.config.js (vue相關設定，包含開發環境的proxy代理設定)
├── generate-web-config.js (腳本，用來生成web.config)
└── web.template.config (模板，用來生成web.config)
```

## 部署IIS說明
參考網址 : https://www.ctong.top/posts/publish-vue3-website-with-iis  
1. 執行npm run build，會打包在dist資料夾裡
2. 打開IIS服務 >> 左側功能欄找到"站台" >> 右鍵新增網站
3. 將新增的網站路徑指到打包好的dist資料夾
4. 需至 https://www.iis.net/downloads/microsoft/application-request-routing  下載 IIS ARR 
   https://www.iis.net/downloads/microsoft/url-rewrite  下載 IIS URL Rewrite
   實現proxy代理及重新導向


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
