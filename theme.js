function waitForElement(els, func, timeout = 100) {
  const queries = els.map(el => document.querySelector(el));
  if (queries.every(a => a)) {
    func(queries);
  } else if (timeout > 0) {
    setTimeout(waitForElement, 300, els, func, --timeout);
  }
}

function random(min, max) {
  // min inclusive, max exclusive
  return Math.random() * (max - min) + min;
}

waitForElement(['.Root__top-container'], ([topContainer]) => {
  const r = document.documentElement;
  const rs = window.getComputedStyle(r);

  const backgroundContainer = document.createElement('div');
  backgroundContainer.className = 'starrynight-bg-container';
  topContainer.appendChild(backgroundContainer);

  // Ensure stars and shooting stars render behind other content
  const rootElement = document.querySelector('.Root__top-container');
  rootElement.style.zIndex = '0';

  // Create fewer stars by increasing the divisor (canvasSize / 8000)
  const canvasSize = backgroundContainer.clientWidth * backgroundContainer.clientHeight;
  const starsFraction = canvasSize / 8000;
  for (let i = 0; i < starsFraction; i++) {
    const size = Math.random() < 0.5 ? 1 : 2;

    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.left = `${random(0, 99)}%`;
    star.style.top = `${random(0, 99)}%`;
    star.style.opacity = random(0.5, 1);
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.backgroundColor = rs.getPropertyValue('--spice-star');
    star.style.zIndex = '-1';
    star.style.borderRadius = '50%';

    if (Math.random() < 1 / 5) {
      star.style.animation = `twinkle${Math.floor(Math.random() * 4) + 1} 5s infinite`;
    }

    backgroundContainer.appendChild(star);
  }

  /*
  Pure CSS Shooting Star Animation Effect Copyright (c) 2021 by Delroy Prithvi
  Permission is hereby granted...
  */
  for (let i = 0; i < 4; i++) {
    const shootingstar = document.createElement('span');
    shootingstar.className = 'shootingstar';
    
    // Set a higher opacity for shooting stars (more opaque)
    shootingstar.style.opacity = random(0.8, 1);
    
    if (Math.random() < 0.75) {
      shootingstar.style.top = '-4px'; // hidden off screen when animation is delayed
      shootingstar.style.right = `${random(0, 90)}%`;
    } else {
      shootingstar.style.top = `${random(0, 50)}%`;
      shootingstar.style.right = '-4px'; // hidden when animation is delayed
    }

    const shootingStarGlowColor = `rgba(${rs.getPropertyValue('--spice-rgb-shooting-star-glow')},${0.1})`;
    shootingstar.style.boxShadow = `0 0 0 4px ${shootingStarGlowColor}, 0 0 0 8px ${shootingStarGlowColor}, 0 0 20px ${shootingStarGlowColor}`;

    // Increase animation duration for slower shooting stars (10-14 seconds)
    const duration = Math.floor(Math.random() * 5) + 5;
    shootingstar.style.animationDuration = `${duration}s`;
    shootingstar.style.animationDelay = `${Math.floor(Math.random() * 7)}s`;

    backgroundContainer.appendChild(shootingstar);

    shootingstar.addEventListener('animationend', () => {
      if (Math.random() < 0.75) {
        shootingstar.style.top = '-4px';
        shootingstar.style.right = `${random(0, 90)}%`;
      } else {
        shootingstar.style.top = `${random(0, 50)}%`;
        shootingstar.style.right = '-4px';
      }

      shootingstar.style.animation = 'none'; // Remove animation

      void shootingstar.offsetWidth;

      shootingstar.style.animation = '';
      const newDuration = Math.floor(Math.random() * 5) + 10;
      shootingstar.style.animationDuration = `${newDuration}s`;
    });
  }
});
