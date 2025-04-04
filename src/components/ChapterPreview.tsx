import { X, Download } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ChapterPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChapterPreview({ isOpen, onClose }: ChapterPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  
  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      // Create a blob URL for the PDF to avoid security issues
      fetch('/assets/files/Done_With_the_Bullshit_Sample.pdf')
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        })
        .catch(error => {
          console.error('Error fetching PDF:', error);
        });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
      
      // Clean up the blob URL when component unmounts
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl("");
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-gradient-to-b from-gray-900/95 to-black/95 w-full max-w-5xl h-[90vh] 
          rounded-lg shadow-2xl border border-blue-500/20 relative overflow-hidden
          animate-fade-in backdrop-blur-lg"
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-blue-950/50 to-transparent
          border-b border-blue-500/20 p-4 flex justify-between items-center backdrop-blur-sm z-10">
          <div>
            <h2 className="font-cinzel text-2xl text-blue-300 mb-1">Done With the Bullshit</h2>
            <p className="text-blue-200/80 font-cormorant text-lg">Sample Chapter</p>
          </div>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white p-2 rounded-full hover:bg-blue-500/20 
              transition-all duration-300 hover:scale-110"
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="h-full pt-24 pb-20 px-4">
          <div className="w-full h-full rounded-lg overflow-hidden border border-blue-500/20 
            shadow-[0_0_15px_rgba(59,130,246,0.2)] relative group">
            {pdfUrl ? (
              <object
                data={pdfUrl}
                type="application/pdf"
                className="w-full h-full bg-white/5"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 #000' }}
              >
                <div className="w-full h-full flex items-center justify-center bg-black/30">
                  <p className="text-blue-200 text-xl font-cormorant">
                    Loading PDF... If it doesn't load, please click the download button below.
                  </p>
                </div>
              </object>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black/30">
                <div className="text-blue-200 text-xl font-cormorant">Loading PDF...</div>
              </div>
            )}
            
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 
              transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-950/50 to-transparent
          border-t border-blue-500/20 p-4 flex justify-between items-center backdrop-blur-sm z-10">
          <p className="text-blue-200/80 font-cormorant">© 2025 Wizard Press. All rights reserved.</p>
          <button
            onClick={() => {
              if (pdfUrl) {
                // Use the blob URL for direct download
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = 'Done_With_the_Bullshit_Sample.pdf';
                link.click();
              } else {
                // Fallback to fetch and download
                fetch('/assets/files/Done_With_the_Bullshit_Sample.pdf')
                  .then(response => response.blob())
                  .then(blob => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'Done_With_the_Bullshit_Sample.pdf';
                    link.click();
                    URL.revokeObjectURL(url);
                  });
              }
            }}
            className="bg-blue-500/20 text-blue-300 px-6 py-2 rounded-full font-cinzel 
              hover:bg-blue-500/30 transition-all duration-300 flex items-center gap-2
              border border-blue-400/30 hover:scale-105 hover:text-white
              shadow-[0_0_10px_rgba(59,130,246,0.2)] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
} 