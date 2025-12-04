<template>
  <div ref="basicTableRef" :class="{'basicTable': autoHeight}">
    <!-- 可选列功能 -->
    <el-popover v-if="isCheckedColumns" placement="bottom" trigger="click" width="150">
      <el-checkbox-group v-model="checkedColumns">
        <el-checkbox v-for="column in baseColumns" :key="column.code" :label="column.code">{{ column.label }}</el-checkbox>
      </el-checkbox-group>
      <i class="el-icon-s-tools" slot="reference"></i>
    </el-popover>
    <!-- 列表 -->
    <el-table v-if="showTable" ref="tableRef" v-bind="tableAttrs" v-on="$listeners">
      <template v-for="(column, i) in renderColumns">
        <slot v-if="column.slot" :name="column.slot"></slot>
        <el-table-column v-else :key="column.code || column.prop || i" v-bind="columnAttrs(column)" />
      </template>
    </el-table>
    <!-- 分页 -->
    <BasicPagination v-if="showPagination" v-bind="pagination" v-on="pagination.events" />
  </div>
</template>

<script>
import ElementResizeDetector from 'element-resize-detector'
import BasicPagination from '../../Pagination'
import { cloneDeep } from 'lodash-es'

export default {
  name: 'BasicTable',
  components: { BasicPagination },
  props: {
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    // 是否自动撑开
    autoHeight: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object,
      default: () => {}
    },
    // 是否开启可选列功能
    isCheckedColumns: {
      type: Boolean,
      default: false
    },
    // 初始显示列数
    defaultColumnsNum: {
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      THeight: 0, // table 高度
      baseColumns: [],
      checkedColumns: [], // 选中列
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
    // 处理columns
    handleColumns() {
      const columns = this.isCheckedColumns ? this.baseColumns : this.columns
      return columns.map(column => {
        if (column.options) {
          column.formatter = this.formatterFn(column.options)
        }
        return column
      })
    },
    // 渲染列
    renderColumns() {
      const filterColumns = this.handleColumns.filter(column => this.checkedColumns.includes(column.code))
      return this.isCheckedColumns ? filterColumns : this.handleColumns
    }
  },
  created() {
    this.isCheckedColumns && this.initCheckedColumns()
  },
  mounted() {
    this.autoHeight && this.initHeight()
  },
  methods: {
    // 初始化选中列
    initCheckedColumns() {
      // this.baseColumns = JSON.parse(JSON.stringify(this.columns))
      this.baseColumns = cloneDeep(this.columns)
      this.baseColumns.forEach((item, i) => {
        item.code = item.prop ? item.prop : ''
        // 处理selection
        if (item.type === 'selection') {
          item.label = '全选/反选'
          item.code = 'selection'
        }
        // 处理index
        if (item.type === 'index') {
          item.code = 'index'
        }
        // 处理插槽
        if (item.slot) {
          item.code = item.slot
        }
        // 默认显示操作列
        if (item.slot === 'action') {
          this.checkedColumns.push(item.code)
        }

        i + 1 <= this.defaultColumnsNum && (this.checkedColumns.push(item.code))
      })
    },
    // 初始化高度
    initHeight() {
      const basicTableRef = this.resetHeight()
      ElementResizeDetector().listenTo(basicTableRef, this.resetHeight) // 监听变化
    },
    // 重置高度
    resetHeight() {
      const dom = this.$refs.basicTableRef
      const pageHeight = this.showPagination ? 50 : 0
      const setIconHeight = this.isCheckedColumns ? 5 : 0
      this.THeight = dom.clientHeight - pageHeight - setIconHeight
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
/* flex布局，basicTable占用除表单外的所有剩余高度 */
.basicTable {
  flex: 1;
  overflow: hidden;
}
.el-table {
  margin-bottom: 5px;
}
.el-checkbox {
  display: block;
}
.el-icon-s-tools {
  float: right;
  margin-right: 5px;
  cursor: pointer;
}
</style>
