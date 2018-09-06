import anime, { AnimeInstance } from 'animejs';

let animeInstance: AnimeInstance | null;

export function resize(width: number, height: number) {
  if (animeInstance) animeInstance.pause();
  const targets = { width: window.innerWidth, height: window.innerHeight };
  animeInstance = anime({
    targets,
    width,
    height,
    duration: 150,
    easing: 'easeOutQuart',
    update: () => window.resizeTo(targets.width, targets.height),
  });
  return animeInstance.finished;
}

export function sleep(delay = 0) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

export function throttle(fn: Function, delay = 500) {
  let timer = 0;
  return (...rest: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(null, ...rest), delay);
  };
}

export function eventLoop(
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
