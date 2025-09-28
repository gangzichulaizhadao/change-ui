<template>
  <el-pagination
    :current-page.sync="currentPage"
    :page-size.sync="pageSize"
    :total="total"
    :layout="layout"
    :page-sizes="pageSizes"
    :background="background"
    v-bind="$attrs"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
export default {
  name: 'BasicPagination',
  props: {
    current: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      required: true
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    pageSizes: {
      type: Array,
      default: () => [10, 50, 100, 500]
    },
    background: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.current
      },
      set(val) {
        this.$emit('update:current', val)
      }
    },
    pageSize: {
      get() {
        return this.size
      },
      set(val) {
        this.$emit('update:size', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      if (parseInt(this.total/val) < this.currentPage) {
        return
      }
      this.$emit('pagination', { current: this.currentPage, size: val })
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { current: val, size: this.pageSize })
    }
  }
}
</script>

<style scoped>
.el-pagination {
  text-align: right;
}
</style>
