<template>
  <el-date-picker style="width: 100%" v-bind="Attrs" v-on="$listeners" />
</template>

<script>
import { dateFormatMap } from '../const'

export default {
  name: 'MyDate',
  computed: {
    Attrs() {
      return {
        'value-format': dateFormatMap[this.$attrs.type] || '',
        ...this.$attrs
      }
    }
  }
}
</script>

<style scoped>
.el-date-editor {
  width: 100%;
}
</style>
