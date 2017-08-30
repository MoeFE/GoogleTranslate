export class Thread {
  static sleep (delay = 0) {
    return new Promise(resolve => setTimeout(resolve, delay))
  }
}

export default Thread
