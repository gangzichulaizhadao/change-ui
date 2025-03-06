// import { message } from './message.js'
import BasicForm from './Form'
import BasicPagination from './Pagination'
import BasicTable from './Table'

export { BasicForm, BasicPagination, BasicTable }

export default {
  install(Vue) {
    // 在此处添加自定义的全局组件
    Vue.component('BasicForm', BasicForm)
    Vue.component('BasicPagination', BasicPagination)
    Vue.component('BasicTable', BasicTable)
    //在此处添加自定义的全局方法
    // Vue.prototype.$message = message
  }
}
