import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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

// Simple function to hide specific blue bar
const hideBlueBar = () => {
  // Wait for DOM to be ready
  setTimeout(() => {
    // Only target elements that are direct children of body and not our app root
    Array.from(document.body.children).forEach((el) => {
      if (el.id !== 'root') {
        try {
          const style = window.getComputedStyle(el);
          const bgColor = style.backgroundColor;
          
          // Only target bright blue elements
          if (bgColor === 'rgb(0, 0, 255)' || bgColor === 'blue') {
            (el as HTMLElement).style.display = 'none';
          }
          
          // Also check if element is at bottom of screen with blue text
          const rect = (el as HTMLElement).getBoundingClientRect();
          if (rect.bottom > window.innerHeight - 50 && 
              rect.height < 50 && 
              el.textContent?.includes('Admin')) {
            (el as HTMLElement).style.display = 'none';
          }
        } catch (e) {
          // Ignore errors
        }
      }
    });
  }, 100);
};

function Root() {
  useEffect(() => {
    loadExternalScript();
    hideBlueBar();
  }, []);

  return (
    <StrictMode>
      <BrowserRouter basename="/wizard-press">
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);