<template>
  <el-form ref="formRef" :model="formData" :rules="rules" v-bind="$attrs" v-on="$listeners">
    <el-row :gutter="20" type="flex">
      <template v-for="(item, index) in baseFormList">
        <FormSlot v-if="item.slot" :key="index" :form-item="item">
          <slot :name="item.slot" />
        </FormSlot>
        <FormItem
          v-else
          :key="index"
          v-model="formData[item.formItemAttrs.prop]"
          :form-item="item"
        />
      </template>
      <!-- 按钮 -->
      <el-col v-if="$listeners.ok || $listeners.reset" class="form-btn">
        <el-button v-if="$listeners.ok" type="primary" icon="el-icon-search" @click="$emit('ok')">{{
          okText
        }}</el-button>
        <el-button v-if="$listeners.reset" icon="el-icon-refresh-right" @click="$emit('reset')">{{
          resetText
        }}</el-button>
        <slot name="afterBtn"></slot>
        <span v-if="expandOrCollapse" class="fold-btn" @click="expandOrCollapseFn">
          <i :class="`el-icon-arrow-${this.isAllFold ? 'down' : 'up'}`" />
          <el-button type="text">{{ this.isAllFold ? '展开' : '收起'}}</el-button>
        </span>
      </el-col>
      <slot name="button"></slot>
    </el-row>
  </el-form>
</template>

<script>
import { dateTypes } from './const'
import FormItem from './FormItem.vue'
import FormSlot from './FormSlot.vue'

export default {
  name: 'BasicForm',
  components: { FormItem, FormSlot },
  props: {
    okText: {
      type: String,
      default: '查询'
    },
    resetText: {
      type: String,
      default: '重置'
    },
    // 插槽表单的数据
    slotParams: {
      type: Object,
      default: () => ({})
    },
    formList: {
      type: Array,
      default: () => []
    },
    // 展开/收起
    expandOrCollapse: {
      type: Boolean,
      default: false
    },
    // 展开/收起默认显示的个数
    foldNum: {
      type: Number,
      default: 8
    }
  },
  watch: {
    slotParams: {
      handler(val) {
        this.formData = { ...this.formData, ...val }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    baseFormList() {
      return this.expandOrCollapse ? this.handleFormList.filter(item => !item.fold) : this.formList
    }
  },
  data() {
    return {
      isAllFold: true,
      handleFormList: [], // 处理后的表单列表
      formData: {},
      rules: {}
    }
  },
  created() {
    this.initRules()
    this.expandOrCollapse && this.handleList()
  },
  methods: {
    // 初始化校验规则
    initRules() {
      const typeList = ['input']
      const trigger = ['blur', 'change']
      this.formList.forEach(item => {
        // 解构赋值
        const {
          type,
          formItemAttrs: { required, prop, label }
        } = item
        // 初始化字段
        if (type) {
          this.$set(this.formData, prop, '')
        }
        // 初始化校验规则
        if (required) {
          const frontMsg = typeList.includes(item.type) ? '请输入' : '请选择'
          const message = frontMsg + label
          // this.$set(this.rules, prop, [{ required: true, message, trigger }])
          this.rules[prop] = [{ required: true, message, trigger }]
        }
      })
    },
    // 处理表单列表
    handleList() {
      this.handleFormList = JSON.parse(JSON.stringify(this.formList))
      this.handleFormList.forEach((item, i) => (this.$set(item, 'fold', i + 1 > this.foldNum)))
    },
    // 展开或折叠表单
    expandOrCollapseFn() {
      this.isAllFold = this.handleFormList.every(item => !item.fold)
      this.handleFormList.forEach((item, i) => (item.fold = this.isAllFold ? i + 1 > this.foldNum : false))
    },
    // 校验整个表单
    validate() {
      // eslint-disable-next-line
      return new Promise(async (resolve, reject) => {
        try {
          await this.$refs.formRef.validate()
          resolve(this.formData)
        } catch (error) {
          reject(error)
        }
      })
    },
    // 重置表单
    resetFields() {
      this.$refs.formRef.resetFields()
      // 这里需要处理时间表单的重置
      this.formList
        .map(item => (dateTypes.includes(item.type) ? item.formItemAttrs.prop : false))
        .forEach(item => item && (this.formData[item] = null))
    },
    // 获取表单数据
    getFormData() {
      return this.formData
    }
  }
}
</script>

<style scoped>
.el-row {
  flex-wrap: wrap;
}
.form-btn {
  margin-left: 20px;
}
.fold-btn {
  float: right;
  cursor: pointer;
  margin-right: 6px;
}
.fold-btn i {
  color: #409eff;
  font-size: 14px;
}
.fold-btn .el-button {
  font-size: 14px;
}
</style>
