<template>
  <div class="app">
    <BasicForm
      ref="FormRef"
      :formList="formList"
      :slotParams="params"
      label-width="80px"
      expandOrCollapse
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
    <BasicTable :data="tableData" :columns="tableColumns" autoHeight isCheckedColumns :pagination="pagination">
      <el-table-column slot="chacao" label="插槽">插槽</el-table-column>
      <el-table-column slot="content" label="内容" width="250">
        <template slot-scope="{ row }">
          <ellipsis-overflow
            :content="row.content"
            :lines="3"
            show-tooltip
          />
        </template>
      </el-table-column>
      <el-table-column slot="action" align="center" width="180" label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </BasicTable>
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
    handleEdit(row) {
      console.log(row)
    },
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
