<template>
  <el-col v-bind="colAttrs">
    <el-form-item v-bind="formItemAttrs">
      <MyInput v-if="isShow('input')" v-bind="Attrs" v-on="Listeners" />
      <MySelect v-else-if="isShow('select')" v-bind="Attrs" v-on="Listeners" />
      <MyDate v-else-if="isShow(dateTypes)" v-bind="Attrs" v-on="Listeners" />
    </el-form-item>
  </el-col>
</template>

<script>
import { dateTypes } from './const'
import MyInput from './components/Input.vue'
import MySelect from './components/Select.vue'
import MyDate from './components/Date.vue'

export default {
  name: 'FormItem',
  components: { MyInput, MySelect, MyDate },
  props: {
    formItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dateTypes
    }
  },
  computed: {
    colAttrs() {
      const col = this.formItem.colAttrs
      const obj = col && col.span ? {} : { lg: 6, md: 8, sm: 12 }
      return { ...obj, ...col }
    },
    formItemAttrs() {
      return { label: '', ...this.formItem.formItemAttrs }
    },
    Attrs() {
      return {
        ...this.placeholder,
        ...this.$attrs,
        ...this.formItem.attrs,
        type: this.formItem.type,
        slots: this.formItem.slots || {}
      }
    },
    Listeners() {
      return { ...this.$listeners, ...this.formItem.listeners }
    },
    // 提示语
    placeholder() {
      const frontMsg = this.formItem.type === 'input' ? '请输入' : '请选择'
      const label = this.formItemAttrs.label
      return { placeholder: frontMsg + label }
    }
  },
  methods: {
    isShow(val) {
      if (Array.isArray(val)) {
        return val.includes(this.formItem.type)
      }
      return this.formItem.type === val
    }
  }
}
</script>
