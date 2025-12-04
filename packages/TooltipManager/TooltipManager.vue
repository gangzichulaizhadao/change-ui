<script>
import ElementSizeTracker from './ElementSizeTracker'

export default {
  name: 'TooltipManager',
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      referenceEl: null,
      content: '',
      placement: 'top',
      renderHtml: false,
      elementSizeTracker: null, // 用于监听 $el 尺寸变化
      elementSizeUnsubscribe: null // 用于取消监听
    }
  },
  computed: {
    popperStyle() {
      return {
        zIndex: 2000,
        position: 'absolute',
        maxWidth: '300px',
        padding: '10px',
        fontSize: '12px',
        lineHeight: '1.5',
        wordBreak: 'break-all',
        borderRadius: '4px',
        top: this.top + 'px',
        left: this.left + 'px',
        opacity: this.visible ? 1 : 0,
        transition: 'opacity 0.2s ease',
        pointerEvents: this.visible ? 'auto' : 'none',
        userSelect: 'text',
        cursor: 'text'
      }
    },
    arrowStyle() {
      const style = {
        position: 'absolute',
        width: 0,
        height: 0,
        borderColor: 'transparent',
        borderStyle: 'solid'
      }

      // 根据 placement 设置小三角位置和方向
      switch (this.placement) {
        case 'top':
          style.bottom = '-6px'
          style.left = '50%'
          style.marginLeft = '-6px'
          style.borderWidth = '6px 6px 0'
          style.borderTopColor = '#303133'
          break
        case 'bottom':
          style.top = '-6px'
          style.left = '50%'
          style.marginLeft = '-6px'
          style.borderWidth = '0 6px 6px'
          style.borderBottomColor = '#303133'
          break
        case 'left':
          style.right = '-6px'
          style.top = '50%'
          style.marginTop = '-6px'
          style.borderWidth = '6px 0 6px 6px'
          style.borderLeftColor = '#303133'
          break
        case 'right':
          style.left = '-6px'
          style.top = '50%'
          style.marginTop = '-6px'
          style.borderWidth = '6px 6px 6px 0'
          style.borderRightColor = '#303133'
          break
      }

      return style
    }
  },
  beforeDestroy() {
    this.elementSizeUnsubscribe && this.elementSizeUnsubscribe()
  },
  methods: {
    show(referenceEl, content, placement = 'top', renderHtml = false) {
      this.referenceEl = referenceEl
      this.content = content
      this.placement = placement
      this.renderHtml = renderHtml

      this.visible = true
      this.updatePosition()
    },
    hide() {
      this.visible = false
    },
    handleMouseEnter() {
      // 鼠标移入 tooltip 时，取消隐藏定时器
      this.$emit('tooltip-mouseenter')
    },
    handleMouseLeave() {
      // 鼠标移出 tooltip 时，触发隐藏
      this.$emit('tooltip-mouseleave')
    },
    // 更新位置
    async updatePosition() {
      if (!this.referenceEl || !this.$el) return

      if (!this.elementSizeTracker) {
        this.elementSizeTracker = new ElementSizeTracker(this.$el)
        this.elementSizeUnsubscribe = this.elementSizeTracker.onSizeChange(size => {
          this.computedPosition(size)
        })
      }

      const popperRect = await this.elementSizeTracker.getSizeAfterUpdate()
      this.computedPosition(popperRect)
    },
    // 计算位置
    computedPosition(popperRect) {
      const refRect = this.referenceEl.getBoundingClientRect()

      let top = 0
      let left = 0
      const arrowSize = 6 // 小三角的大小

      // 根据 placement 计算位置
      switch (this.placement) {
        case 'top':
          top = refRect.top - popperRect.height - arrowSize - 2
          left = refRect.left + (refRect.width - popperRect.width) / 2
          break
        case 'bottom':
          top = refRect.bottom + arrowSize + 2
          left = refRect.left + (refRect.width - popperRect.width) / 2
          break
        case 'left':
          top = refRect.top + (refRect.height - popperRect.height) / 2
          left = refRect.left - popperRect.width - arrowSize - 2
          break
        case 'right':
          top = refRect.top + (refRect.height - popperRect.height) / 2
          left = refRect.right + arrowSize + 2
          break
      }

      // 边界检测
      if (left < 10) left = 10
      if (left + popperRect.width > window.innerWidth - 10) {
        left = window.innerWidth - popperRect.width - 10
      }
      if (top < 10) top = 10

      // 更新 data，触发响应式更新
      this.top = top + window.scrollY
      this.left = left + window.scrollX
    }
  },
  render() {
    return (
      <div
        class="el-tooltip__popper is-dark"
        style={this.popperStyle}
        role="tooltip"
        x-placement={this.placement}
        onMouseenter={this.handleMouseEnter}
        onMouseleave={this.handleMouseLeave}
      >
        {this.renderHtml ? <span domPropsInnerHTML={this.content} /> : this.content}
        <div class="popper__arrow" style={this.arrowStyle} />
      </div>
    )
  }
}
</script>
