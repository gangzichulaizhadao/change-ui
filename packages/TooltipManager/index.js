import Vue from 'vue'
import TooltipManagerComponent from './TooltipManager.vue'

/**
 * 全局单例 Tooltip 管理器
 * 用于创建和管理一个全局共享的 tooltip 实例
 * 避免在每个组件中都创建独立的 tooltip，提升性能
 */
class TooltipManager {
  constructor() {
    this.instance = null
    this.showTimer = null
    this.hideTimer = null
  }

  /**
   * 创建 tooltip 实例（单例模式）
   */
  createInstance() {
    if (this.instance) {
      return this.instance
    }

    const TooltipComponent = Vue.extend(TooltipManagerComponent)
    this.instance = new TooltipComponent().$mount()
    document.body.appendChild(this.instance.$el)

    /*
    场景：父子组件
    <template>
      <child-component @custom-event="handleEvent" />
    </template>
    等价于：
    const child = new ChildComponent()
    child.$on('custom-event', handleEvent)  // 父组件监听
    子组件内部: this.$emit('custom-event')  // 子组件触发
     */

    // 监听 tooltip 的鼠标事件
    this.instance.$on('tooltip-mouseenter', () => {
      clearTimeout(this.hideTimer)
    })
    this.instance.$on('tooltip-mouseleave', () => {
      this.hide()
    })

    return this.instance
  }

  /**
   * 显示 tooltip
   * @param {HTMLElement} referenceEl - 触发元素
   * @param {String} content - tooltip 内容
   * @param {String} placement - tooltip 位置 (top/bottom/left/right)
   * @param {Boolean} renderHtml - 是否渲染为 HTML
   */
  show(referenceEl, content, placement = 'top', renderHtml = false) {
    clearTimeout(this.showTimer)
    clearTimeout(this.hideTimer)
    this.showTimer = setTimeout(() => {
      this.createInstance().show(referenceEl, content, placement, renderHtml)
    }, 150)
  }

  /**
   * 隐藏 tooltip（延迟隐藏，给用户时间移入 tooltip）
   */
  hide() {
    clearTimeout(this.showTimer)
    clearTimeout(this.hideTimer)
    this.hideTimer = setTimeout(() => {
      this.instance && this.instance.hide()
    }, 150)
  }

  /**
   * 销毁 tooltip 实例
   */
  destroy() {
    clearTimeout(this.showTimer)
    clearTimeout(this.hideTimer)
    if (this.instance) {
      this.instance.$destroy()
      if (this.instance.$el && this.instance.$el.parentNode) {
        this.instance.$el.parentNode.removeChild(this.instance.$el)
      }
      this.instance = null
    }
  }
}

// 导出单例实例
export default new TooltipManager()
