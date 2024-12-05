import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'select2/dist/css/select2.css';


//createApp(App).use(router).mount('#app') //原寫法
const app = createApp(App);
app.use(router);
app.mount('#app');
