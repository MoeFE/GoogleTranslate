import anime from 'animejs'
import throttle from 'lodash.throttle'

export class WindowHelper {
  static _throttleSetSizeFunc = null
  static setSize (width, height, animate) {
    if (WindowHelper._throttleSetSizeFunc === null) {
      WindowHelper._throttleSetSizeFunc = throttle((width, height, animate) => {
        const targets = { width: window.innerWidth, height: window.innerHeight }
        if (width === targets.width && height === targets.height) window.resizeTo(targets.width, targets.height) // 防抖动
        else anime({ targets, width, height, ...animate, update: () => window.resizeTo(targets.width, targets.height) })
      }, animate.duration * 2 || 1000)
    }
    WindowHelper._throttleSetSizeFunc(width, height, animate)
  }
}
export default WindowHelper
