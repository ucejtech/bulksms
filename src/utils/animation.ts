import anime from 'animejs';

export default {
  drawSvg(targets: string, duration?: number) {
    anime({
      targets,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: duration || 1500,
      delay(el, i) { return i * 150; },
      direction: 'alternate',
      loop: false
    });
  }
};
