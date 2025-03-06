import Vue from 'vue'
import App from './App.vue'

// import 'normalize.css/normalize.css'
import './core/format.css'

import './core/register'

import changeUI from '../packages'
Vue.use(changeUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
