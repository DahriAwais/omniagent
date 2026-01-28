
import React, { useState, useRef, useEffect } from 'react';
import { AgentType } from '../types';

interface AgentChipsProps {
  onAction: (type: AgentType) => void;
}

const AgentChips: React.FC<AgentChipsProps> = ({ onAction }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mainChips = [
    { label: 'Create slides', icon: 'fa-regular fa-clone', type: AgentType.SLIDE_MASTER, color: 'hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200' },
    { label: 'Build website', icon: 'fa-solid fa-code', type: AgentType.WEB_ARCHITECT, color: 'hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200' },
    { label: 'Video Research', icon: 'fa-brands fa-youtube', type: AgentType.YOUTUBE_RESEARCHER, color: 'hover:bg-red-50 hover:text-red-600 hover:border-red-200' },
    { label: 'Career Roadmap', icon: 'fa-solid fa-route', type: AgentType.ROADMAP_STRATEGIST, color: 'hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200' },
  ];

  return (
    <div className="relative flex flex-wrap justify-center gap-4 mt-4 animate-in slide-in-from-bottom-6 duration-1000">
      {mainChips.map((chip) => (
        <button
          key={chip.label}
          onClick={() => onAction(chip.type)}
          className={`flex items-center space-x-3 px-6 py-3.5 bg-white border border-gray-100 rounded-3xl text-[13px] font-bold text-gray-700 shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${chip.color}`}
        >
          <i className={`${chip.icon} text-lg opacity-80`}></i>
          <span>{chip.label}</span>
        </button>
      ))}

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className={`flex items-center space-x-2 px-8 py-3.5 rounded-3xl text-[13px] font-bold transition-all duration-300 shadow-sm ${
            isMoreOpen ? 'bg-black text-white shadow-xl' : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>More</span>
          <i className={`fa-solid fa-chevron-${isMoreOpen ? 'up' : 'down'} text-[10px] ml-1`}></i>
        </button>

        {isMoreOpen && (
          <div className="absolute bottom-full mb-6 right-0 w-72 bg-white border border-gray-100 rounded-[32px] shadow-[0_30px_90px_rgba(0,0,0,0.15)] p-3 z-50 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col space-y-1">
              <div className="px-4 py-3 mb-2">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Utility Agents</span>
              </div>
              {[
                { label: 'Deep Research', icon: 'fa-solid fa-magnifying-glass', type: AgentType.RESEARCHER },
                { label: 'Professional Design', icon: 'fa-solid fa-palette', type: AgentType.VISUAL_DESIGNER },
                { label: 'Schedule Task', icon: 'fa-solid fa-calendar', type: AgentType.TASK_SCHEDULER },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    onAction(item.type);
                    setIsMoreOpen(false);
                  }}
                  className="flex items-center space-x-4 w-full px-4 py-3.5 hover:bg-gray-50 rounded-2xl text-left text-sm font-bold text-gray-600 transition-colors group"
                >
                  <i className={`${item.icon} w-5 text-gray-300 group-hover:text-black`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentChips;
