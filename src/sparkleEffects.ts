export function createSparkles() {
  const container = document.querySelector('.sparkle-container');
  if (!container) return;

  // Clear existing sparkles
  container.innerHTML = '';

  // Create sparkles
  const sparkleCount = Math.floor(Math.random() * 20) + 30; // 30-50 sparkles
  
  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    // Random size class
    const size = Math.random();
    if (size < 0.4) sparkle.classList.add('small');
    else if (size < 0.8) sparkle.classList.add('medium');
    else sparkle.classList.add('large');
    
    // Random position
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    
    // Random animation delay
    sparkle.style.animationDelay = `${Math.random() * 4}s`;
    
    container.appendChild(sparkle);
  }

  // Create floating orbs
  createFloatingOrbs(container);
}

function createFloatingOrbs(container: Element) {
  const orbCount = 5;
  const orbColors = [
    'rgba(59, 130, 246, 0.3)',  // Blue
    'rgba(96, 165, 250, 0.3)',  // Light blue
    'rgba(147, 197, 253, 0.3)', // Lighter blue
  ];

  for (let i = 0; i < orbCount; i++) {
    const orb = document.createElement('div');
    orb.className = 'floating-orb';
    
    // Random size (100-200px)
    const size = Math.random() * 100 + 100;
    orb.style.width = `${size}px`;
    orb.style.height = `${size}px`;
    
    // Random color
    orb.style.backgroundColor = orbColors[Math.floor(Math.random() * orbColors.length)];
    
    // Random position
    orb.style.left = `${Math.random() * 100}%`;
    orb.style.top = `${Math.random() * 100}%`;
    
    // Random animation duration and delay
    orb.style.animationDuration = `${Math.random() * 10 + 20}s`; // 20-30s
    orb.style.animationDelay = `-${Math.random() * 20}s`; // Start at random points
    
    container.appendChild(orb);
  }
}

// Create wand trail effect
export function createWandTrail(x: number, y: number) {
  const container = document.querySelector('.sparkle-container');
  if (!container) return;

  const trailCount = 10;
  const baseSize = 4;
  
  for (let i = 0; i < trailCount; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle medium';
    
    // Position around the cursor
    const angle = (i / trailCount) * Math.PI * 2;
    const distance = Math.random() * 20 + 10;
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;
    
    sparkle.style.left = `${x + offsetX}px`;
    sparkle.style.top = `${y + offsetY}px`;
    
    // Size decreases as the trail fades
    const size = baseSize * (1 - i / trailCount);
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    
    // Fade out quickly
    sparkle.style.animation = 'sparkle-float 1s ease-out forwards';
    
    container.appendChild(sparkle);
    
    // Remove after animation
    setTimeout(() => sparkle.remove(), 1000);
  }
}