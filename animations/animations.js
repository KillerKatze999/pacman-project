let nebulaPulse;


document.addEventListener("DOMContentLoaded", () => {
  anime({
    targets: '#nebula-credit',
    opacity: [0, 1],
    translateY: [-30, 0],
    duration: 1500,
    easing: 'easeOutQuad',
    delay: 1000
  });

  nebulaPulse = anime({
    targets: '#nebula-credit',
    scale: [1, 1.05],
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine',
    duration: 1000
  });
});

