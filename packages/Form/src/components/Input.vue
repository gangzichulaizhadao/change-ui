<script>
export default {
  name: 'MyInput',
  props: {
    slots: {
      type: Object,
      default: () => {}
    }
  },
  render(h) {
    return (
      <el-input {...{ attrs: { clearable: true, ...this.$attrs }, on: this.$listeners }}>
        {Object.keys(this.slots).map(key => (
          <template slot={key}>{this.slots[key](h)}</template>
        ))}
      </el-input>
    )
  }
}
</script>
