<template>
  <div class="app">
    <BasicForm
      ref="FormRef"
      :formList="formList"
      :slotParams="params"
      label-width="80px"
      @ok="handleSave"
      @reset="reset"
    >
      <template #a>
        <el-input v-model="params.address"></el-input>
      </template>
      <template #afterBtn>
        <el-button>111</el-button>
      </template>
    </BasicForm>
    <!-- :autoHeight="false"  height="1000" -->
    <BasicTable :data="tableData" :columns="tableColumns" :pagination="pagination"></BasicTable>
  </div>
</template>

<script>
import { receiveThis, formList, tableData, tableColumns, pagination } from './core/config'

export default {
  name: 'App',
  data() {
    return {
      params: {
        address: ''
      },
      formList,
      tableData,
      tableColumns,
      pagination
    }
  },
  created() {
    receiveThis(this)
  },
  methods: {
    inputBlur() {
      console.log('blur', this.params.address)
    },
    getParams() {
      return {
        ...this.$refs.FormRef.getFormData(),
        pageNum: this.pagination.current,
        pageSize: this.pagination.size
      }
    },
    async handleSave() {
      const resp = await this.$refs.FormRef.validate()
      console.log('🚀 ~ handleSave ~ resp:', resp, this.getParams())
    },
    reset() {
      this.$refs.FormRef.resetFields()
      this.params.address = ''
      console.log(this.getParams())
    }
  }
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}
</style>
