export function createSparkles() {
  const container = document.querySelector('.sparkle-container');
  if (!container) return;

  // Clear existing sparkles
  container.innerHTML = '';

  // Create more sparkles
  const sparkleCount = Math.floor(Math.random() * 30) + 50; // 50-80 sparkles
  
  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    // Random size class with more large sparkles
    const size = Math.random();
    if (size < 0.3) sparkle.classList.add('small');
    else if (size < 0.7) sparkle.classList.add('medium');
    else sparkle.classList.add('large');
    
    // Random position
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    
    // Faster animation delay
    sparkle.style.animationDelay = `${Math.random() * 2}s`;
    
    container.appendChild(sparkle);
  }

  // Create floating orbs
  createFloatingOrbs(container);
}

function createFloatingOrbs(container: Element) {
  const orbCount = 8; // Increased from 5
  const orbColors = [
    'rgba(59, 130, 246, 0.4)',  // Brighter blue
    'rgba(96, 165, 250, 0.4)',  // Brighter light blue
    'rgba(147, 197, 253, 0.4)', // Brighter lighter blue
    'rgba(37, 99, 235, 0.4)',   // Additional blue
  ];

  for (let i = 0; i < orbCount; i++) {
    const orb = document.createElement('div');
    orb.className = 'floating-orb';
    
    // Larger size range (150-250px)
    const size = Math.random() * 100 + 150;
    orb.style.width = `${size}px`;
    orb.style.height = `${size}px`;
    
    // Random color
    orb.style.backgroundColor = orbColors[Math.floor(Math.random() * orbColors.length)];
    
    // Random position
    orb.style.left = `${Math.random() * 100}%`;
    orb.style.top = `${Math.random() * 100}%`;
    
    // Faster animation
    orb.style.animationDuration = `${Math.random() * 5 + 15}s`; // 15-20s
    orb.style.animationDelay = `-${Math.random() * 10}s`; // Faster initial appearance
    
    container.appendChild(orb);
  }
}

// Create wand trail effect with enhanced sparkles
export function createWandTrail(x: number, y: number) {
  const container = document.querySelector('.sparkle-container');
  if (!container) return;

  const trailCount = 15; // Increased from 10
  const baseSize = 6; // Increased from 4
  
  for (let i = 0; i < trailCount; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle large'; // Changed to large
    
    // Position around the cursor
    const angle = (i / trailCount) * Math.PI * 2;
    const distance = Math.random() * 30 + 15; // Increased spread
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;
    
    sparkle.style.left = `${x + offsetX}px`;
    sparkle.style.top = `${y + offsetY}px`;
    
    // Size decreases as the trail fades
    const size = baseSize * (1 - i / trailCount);
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    
    // Faster fade out
    sparkle.style.animation = 'sparkle-float 0.8s ease-out forwards';
    
    container.appendChild(sparkle);
    
    // Remove after animation
    setTimeout(() => sparkle.remove(), 800);
  }
}

// New function for nav sparkles
export function createNavSparkles() {
  const container = document.querySelector('.nav-sparkle-container');
  if (!container) return;

  // Clear existing sparkles
  container.innerHTML = '';

  // Create nav sparkles
  const sparkleCount = 40; // More nav sparkles
  
  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'nav-sparkle';
    
    // Random size class with more medium and large sparkles
    const size = Math.random();
    if (size < 0.2) sparkle.classList.add('small');
    else if (size < 0.6) sparkle.classList.add('medium');
    else sparkle.classList.add('large');
    
    // Random position
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    
    // Faster animation delay
    sparkle.style.animationDelay = `${Math.random() * 2}s`;
    
    container.appendChild(sparkle);
  }
}