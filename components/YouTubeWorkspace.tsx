
import React, { useState, useEffect } from 'react';
import { YouTubeVideo } from '../types';
import FloatingEditor from './FloatingEditor';

interface YouTubeWorkspaceProps {
  content: { videos: YouTubeVideo[]; analysis: string };
  onBack: () => void;
  onEdit: (prompt: string) => void;
  isLoading: boolean;
  lastQuery?: string;
}

const YouTubeWorkspace: React.FC<YouTubeWorkspaceProps> = ({ content, onBack, onEdit, isLoading, lastQuery }) => {
  const [searchValue, setSearchValue] = useState(lastQuery || '');

  useEffect(() => {
    if (lastQuery) setSearchValue(lastQuery);
  }, [lastQuery]);

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col text-gray-900 font-sans animate-in fade-in duration-500">
      {/* Refined Header */}
      <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-10 relative z-20 shadow-sm">
        <div className="flex items-center space-x-6">
          <button onClick={onBack} className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 hover:text-black transition-all">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="flex items-center space-x-4">
             <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                <i className="fa-brands fa-youtube text-sm"></i>
             </div>
             <div>
               <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Strategic Intelligence</h2>
               <p className="text-sm font-bold -mt-1 text-gray-900">YouTube Analysis</p>
             </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
           <div className="hidden lg:flex items-center bg-gray-50 px-4 py-2 rounded-full border border-gray-100 space-x-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Real-time Data Stream</span>
           </div>
           <button className="bg-black text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">Download PDF Report</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Main Grid Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/10 p-6 md:p-12">
          <div className="max-w-7xl mx-auto pb-24">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Retrieved Sources</h3>
                <span className="text-xs font-bold text-gray-400">{content.videos.length} results identified</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {content.videos.map((video) => (
                  <div key={video.id} className="flex flex-col group animate-in slide-in-from-bottom-4 duration-500">
                     <div className="relative aspect-video rounded-[24px] overflow-hidden mb-4 bg-gray-100 shadow-md transition-all duration-300 border border-gray-100">
                        <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={video.title} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                           <a href={`https://youtube.com/watch?v=${video.id}`} target="_blank" onClick={(e) => e.stopPropagation()} className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-all duration-500 hover:scale-110">
                              <i className="fa-solid fa-play text-red-600 text-lg ml-1"></i>
                           </a>
                        </div>
                        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded-lg text-[10px] font-bold text-white backdrop-blur-md">
                           {Math.floor(Math.random() * 10 + 5)}:{(Math.floor(Math.random() * 59)).toString().padStart(2, '0')}
                        </div>
                     </div>
                     <div className="flex space-x-4">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-gray-300">
                           {video.channelTitle.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                              {video.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'")}
                           </h4>
                           <span className="text-xs text-gray-400 font-bold block mb-1">{video.channelTitle}</span>
                           <div className="flex items-center text-[11px] text-gray-400 font-bold">
                              <span>{Math.floor(Math.random() * 500 + 1)}K views</span>
                              <span className="mx-2 opacity-30">•</span>
                              <span>{timeAgo(video.publishedAt)}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Strategy Sidebar */}
        <div className="w-[480px] border-l border-gray-100 bg-white p-10 flex flex-col space-y-12 overflow-y-auto custom-scrollbar">
           <div className="animate-in fade-in slide-in-from-right-4 duration-700">
              <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em]">Strategic Briefing</span>
                <i className="fa-solid fa-bolt text-red-500 text-xs"></i>
              </div>
              <div className="prose prose-sm text-gray-600 leading-relaxed font-medium space-y-8">
                 {content.analysis.split('\n').map((line, i) => (
                   <p key={i} className={line.startsWith('#') || line.includes(':') ? 'text-gray-900 font-black border-l-4 border-red-500 pl-6' : 'pl-7'}>
                     {line.replace(/^#+ /, '')}
                   </p>
                 ))}
              </div>
           </div>
           
           <div className="mt-auto">
              <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 group hover:shadow-lg transition-all">
                 <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-4">Competitor Edge</h4>
                 <p className="text-xs font-bold leading-relaxed text-gray-600 italic">
                    Current patterns indicate that high-engagement content in this niche is shifting towards "No-B-Roll" raw storytelling. Consider adjusting visual hooks.
                 </p>
              </div>
           </div>
        </div>
      </div>

      <FloatingEditor 
        onSend={onEdit} 
        isLoading={isLoading} 
        placeholder="Ask for more details or refine the search..."
      />
    </div>
  );
};

export default YouTubeWorkspace;
