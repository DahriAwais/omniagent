
import React, { useState, useRef } from 'react';
import { AgentType } from '../types';

interface InputBarProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  activeMode: AgentType | null;
  onClearMode: () => void;
}

const InputBar: React.FC<InputBarProps> = ({ onSend, isLoading, activeMode, onClearMode }) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim() && !isLoading) {
      onSend(value);
      setValue('');
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const getModeInfo = () => {
    switch (activeMode) {
      case AgentType.SLIDE_MASTER: return { label: 'Slides', color: 'bg-amber-500', glow: 'shadow-amber-500/20' };
      case AgentType.WEB_ARCHITECT: return { label: 'Web', color: 'bg-indigo-600', glow: 'shadow-indigo-600/20' };
      case AgentType.VISUAL_DESIGNER: return { label: 'Design', color: 'bg-rose-500', glow: 'shadow-rose-500/20' };
      case AgentType.RESEARCHER: return { label: 'Research', color: 'bg-emerald-600', glow: 'shadow-emerald-600/20' };
      case AgentType.YOUTUBE_RESEARCHER: return { label: 'YouTube', color: 'bg-red-600', glow: 'shadow-red-600/20' };
      default: return null;
    }
  };

  const modeInfo = getModeInfo();

  return (
    <div className="w-full max-w-4xl px-4 mx-auto mt-0 mb-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative group">
        {/* Mode Indicator */}
        {modeInfo && (
          <div className="absolute -top-12 left-8 flex items-center space-x-2 animate-in slide-in-from-bottom-2 duration-300 z-10">
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl flex items-center ${modeInfo.color} ${modeInfo.glow}`}>
              <i className="fa-solid fa-sparkles mr-2 animate-pulse text-[8px]"></i>
              {modeInfo.label} Mode
              <button onClick={onClearMode} className="ml-3 p-1 hover:bg-black/10 rounded-full transition-colors leading-none">
                <i className="fa-solid fa-xmark text-[10px]"></i>
              </button>
            </div>
          </div>
        )}

        <div className={`absolute -inset-[1px] bg-gradient-to-b from-gray-200 to-transparent rounded-[36px] opacity-50 transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'group-hover:opacity-80'}`}></div>
        
        <form 
          onSubmit={handleSubmit}
          className={`relative bg-white border rounded-[34px] transition-all duration-500 p-2.5 overflow-hidden flex flex-col ${
            isFocused 
              ? 'border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.12),0_0_0_4px_rgba(0,0,0,0.02)] scale-[1.01]' 
              : 'border-gray-200 shadow-[0_15px_40px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02)] group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] group-hover:border-gray-300'
          }`}
        >
          <div className="flex flex-col px-6 pt-5 pb-3">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Ask anything"
              className="w-full bg-transparent border-none focus:ring-0 text-gray-800 text-xl md:text-2xl placeholder-gray-300 resize-none min-h-[56px] max-h-[160px] outline-none font-medium leading-snug"
              rows={1}
            />

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2.5">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={(e) => console.log('File selected:', e.target.files?.[0])}
                />
                
                <button 
                  type="button" 
                  onClick={handleFileClick}
                  className="flex items-center space-x-2 px-5 py-2.5 hover:bg-gray-50 rounded-full border border-gray-100 transition-all text-sm font-bold text-gray-500 hover:text-black hover:border-gray-200 group active:scale-95 shadow-sm"
                >
                  <i className="fa-solid fa-paperclip text-gray-400 group-hover:text-black transition-colors text-base"></i>
                  <span>Attach</span>
                </button>

                <button 
                  type="button" 
                  className="flex items-center space-x-2 px-5 py-2.5 hover:bg-gray-50 rounded-full border border-gray-100 transition-all text-sm font-bold text-gray-500 hover:text-black hover:border-gray-200 group active:scale-95 shadow-sm"
                >
                  <i className="fa-solid fa-globe text-gray-400 group-hover:text-black transition-colors text-base"></i>
                  <span>Search</span>
                </button>

                <button 
                  type="button" 
                  className="flex items-center space-x-2 px-5 py-2.5 hover:bg-gray-50 rounded-full border border-gray-100 transition-all text-sm font-bold text-gray-500 hover:text-black hover:border-gray-200 group active:scale-95 shadow-sm"
                >
                  <i className="fa-solid fa-video text-gray-400 group-hover:text-black transition-colors text-base"></i>
                  <span>Videos</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  type="button" 
                  className="flex items-center space-x-2.5 px-5 py-2.5 hover:bg-gray-50 rounded-full transition-all text-sm font-bold text-gray-500 hover:text-black group active:scale-95"
                >
                  <i className="fa-solid fa-waveform-lines text-gray-400 group-hover:text-black transition-colors text-lg"></i>
                  <span>Voice</span>
                </button>

                {value.trim() && (
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95 transition-all animate-in zoom-in duration-300"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <i className="fa-solid fa-arrow-up text-lg"></i>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputBar;
