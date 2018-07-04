import anime, { AnimeInstance } from 'animejs';

let animeInstance: AnimeInstance;

export default abstract class Tools {
  public static sleep(delay = 0) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  public static eventLoop(
    target: () => any,
    timeout: number = 3000,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = new Date().getTime();
      const timerId = setInterval(() => {
        if (!target()) {
          if (timeout > 0 && new Date().getTime() - startTime > timeout) {
            reject();
            clearInterval(timerId);
          }
          return;
        }
        resolve();
        clearInterval(timerId);
      }, 100);
    });
  }

  public static resize(width: number, height: number) {
    return new Promise((resolve) => {
      if (animeInstance) animeInstance.pause();
      const targets = { width: window.innerWidth, height: window.innerHeight };
      animeInstance = anime({
        targets,
        width,
        height,
        duration: 100,
        easing: 'easeOutQuart',
        update: () => window.resizeTo(targets.width, targets.height),
        complete: resolve,
      });
    });
  }
}
