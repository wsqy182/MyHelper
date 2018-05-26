import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

/**
 * 引入element-ui 全部的组件
 */


// 如果进程环境为非web环境,将在vue中使用vue-electron
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
//原型挂在axios为vue的http代理
Vue.http = Vue.prototype.$http = axios
// 关闭产品提示
Vue.config.productionTip = false


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    store,
    template: '<App/>'
}).$mount('#app')
