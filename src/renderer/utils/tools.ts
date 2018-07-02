import anime from 'animejs';
import { Debounce } from 'lodash-decorators';

export default abstract class Tools {
  public static sleep(delay = 0) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  @Debounce(150, { leading: true, trailing: false })
  public static resize(width: number, height: number) {
    const targets = { width: window.innerWidth, height: window.innerHeight };
    anime({
      targets,
      width,
      height,
      duration: 150,
      easing: 'easeOutQuart',
      update: () => window.resizeTo(targets.width, targets.height),
    });
  }
}
