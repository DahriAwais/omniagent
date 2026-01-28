
import React, { useState } from 'react';
import FloatingEditor from './FloatingEditor';

interface WebWorkspaceProps {
  content: { html: string; css?: string };
  onBack: () => void;
  onEdit: (prompt: string) => void;
  isLoading: boolean;
}

const WebWorkspace: React.FC<WebWorkspaceProps> = ({ content, onBack, onEdit, isLoading }) => {
  const [view, setView] = useState<'PREVIEW' | 'CODE'>('PREVIEW');

  return (
    <div className="fixed inset-0 bg-[#fcfcfc] z-50 flex flex-col text-gray-900 font-sans">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      {/* Top Header */}
      <div className="h-20 bg-white/70 backdrop-blur-2xl border-b border-gray-100 flex items-center justify-between px-10 relative z-20 shadow-sm">
        <div className="flex items-center space-x-8">
          <button onClick={onBack} className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 hover:text-black transition-all"><i className="fa-solid fa-arrow-left"></i></button>
          <div className="flex items-center space-x-4">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg text-white">
                <i className="fa-solid fa-terminal text-sm"></i>
             </div>
             <div>
               <h2 className="text-sm font-bold tracking-tight">Project Architect</h2>
               <p className="text-[10px] text-indigo-500 uppercase tracking-[0.2em] font-black">Live Production</p>
             </div>
          </div>
        </div>

        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
           <button 
             onClick={() => setView('PREVIEW')}
             className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${view === 'PREVIEW' ? 'bg-white text-gray-900 shadow-md border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
           >
             <i className="fa-solid fa-eye mr-2"></i> Preview
           </button>
           <button 
             onClick={() => setView('CODE')}
             className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${view === 'CODE' ? 'bg-white text-gray-900 shadow-md border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
           >
             <i className="fa-solid fa-code mr-2"></i> Code
           </button>
        </div>

        <div className="flex items-center space-x-4">
           <button className="text-gray-400 hover:text-black px-4 text-sm font-bold transition-colors">Export .ZIP</button>
           <button className="bg-black text-white px-8 py-3 rounded-full text-xs font-black transition-all hover:scale-105 shadow-xl">Deploy App</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {view === 'PREVIEW' ? (
          <div className="flex-1 bg-gray-50/50 p-8 md:p-12 flex flex-col">
            <div className="flex-1 bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-gray-100 group">
               <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-6 space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 bg-white border border-gray-200 px-6 py-1 rounded-full text-[10px] text-gray-400 font-mono text-center">localhost:5173/dev</div>
               </div>
               <div className="flex-1 overflow-auto bg-white custom-scrollbar">
                  <div dangerouslySetInnerHTML={{ __html: content.html }} />
               </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-gray-50/50 p-12 flex flex-col">
             <div className="flex-1 bg-white rounded-[32px] border border-gray-100 shadow-2xl p-10 font-mono text-sm overflow-auto custom-scrollbar relative">
                <div className="absolute top-6 right-8 text-[10px] font-bold text-gray-200 tracking-widest uppercase">index.html</div>
                <div className="flex flex-col space-y-1">
                   {content.html.split('\n').map((line, i) => (
                     <div key={i} className="flex space-x-8 hover:bg-indigo-50/30 transition-colors group px-4 rounded">
                       <span className="w-10 text-gray-300 text-right select-none font-sans group-hover:text-indigo-300">{i + 1}</span>
                       <span className="whitespace-pre text-gray-700">
                          {line.split(' ').map((word, j) => {
                             let color = 'text-gray-700';
                             if (word.startsWith('<') || word.startsWith('</')) color = 'text-indigo-600 font-bold';
                             else if (word.includes('class')) color = 'text-amber-600';
                             else if (word.includes('=') || word.includes('{') || word.includes('}')) color = 'text-rose-500';
                             return <span key={j} className={color}>{word} </span>
                          })}
                       </span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* Console / Sidebar */}
        <div className="w-96 border-l border-gray-100 bg-white/40 backdrop-blur-md p-8 flex flex-col">
           <div className="mb-10">
             <div className="flex items-center space-x-2 mb-6">
               <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Live Intelligence</span>
               <div className="h-px flex-1 bg-gray-100"></div>
             </div>
             <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                   <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-indigo-600">BUILD SUCCESS</span>
                      <span className="text-[9px] text-gray-400">0.42ms</span>
                   </div>
                   <p className="text-[11px] text-gray-600 leading-relaxed">Layout optimized for high performance and responsiveness.</p>
                </div>
                <div className="p-4 rounded-2xl border border-gray-100 text-[11px] text-gray-400 italic bg-gray-50/30">
                   Awaiting structural iterations...
                </div>
             </div>
           </div>

           <div className="flex-1"></div>

           <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Build Artifacts</h3>
              <div className="space-y-2">
                 {['HeroSection.tsx', 'Navigation.tsx', 'Footer.tsx'].map(f => (
                   <div key={f} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white cursor-pointer transition-all border border-transparent hover:border-gray-100 shadow-sm hover:shadow-md">
                      <i className="fa-solid fa-file-code text-indigo-500 text-xs"></i>
                      <span className="text-xs font-bold text-gray-600">{f}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <FloatingEditor 
        onSend={onEdit} 
        isLoading={isLoading} 
        placeholder="Iterate on this build... (e.g. 'Add a clean contact form')"
      />
    </div>
  );
};

export default WebWorkspace;
