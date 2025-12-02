import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { ContentIdea } from '../types';

interface IdeaCardProps {
  idea: ContentIdea;
  index: number;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = `${idea.title}\n\n${idea.content}\n\n${idea.hashtags}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="p-1 bg-gradient-to-r from-teal-500 to-indigo-500"></div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-1 rounded">
              Option {index + 1}
            </span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-800 mb-3 leading-snug">
          {idea.title}
        </h3>
        
        <div className="prose prose-slate text-slate-600 text-sm flex-1 whitespace-pre-wrap leading-relaxed mb-4">
          {idea.content}
        </div>
        
        <div className="text-indigo-600 text-sm font-medium mb-5">
          {idea.hashtags}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button 
              onClick={handleCopy}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all w-full justify-center
                ${copied 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }
              `}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Content</span>
                </>
              )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;