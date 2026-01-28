
import React from 'react';
import { ExecutionPlan, AgentType } from '../types';

interface PlanningScreenProps {
  plan: ExecutionPlan;
  onApprove: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const PlanningScreen: React.FC<PlanningScreenProps> = ({ plan, onApprove, onCancel, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-[#050505] z-[100] flex items-center justify-center p-6 md:p-12 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-5xl bg-[#0a0a0a] border border-white/5 rounded-[48px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-700">
        
        {/* Left: Metadata & Objectives */}
        <div className="w-full md:w-1/3 p-12 bg-black/40 border-r border-white/5 flex flex-col">
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/80">Strategy Core</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-white mb-6 leading-tight">Analyzing Requirements</h1>
            <p className="text-white/40 text-sm leading-relaxed mb-8">{plan.objective}</p>
          </div>

          <div className="space-y-6 flex-1">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20 block mb-3">Allocated Stack</span>
              <div className="flex flex-wrap gap-2">
                {plan.technicalStack.map(s => (
                  <span key={s} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/60 border border-white/5">{s}</span>
                ))}
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20 block mb-2">Computational Load</span>
              <div className="flex items-center justify-between">
                 <span className={`text-sm font-bold ${plan.estimatedComplexity === 'Critical' ? 'text-rose-500' : 'text-blue-400'}`}>{plan.estimatedComplexity} Complexity</span>
                 <i className="fa-solid fa-microchip text-white/20"></i>
              </div>
            </div>
          </div>

          <button 
            onClick={onCancel}
            className="mt-12 text-xs font-bold text-white/30 hover:text-white transition-colors flex items-center space-x-2"
          >
            <i className="fa-solid fa-arrow-left text-[10px]"></i>
            <span>Cancel Strategy</span>
          </button>
        </div>

        {/* Right: Steps & Approval */}
        <div className="flex-1 p-12 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center justify-between mb-10">
               <h2 className="text-xl font-bold text-white tracking-tight">Execution Roadmap</h2>
               <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{plan.steps.length} Steps Sequence</span>
            </div>

            <div className="space-y-4">
              {plan.steps.map((step, idx) => (
                <div key={step.id} className="group relative pl-12 pb-6 border-l border-white/5 last:border-none">
                  <div className="absolute left-[-9px] top-0 w-[17px] h-[17px] bg-black border border-white/20 rounded-full flex items-center justify-center group-hover:border-blue-500 transition-colors">
                    <span className="text-[8px] font-black text-white/40 group-hover:text-blue-500">{idx + 1}</span>
                  </div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-white/90">{step.title}</h3>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded-md border border-white/5">{step.agent.replace('_', ' ')}</span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-white/5 relative z-10">
            <button 
              onClick={onApprove}
              disabled={isLoading}
              className="w-full bg-white text-black py-5 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-4 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-[3px] border-black/10 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Authorize Agent Build</span>
                  <i className="fa-solid fa-bolt text-[10px] group-hover:rotate-12 transition-transform"></i>
                </>
              )}
            </button>
            <p className="text-center mt-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">System ready for deployment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningScreen;
