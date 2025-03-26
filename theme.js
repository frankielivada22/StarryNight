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

// Cache star elements here
const starElements = [];
let isMoving = false;
let lastMouseEvent;

// Throttled mousemove event using requestAnimationFrame
document.addEventListener('mousemove', (event) => {
  lastMouseEvent = event;
  if (!isMoving) {
    isMoving = true;
    requestAnimationFrame(() => {
      moveStars(lastMouseEvent);
      isMoving = false;
    });
  }
});

function moveStars(event) {
  starElements.forEach(star => {
    const starRect = star.getBoundingClientRect();
    const starX = starRect.left + starRect.width / 2;
    const starY = starRect.top + starRect.height / 2;
    const dx = event.clientX - starX;
    const dy = event.clientY - starY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 50) {
      const angle = Math.atan2(starY - event.clientY, starX - event.clientX);
      const moveDistance = Math.min(3, 50 / distance);
      star.style.transform = `translate(${Math.cos(angle) * moveDistance}px, ${Math.sin(angle) * moveDistance}px)`;
    } else {
      star.style.transform = '';
    }
  });
}

waitForElement(['.Root__top-container'], ([topContainer]) => {
  const r = document.documentElement;
  const rs = window.getComputedStyle(r);

  // Create background container for stars
  const backgroundContainer = document.createElement('div');
  backgroundContainer.className = 'starrynight-bg-container';
  topContainer.appendChild(backgroundContainer);

  // Ensure the top container renders behind other content
  topContainer.style.zIndex = '0';

  // Wait for layout to update
  requestAnimationFrame(() => {
    // Create 150 stars with independent fade in/out timing
    const numStars = 150;
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      star.id = 'star' + i;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      // Each star gets its own delay and duration for unsynchronized fading
      star.style.animationDelay = `${Math.random() * 8}s`;
      star.style.animationDuration = `${(Math.random() * 3) + 5}s`;
      backgroundContainer.appendChild(star);
      // Cache the star element
      starElements.push(star);
    }
    
    // Create shooting stars with increased blur and reduced prominence
    for (let i = 0; i < 4; i++) {
      const shootingstar = document.createElement('span');
      shootingstar.className = 'shootingstar';
      
      // Lower the opacity so they blend in more
      shootingstar.style.opacity = random(0.4, 0.6);
      // Increase blur to make them less prominent
      shootingstar.style.filter = 'blur(2px)';
      
      if (Math.random() < 0.75) {
        shootingstar.style.top = '-4px';
        shootingstar.style.right = `${random(0, 90)}%`;
      } else {
        shootingstar.style.top = `${random(0, 50)}%`;
        shootingstar.style.right = '-4px';
      }
      
      const shootingStarGlowColor =
        `rgba(${rs.getPropertyValue('--spice-rgb-shooting-star-glow').trim() || '255,255,255'},0.1)`;
      // Reduced box-shadow values for a thinner glow effect
      shootingstar.style.boxShadow = `0 0 0 1px ${shootingStarGlowColor}, 0 0 0 2px ${shootingStarGlowColor}, 0 0 5px ${shootingStarGlowColor}`;
      
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
        shootingstar.style.animation = 'none';
        void shootingstar.offsetWidth;
        shootingstar.style.animation = '';
        const newDuration = Math.floor(Math.random() * 5) + 10;
        shootingstar.style.animationDuration = `${newDuration}s`;
      });
    }
  });
});
