import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

interface ChapterPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChapterPreview({ isOpen, onClose }: ChapterPreviewProps) {
  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
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
          border-b border-blue-500/20 p-4 flex justify-between items-center backdrop-blur-sm">
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
            <iframe
              src="/assets/files/Done_With_the_Bullshit_Sample.pdf"
              className="w-full h-full bg-white/5"
              title="Sample Chapter Preview"
            />
            
            {/* Navigation Overlay */}
            <div className="absolute inset-y-0 left-0 right-0 opacity-0 group-hover:opacity-100 
              transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/50 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/50 to-transparent" />
            </div>

            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="w-12 h-12 rounded-full bg-black/70 border border-blue-500/30 
                flex items-center justify-center text-blue-300 hover:text-white
                hover:bg-blue-500/20 transition-all duration-300 hover:scale-110
                shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="w-12 h-12 rounded-full bg-black/70 border border-blue-500/30 
                flex items-center justify-center text-blue-300 hover:text-white
                hover:bg-blue-500/20 transition-all duration-300 hover:scale-110
                shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-950/50 to-transparent
          border-t border-blue-500/20 p-4 flex justify-between items-center backdrop-blur-sm">
          <p className="text-blue-200/80 font-cormorant">© 2024 Wizard Press. All rights reserved.</p>
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/assets/files/Done_With_the_Bullshit_Sample.pdf';
              link.download = 'Done_With_the_Bullshit_Sample.pdf';
              link.click();
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