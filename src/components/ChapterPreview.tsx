import { X } from 'lucide-react';

interface ChapterPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChapterPreview({ isOpen, onClose }: ChapterPreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black w-full max-w-4xl h-[80vh] rounded-lg shadow-2xl border border-blue-500/20 relative">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white p-2 rounded-full hover:bg-blue-500/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-blue-500/20">
            <h2 className="font-cinzel text-2xl text-blue-300">Done With the Bullshit</h2>
            <p className="text-blue-200 font-cormorant text-lg">Sample Chapter</p>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            <iframe
              src="/assets/files/sample-chapter.pdf"
              className="w-full h-full rounded border border-blue-500/20"
              title="Sample Chapter Preview"
            />
          </div>
          
          <div className="p-6 border-t border-blue-500/20 flex justify-between items-center">
            <p className="text-blue-200 font-cormorant">© 2024 Wizard Press. All rights reserved.</p>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/assets/files/sample-chapter.pdf';
                link.download = 'Done-With-The-Bullshit-Sample-Chapter.pdf';
                link.click();
              }}
              className="bg-blue-500 text-white px-6 py-2 rounded-full font-cinzel 
                hover:bg-blue-400 transition-colors duration-300 text-sm"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 