// 元素尺寸监听器
class ElementSizeTracker {
  constructor(element) {
    this.element = element
    this.resizeObserver = null
    this.callbacks = new Set()
  }

  // 获取当前尺寸
  getSize() {
    const rect = this.element.getBoundingClientRect()
    return {
      width: rect.width,
      height: rect.height
    }
  }

  // 等待下一次渲染后获取尺寸
  async getSizeAfterUpdate() {
    // 如果文本已经改变，等待渲染
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve(this.getSize())
        })
      })
    })
  }

  // 监听尺寸变化
  onSizeChange(callback) {
    if (!this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        const size = this.getSize()
        this.callbacks.forEach(cb => cb(size))
      })
      this.resizeObserver.observe(this.element)
    }
    this.callbacks.add(callback)

    // 返回取消监听函数
    return () => {
      this.callbacks.delete(callback)
      if (this.callbacks.size === 0) {
        this.resizeObserver.disconnect()
        this.resizeObserver = null
      }
    }
  }

  // 销毁
  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
    this.callbacks.clear()
  }
}

export default ElementSizeTracker
