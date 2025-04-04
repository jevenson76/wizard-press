export function initializeButtonEffects() {
  document.querySelectorAll('.magical-button').forEach(button => {
    button.addEventListener('mousemove', ((e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = (button as HTMLElement).getBoundingClientRect();
      const x = ((mouseEvent.clientX - rect.left) / rect.width) * 100;
      const y = ((mouseEvent.clientY - rect.top) / rect.height) * 100;
      (button as HTMLElement).style.setProperty('--x', `${x}%`);
      (button as HTMLElement).style.setProperty('--y', `${y}%`);
    }) as EventListener);
  });
} 