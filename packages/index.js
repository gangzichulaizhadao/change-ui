// import { message } from './message.js'
import BasicForm from './Form'
import BasicPagination from './Pagination'
import BasicTable from './Table'
import EllipsisOverflow from './EllipsisOverflow'
import elTable from './elTable'

export { BasicForm, BasicPagination, BasicTable }

export default {
  install(Vue) {
    // 在此处添加自定义的全局组件
    Vue.component('BasicForm', BasicForm)
    Vue.component('BasicPagination', BasicPagination)
    Vue.component('BasicTable', BasicTable)
    Vue.component('EllipsisOverflow', EllipsisOverflow)

    Vue.component('elTable', elTable)
    //在此处添加自定义的全局方法
    // Vue.prototype.$message = message
  }
}
