import anime from 'animejs'
export class WindowHelper {
  static setSize (width, height, animate) {
    const targets = { width: window.innerWidth, height: window.innerHeight }
    if (width === targets.width && height === targets.height) window.resizeTo(targets.width, targets.height) // 防抖动
    else anime({ targets, width, height, ...animate, update: () => window.resizeTo(targets.width, targets.height) })
  }
}
export default WindowHelper
