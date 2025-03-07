<p align="center">
    change-uid
</p>
<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.14-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.15.14-brightgreen.svg" alt="element-ui">
  </a>
</p>


## 简介

使用 [vue2](https://github.com/vuejs/vue) 和 [element-ui](https://github.com/ElemeFE/element) 实现
可通过配置json格式数据生成form表单和table表格

#### 完整引入

在 main.js 中写入以下内容：

```
import Vue from 'vue';
import App from './App.vue';
import ChangeUI from 'change-uid';

Vue.use(ChangeUI);

new Vue({
  el: '#app',
  render: h => h(App)
});
```
#### 按需引入

```
import { BasicForm, BasicPagination, BasicTable } from 'change-uid'

export default {
	components: {
		BasicForm,
		BasicPagination,
		BasicTable
	}
}
```

#### 使用方法

详细的方法请查看examples文件

```
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
export default {
  name: 'App',
  data() {
    return {
      params: {
        address: ''
      },
      formList：[
          {
            type: 'datetimerange',
            formItemAttrs: {
              label: '日期',
              prop: 'date',
              required: true
            },
            listeners: {
              change: val => {
                console.log(val)
              }
            }
          },
          {
            type: 'input',
            formItemAttrs: {
              label: '名称',
              prop: 'name',
              required: true
            },
            listeners: {
              blur: e => {
                console.log(e, 'blur')
              },
              clear: () => {
                console.log('clear')
              }
            },
            slots: {
              prefix: () => {
                return <i class="el-input__icon el-icon-search" />
              }
            }
          },
          {
            type: 'select',
            formItemAttrs: {
              label: '性别',
              prop: 'sex',
              rules: [
                { required: true, message: '请输入名称', trigger: 'blur' }
              ]
            },
            attrs: {
              clearable: true,
              options: [
                {
                  label: '男',
                  value: 1
                },
                {
                  label: '女',
                  value: 0
                }
              ]
            },
            listeners: {
              change: val => {
                console.log(val, 111)
              },
              focus: val => {
                console.log(val, 222)
              }
            }
          },
          {
            slot: 'a',
            formItemAttrs: {
              label: '地区',
              prop: 'address',
              required: true
            }
         }
      ],
      tableData: [{}],
      tableColumns: [
          {
            label: '日期',
            prop: 'date',
            formatter: row => {
              return row.date + ' 11:11:11'
            }
          },
          {
            label: '名称',
            prop: 'name'
          },
          {
            label: '性别',
            prop: 'sex',
            align: 'left',
            options: [
              {
                label: '男',
                value: 1
              },
              {
                label: '女',
                value: 0
              }
            ]
          }
        ],
      pagination: {
          current: 1,
          size: 10,
          total: 100,
          events: {
            'update:current': val => (this.pagination.current = val),
            'update:size': val => (this.pagination.size = val),
            pagination: ({ current, size }) => {
              console.log(current, size, this.pagination)
            }
          }
        }
    }
  },
  methods: {
    async handleSave() {
      const resp = await this.$refs.FormRef.validate()
      console.log('🚀 ~ handleSave ~ resp:', resp, this.$refs.FormRef.getFormData())
    },
    reset() {
      this.$refs.FormRef.resetFields()
      this.params.address = ''
      console.log(this.$refs.FormRef.getFormData())
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

```

