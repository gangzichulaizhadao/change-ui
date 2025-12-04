<template>
  <div
    ref="contentRef"
    class="ellipsis-content"
    :style="contentStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    {{ content }}
  </div>
</template>

<script>
import TooltipManager from '../TooltipManager'

export default {
  name: 'EllipsisOverflow',

  props: {
    // 文本内容
    content: {
      type: String,
      default: ''
    },

    // 显示行数：1（单行）、2 或 3
    lines: {
      type: Number,
      default: 3,
      validator: value => [1, 2, 3].includes(value)
    },

    // 是否显示 tooltip
    showTooltip: {
      type: Boolean,
      default: true
    },

    // tooltip 位置
    tooltipPlacement: {
      type: String,
      default: 'top'
    },

    // 内容处理函数（用于 tooltip 显示不同的内容）
    handleContent: {
      type: Function,
      default: null
    },

    // 是否将 tooltip 内容渲染为 HTML
    renderHtml: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isOverflowing: false,
      resizeObserver: null,
      checkTimer: null
    }
  },

  computed: {
    contentStyle() {
      const baseStyle = {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '1.5',
        cursor: this.isOverflowing && this.showTooltip ? 'pointer' : 'default'
      }

      // 单行样式
      if (this.lines === 1) {
        return {
          ...baseStyle,
          whiteSpace: 'nowrap',
          wordBreak: 'break-all'
        }
      }

      // 多行样式（2行或3行）
      return {
        ...baseStyle,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: this.lines,
        wordBreak: 'break-all',
        wordWrap: 'break-word'
      }
    }
  },

  watch: {
    content: {
      handler() {
        this.checkOverflow()
      },
      immediate: false
    },
    lines: {
      handler() {
        this.checkOverflow()
      },
      immediate: false
    }
  },

  mounted() {
    // 延迟检测，确保元素完全渲染
    setTimeout(() => {
      this.checkOverflow()
    }, 100)

    // 使用 ResizeObserver 监听元素大小变化
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        // 添加防抖
        clearTimeout(this._resizeTimer)
        this._resizeTimer = setTimeout(() => {
          this.checkOverflow()
        }, 100)
      })
      this.resizeObserver.observe(this.$refs.contentRef)
    } else {
      // 降级方案：监听窗口大小变化
      window.addEventListener('resize', this.handleResize)
    }
  },

  beforeDestroy() {
    // 清理定时器
    clearTimeout(this.checkTimer)
    clearTimeout(this._resizeTimer)

    // 清理 ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    } else {
      window.removeEventListener('resize', this.handleResize)
    }

    // 清理 tooltip
    TooltipManager.destroy()
  },

  methods: {
    /**
     * 检查文本是否超出指定行数
     */
    checkOverflow() {
      // 清除之前的定时器，避免重复检测
      clearTimeout(this.checkTimer)

      // 使用 setTimeout 确保 DOM 完全渲染
      this.$nextTick(() => {
        this.checkTimer = setTimeout(() => {
          const element = this.$refs.contentRef
          if (!element || !this.content) {
            this.isOverflowing = false
            return
          }

          // 单行文本：比较宽度
          if (this.lines === 1) {
            // 单行文本溢出检测：scrollWidth 大于 clientWidth
            this.isOverflowing = element.scrollWidth > element.clientWidth
          } else {
            // 多行文本溢出检测：使用更可靠的方法
            // 方法1：直接比较 scrollHeight 和 clientHeight
            const heightOverflow = element.scrollHeight > element.clientHeight

            // 方法2：通过克隆元素检测
            // 创建一个不受行数限制的克隆元素来获取真实高度
            const clone = element.cloneNode(true)
            clone.style.position = 'absolute'
            clone.style.visibility = 'hidden'
            clone.style.width = element.offsetWidth + 'px'
            clone.style.webkitLineClamp = 'unset'
            clone.style.display = 'block'

            element.parentNode.appendChild(clone)
            const fullHeight = clone.scrollHeight
            element.parentNode.removeChild(clone)

            const currentHeight = element.clientHeight

            // 如果完整高度大于当前高度，说明有溢出
            this.isOverflowing = heightOverflow || fullHeight > currentHeight
          }

          // 触发事件，告知父组件是否超出
          this.$emit('overflow', this.isOverflowing)
        }, 50)
      })
    },

    handleResize() {
      // 防抖处理
      clearTimeout(this._resizeTimer)
      this._resizeTimer = setTimeout(() => {
        this.checkOverflow()
      }, 100)
    },

    /**
     * 鼠标进入时显示 tooltip
     */
    handleMouseEnter(event) {
      if (!this.isOverflowing || !this.showTooltip || !this.content) {
        return
      }

      // 如果有 handleContent 函数，使用它处理内容
      let tooltipContent = this.content
      if (this.handleContent && typeof this.handleContent === 'function') {
        tooltipContent = this.handleContent(this.content)
      }

      // 传递 renderHtml 参数给 TooltipManager
      TooltipManager.show(event.currentTarget, tooltipContent, this.tooltipPlacement, this.renderHtml)
    },

    /**
     * 鼠标离开时隐藏 tooltip
     */
    handleMouseLeave() {
      TooltipManager.hide()
    }
  }
}
</script>

<style scoped>
.ellipsis-content {
  width: 100%;
  text-align: left;
}
</style>

<style>
/* 全局样式 - 用于动态创建的 tooltip */
.el-tooltip__popper.is-dark {
  background: #303133 !important;
  color: #fff !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
}

.el-tooltip__popper .popper__arrow {
  display: block !important;
}
</style>
