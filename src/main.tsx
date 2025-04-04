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
    document.querySelectorAll('div, button, iframe, *').forEach(el => {
      const style = window.getComputedStyle(el);
      const backgroundColor = style.backgroundColor;
      
      // Check for blue backgrounds - more aggressive check
      if (backgroundColor.includes('rgb(0, 0, 255)') || 
          backgroundColor.includes('0, 0, 255') ||
          backgroundColor === 'blue' ||
          backgroundColor.includes('rgb(0, 0, 255)') ||
          backgroundColor.includes('rgb(0,0,255)') ||
          el.getAttribute('style')?.includes('background') ||
          el.getAttribute('style')?.includes('blue')) {
        (el as HTMLElement).style.display = 'none !important';
        (el as HTMLElement).style.opacity = '0 !important';
        (el as HTMLElement).style.visibility = 'hidden !important';
        (el as HTMLElement).style.height = '0 !important';
        (el as HTMLElement).style.position = 'absolute !important';
        (el as HTMLElement).style.zIndex = '-9999 !important';
        
        // Also try to remove it from the DOM
        try {
          el.parentNode?.removeChild(el);
        } catch (e) {
          console.log('Cannot remove element');
        }
      }
      
      // Check for elements with "Admin" text or close to bottom of page
      if (el.textContent?.includes('Admin') || 
          (el.getBoundingClientRect().bottom > window.innerHeight - 50 && 
           el.getBoundingClientRect().height < 100)) {
        const parent = el.parentElement;
        if (parent) {
          (parent as HTMLElement).style.display = 'none !important';
          try {
            parent.parentNode?.removeChild(parent);
          } catch (e) {
            console.log('Cannot remove parent element');
          }
        }
        (el as HTMLElement).style.display = 'none !important';
        try {
          el.parentNode?.removeChild(el);
        } catch (e) {
          console.log('Cannot remove element');
        }
      }
    });
    
    // Direct approach: try to find iframe or div at the bottom of the page
    const elements = document.body.children;
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i] as HTMLElement;
      if (el.tagName === 'DIV' || el.tagName === 'IFRAME') {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > window.innerHeight - 100 && rect.height < 200) {
          el.style.display = 'none !important';
          el.style.visibility = 'hidden !important';
          try {
            el.parentNode?.removeChild(el);
          } catch (e) {
            console.log('Cannot remove bottom element');
          }
        }
      }
    }
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