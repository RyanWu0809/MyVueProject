const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// 讀取 .env 文件
const envConfig = dotenv.config().parsed;

// 讀取模板文件
const templatePath = path.join(__dirname, 'web.template.config'); // web.config 模板文件路徑
const template = fs.readFileSync(templatePath, 'utf-8');

// 替換占位符
const webConfig = template
  .replace(/{{CMES_SERVICE}}/g, envConfig.CMES_SERVICE)
  .replace(/{{EQP_SERVICE}}/g, envConfig.EQP_SERVICE);

// 寫入到 web.config
const outputPath = path.join(__dirname, 'dist', 'web.config'); // dist 是 Vue 預設的輸出目錄
fs.writeFileSync(outputPath, webConfig);

console.log('web.config 已成功生成到 dist 目錄');