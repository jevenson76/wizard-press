import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { externalAssets } from './lib/external-assets';

// Function to load external script
const loadExternalScript = () => {
  const script = document.createElement('script');
  script.src = externalAssets.js;
  script.async = true;
  document.body.appendChild(script);
};

// Function to remove admin bar
const removeAdminBar = () => {
  // Run immediately
  removeBlueElements();
  
  // Also run after a short delay to catch dynamically added elements
  setTimeout(removeBlueElements, 100);
  setTimeout(removeBlueElements, 500);
  setTimeout(removeBlueElements, 1000);
  
  // Set up a mutation observer to watch for new elements
  const observer = new MutationObserver((mutations) => {
    removeBlueElements();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  function removeBlueElements() {
    // Remove any elements with blue background
    document.querySelectorAll('div, button').forEach(el => {
      const style = window.getComputedStyle(el);
      const backgroundColor = style.backgroundColor;
      
      // Check for blue backgrounds
      if (backgroundColor.includes('rgb(0, 0, 255)') || 
          backgroundColor.includes('0, 0, 255') ||
          backgroundColor === 'blue') {
        (el as HTMLElement).style.display = 'none';
        (el as HTMLElement).style.opacity = '0';
        (el as HTMLElement).style.visibility = 'hidden';
      }
      
      // Check for elements with "Admin" text
      if (el.textContent?.includes('Admin')) {
        const parent = el.parentElement;
        if (parent && parent.tagName === 'DIV') {
          (parent as HTMLElement).style.display = 'none';
        }
        (el as HTMLElement).style.display = 'none';
      }
    });
  }
};

function Root() {
  useEffect(() => {
    loadExternalScript();
    removeAdminBar();
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);