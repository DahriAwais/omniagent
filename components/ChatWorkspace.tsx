
import React, { useEffect, useRef } from 'react';
import { Message, ExecutionPlan } from '../types';
import InputBar from './InputBar';

interface ChatWorkspaceProps {
  messages: Message[];
  onSend: (text: string) => void;
  onApprove: () => void;
  onBack: () => void;
  isLoading: boolean;
  isExecuting: boolean;
}

const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({ messages, onSend, onApprove, onBack, isLoading, isExecuting }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <div className="fixed inset-0 bg-[#fcfcfc] z-50 flex flex-col text-gray-900 font-sans animate-in fade-in duration-500">
      {/* Background radial dots pattern replication */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      {/* Header */}
      <div className="h-20 border-b border-gray-100 bg-white/70 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-black transition-all">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-sparkles text-white text-xs"></i>
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight uppercase">Strategy Lab</h2>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-black">Neural Core Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-6">
           <button className="text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors">Protocol Specs</button>
           <div className="w-px h-6 bg-gray-200"></div>
           <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm">
              <i className="fa-solid fa-gear text-[10px] text-gray-400"></i>
           </button>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 space-y-12 relative z-10">
        <div className="max-w-4xl mx-auto space-y-12 pb-32">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-white border border-gray-100 shadow-sm' : ''} rounded-[32px] p-6 md:p-8`}>
                <div className="flex items-start space-x-5">
                  {msg.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-xl shadow-indigo-600/10">
                      <i className="fa-solid fa-robot text-white text-xs"></i>
                    </div>
                  )}
                  <div className="flex-1 space-y-5">
                    <p className={`text-lg leading-relaxed font-medium ${msg.role === 'assistant' ? 'text-gray-700' : 'text-gray-900'}`}>
                      {msg.content}
                    </p>

                    {msg.plan && (
                      <div className="mt-8 bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-700 border-t-4 border-t-indigo-500">
                        <div className="p-10 border-b border-gray-50 bg-gray-50/30">
                           <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Execution Roadmap</span>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-1 bg-white border border-gray-100 rounded-full shadow-sm">{msg.plan.estimatedComplexity} Complexity</span>
                           </div>
                           <h3 className="text-3xl font-serif font-bold text-gray-900 mb-3">{msg.plan.objective}</h3>
                           <div className="flex flex-wrap gap-2 mt-6">
                              {msg.plan.technicalStack.map(s => (
                                <span key={s} className="px-4 py-1.5 bg-white rounded-full text-[10px] font-bold text-gray-500 border border-gray-100 shadow-sm">{s}</span>
                              ))}
                           </div>
                        </div>
                        <div className="p-10 space-y-8">
                           {msg.plan.steps.map((step, sIdx) => (
                             <div key={step.id} className="flex items-start space-x-6 group">
                                <div className="mt-1 w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-indigo-500 transition-colors shadow-sm">
                                   <span className="text-[10px] font-black text-gray-400 group-hover:text-indigo-600">{sIdx + 1}</span>
                                </div>
                                <div>
                                   <h4 className="text-base font-bold text-gray-900 mb-1">{step.title}</h4>
                                   <p className="text-sm text-gray-500 leading-relaxed max-w-xl">{step.description}</p>
                                   <div className="mt-3 flex items-center space-x-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                      <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{step.agent}</span>
                                   </div>
                                </div>
                             </div>
                           ))}
                        </div>
                        
                        <div className="p-10 bg-indigo-50/50 border-t border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-8">
                           <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-indigo-500">
                                 <i className="fa-solid fa-wand-magic-sparkles"></i>
                              </div>
                              <p className="text-sm text-indigo-900 font-bold leading-tight">Ready to authorize the specialized agents?</p>
                           </div>
                           <button 
                             onClick={onApprove}
                             disabled={isExecuting}
                             className="w-full md:w-auto bg-black text-white px-12 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-4 group"
                           >
                             {isExecuting ? (
                               <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                             ) : (
                               <>
                                 <span>Start Build</span>
                                 <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                               </>
                             )}
                           </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in duration-300">
               <div className="flex items-center space-x-5 p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center animate-pulse">
                    <i className="fa-solid fa-robot text-white text-xs"></i>
                  </div>
                  <div className="flex space-x-1.5 items-center">
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Thinking</span>
                     <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                     <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="p-8 md:p-12 relative z-20">
         <div className="max-w-4xl mx-auto">
            <InputBar 
              onSend={onSend} 
              isLoading={isLoading || isExecuting} 
              activeMode={null} 
              onClearMode={() => {}} 
            />
         </div>
      </div>
    </div>
  );
};

export default ChatWorkspace;
