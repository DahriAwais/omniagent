
import React, { useState, useEffect } from 'react';
import FloatingEditor from './FloatingEditor';

interface ResearchWorkspaceProps {
  content: { content: string; sources?: string[] };
  onBack: () => void;
  onEdit: (prompt: string) => void;
  isLoading: boolean;
  lastQuery?: string;
}

const ResearchWorkspace: React.FC<ResearchWorkspaceProps> = ({ content, onBack, onEdit, isLoading, lastQuery }) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col text-gray-900 font-sans animate-in fade-in duration-500">
      {/* Refined Header */}
      <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-10 relative z-20 shadow-sm">
        <div className="flex items-center space-x-6">
          <button onClick={onBack} className="p-3 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-black transition-all">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="flex items-center space-x-4">
             <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <i className="fa-solid fa-magnifying-glass text-sm"></i>
             </div>
             <div>
               <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Deep Research</h2>
               <p className="text-sm font-bold -mt-1 text-gray-900">Synthesis Engine</p>
             </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
           <div className="hidden lg:flex items-center bg-gray-50 px-4 py-2 rounded-full border border-gray-100 space-x-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Grounding Active</span>
           </div>
           <button className="bg-black text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">Save Insights</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/10 p-6 md:p-16">
          <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-[48px] shadow-sm p-10 md:p-20 min-h-full animate-in fade-in zoom-in-95 duration-700 pb-32">
             <div className="mb-12 border-b border-gray-100 pb-12">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4 block">Synthesized Analysis</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">Expert Technical Report</h1>
             </div>
             
             <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-12 font-medium">
                {content.content.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('#') ? 'text-3xl font-serif font-bold text-gray-900 pt-8 border-l-4 border-emerald-500 pl-8 mb-6' : ''}>
                    {line.replace(/^#+ /, '')}
                  </p>
                ))}
             </div>
          </div>
        </div>

        <div className="w-[440px] border-l border-gray-100 bg-white p-10 flex flex-col space-y-12 overflow-y-auto custom-scrollbar">
           <div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-8">Verified Citations</span>
              <div className="space-y-4">
                 {content.sources && content.sources.length > 0 ? content.sources.map((source, idx) => (
                   <a key={idx} href={source.startsWith('http') ? source : '#'} target="_blank" className="block p-5 rounded-3xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-all hover:bg-white hover:shadow-xl group">
                      <div className="flex items-center space-x-3 mb-2">
                         <div className="w-5 h-5 rounded-lg bg-emerald-100 flex items-center justify-center text-[9px] text-emerald-600 font-black">{idx + 1}</div>
                         <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Grounding Chunk</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-bold truncate group-hover:text-black transition-colors">{source}</p>
                   </a>
                 )) : (
                   <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-[32px] bg-gray-50/30">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] leading-loose">Internal Semantic Reasoning Engine Applied</p>
                   </div>
                 )}
              </div>
           </div>
           
           <div className="mt-auto p-8 bg-emerald-50 rounded-[40px] border border-emerald-100 group">
              <div className="flex items-center space-x-3 mb-3 text-emerald-600">
                 <i className="fa-solid fa-lightbulb-on text-xs"></i>
                 <h4 className="text-[10px] font-black uppercase tracking-widest">Deep Dive Tip</h4>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed font-bold italic">This synthesis is live. Use the bottom editor to request statistical breakdowns or specific comparative data.</p>
           </div>
        </div>
      </div>

      <FloatingEditor 
        onSend={onEdit} 
        isLoading={isLoading} 
        placeholder="Refine research or ask for specifics..."
      />
    </div>
  );
};

export default ResearchWorkspace;
