<template>
  <el-col v-bind="colAttrs">
    <el-form-item v-bind="formItemAttrs">
      <slot />
    </el-form-item>
  </el-col>
</template>

<script>
export default {
  name: 'FormSlot',
  props: {
    formItem: {
      type: Object,
      default: () => {}
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
    }
  }
}
</script>
