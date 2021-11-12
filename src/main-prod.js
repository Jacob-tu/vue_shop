import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import api from '@/api/index.js'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://120.25.207.68:8889/api/private/v1/'
// axios 请求拦截
axios.interceptors.request.use(config => {
  //为请求头对象添加 Token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.prototype.$api = api

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.filter('dateFormat', function(value){
  const dt = new Date(value)
  const y = dt.getFullYear()
  const m = ('0'+(dt.getMonth()+1)).slice(-2)
  const d = ('0'+dt.getDate()).slice(-2)
  const hh = ('0'+dt.getHours()).slice(-2)
  const mm = ('0'+dt.getMinutes()).slice(-2)
  const ss = ('0'+dt.getSeconds()).slice(-2)
  return `${y}/${m}/${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
