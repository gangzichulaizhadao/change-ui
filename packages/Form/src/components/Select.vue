<script>
export default {
  name: 'MySelect',
  props: {
    slots: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  render(h) {
    return (
      <el-select {...{ attrs: this.$attrs }} {...{ on: this.$listeners }}>
        {Object.keys(this.slots).map(key => (
          <template slot={key}>{this.slots[key](h)}</template>
        ))}
        {this.options.map(item => (
          <el-option key={item.value} label={item.label} value={item.value} />
        ))}
      </el-select>
    )
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
