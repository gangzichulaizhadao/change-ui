<template>
  <div ref="basicTableRef" class="basicTable">
    <el-table v-if="showTable" ref="tableRef" v-bind="tableAttrs" v-on="$listeners">
      <template v-for="(column, i) in renderColumns">
        <slot v-if="column.slot" :name="column.slot"></slot>
        <el-table-column v-else :key="column.prop || i" v-bind="columnAttrs(column)" />
      </template>
    </el-table>
    <BasicPagination v-if="showPagination" v-bind="pagination" v-on="pagination.events" />
  </div>
</template>

<script>
import ElementResizeDetector from 'element-resize-detector'
import BasicPagination from '../../Pagination'

export default {
  name: 'BasicTable',
  components: { BasicPagination },
  props: {
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    // 是否自动撑开, false 时需要设置高度height属性
    autoHeight: {
      type: Boolean,
      default: true
    },
    pagination: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      THeight: 0 // table 高度
    }
  },
  computed: {
    showTable() {
      if (this.autoHeight) return this.THeight > 0
      return true
    },
    tableAttrs() {
      return {
        height: this.tableHeight,
        border: true,
        ...this.$attrs
      }
    },
    tableHeight() {
      return this.autoHeight ? this.THeight : undefined
    },
    showPagination() {
      return this.pagination && this.pagination.total >= 0
    },
    renderColumns() {
      return this.columns.map(column => {
        if (column.options) {
          column.formatter = this.formatterFn(column.options)
        }
        return column
      })
    }
  },
  mounted() {
    this.initHeight()
  },
  methods: {
    // 初始化高度
    initHeight() {
      const basicTableRef = this.resetHeight()
      ElementResizeDetector().listenTo(basicTableRef, this.resetHeight) // 监听变化
    },
    // 重置高度
    resetHeight() {
      const dom = this.$refs.basicTableRef
      const pageHeight = this.showPagination ? 50 : 0
      this.THeight = dom.clientHeight - pageHeight
      return dom
    },
    columnAttrs(column) {
      return {
        align: 'center',
        ...column
      }
    },
    // 格式化函数
    formatterFn(options = []) {
      return (_, __, cellValue) => {
        const cont = options.find(item => item.value == cellValue)
        if (cont) return cont.label
        return ''
      }
    }
  }
}
</script>

<style scoped>
.basicTable {
  flex: 1;
}
.el-table {
  margin-bottom: 5px;
}
</style>
