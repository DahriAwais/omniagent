
import React, { useState, useRef, useEffect } from 'react';
import { RoadmapNode } from '../types';
import FloatingEditor from './FloatingEditor';

interface RoadmapWorkspaceProps {
  roadmap: RoadmapNode;
  onBack: () => void;
  onEdit: (prompt: string) => void;
  isLoading: boolean;
}

const RoadmapWorkspace: React.FC<RoadmapWorkspaceProps> = ({ roadmap, onBack, onEdit, isLoading }) => {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(roadmap);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Simple recursive component to render tree nodes
  const RenderNode = ({ node, x, y, level }: { node: RoadmapNode; x: number; y: number; level: number }) => {
    const childWidth = 320;
    const horizontalGap = 100;
    const verticalGap = 180;

    return (
      <div className="absolute" style={{ left: x, top: y }}>
        {/* Node Card */}
        <div 
          onClick={(e) => { e.stopPropagation(); setSelectedNode(node); }}
          className={`w-64 p-6 rounded-[24px] border transition-all cursor-pointer group ${
            selectedNode?.id === node.id 
              ? 'bg-white border-violet-500 shadow-[0_20px_40px_rgba(139,92,246,0.15)] scale-105 z-10' 
              : 'bg-white/80 border-gray-100 hover:border-violet-200 hover:shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
             <span className="text-[9px] font-black text-violet-500 uppercase tracking-widest">{node.duration}</span>
             <i className={`fa-solid fa-circle-check ${selectedNode?.id === node.id ? 'text-violet-500' : 'text-gray-100'}`}></i>
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-2">{node.label}</h4>
          <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{node.description}</p>
        </div>

        {/* Render Children */}
        {node.children?.map((child, idx) => {
          const childX = (idx - (node.children!.length - 1) / 2) * (childWidth);
          const childY = verticalGap;

          return (
            <React.Fragment key={child.id}>
              {/* Connection Line */}
              <svg className="absolute pointer-events-none" style={{ top: 0, left: 32, width: Math.abs(childX) + 100, height: verticalGap + 50, zIndex: -1 }}>
                 <path 
                   d={`M 96 100 C 96 ${100 + verticalGap/2}, ${96 + childX} ${100 + verticalGap/2}, ${96 + childX} ${verticalGap}`} 
                   stroke={selectedNode?.id === node.id ? '#ddd' : '#eee'} 
                   strokeWidth="2" 
                   fill="none" 
                   className="transition-all duration-500"
                 />
              </svg>
              <RenderNode node={child} x={childX} y={childY} level={level + 1} />
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.group')) return;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
  };

  return (
    <div className="fixed inset-0 bg-[#fcfcfc] z-50 flex overflow-hidden animate-in fade-in duration-700">
      {/* Background radial dots */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      {/* Left Interface: Details & Editor */}
      <div className="w-[440px] border-r border-gray-100 bg-white/70 backdrop-blur-3xl z-30 flex flex-col shadow-2xl">
         <div className="p-10 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-4">
               <button onClick={onBack} className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-black transition-all">
                  <i className="fa-solid fa-arrow-left"></i>
               </button>
               <div>
                  <h2 className="text-[10px] font-black text-violet-500 uppercase tracking-[0.2em]">Career Architect</h2>
                  <p className="text-sm font-bold text-gray-900">Project Workspace</p>
               </div>
            </div>
            <button className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
               <i className="fa-solid fa-share-nodes text-[10px] text-gray-400"></i>
            </button>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
            {selectedNode ? (
               <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="inline-block px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Selected Phase</div>
                  <h3 className="text-3xl font-serif font-bold text-gray-900 mb-6 leading-tight">{selectedNode.label}</h3>
                  <p className="text-gray-500 leading-relaxed mb-10 italic border-l-2 border-violet-100 pl-6">{selectedNode.description}</p>
                  
                  <div className="space-y-8">
                     <div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-4">Core Skills to Master</span>
                        <div className="flex flex-wrap gap-2">
                           {selectedNode.skills.map(skill => (
                              <span key={skill} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-2xl text-[11px] font-bold text-gray-600 hover:border-violet-200 transition-all">{skill}</span>
                           ))}
                        </div>
                     </div>
                     
                     <div className="p-6 bg-violet-50/50 rounded-[32px] border border-violet-100">
                        <div className="flex items-center space-x-3 mb-3">
                           <i className="fa-solid fa-clock text-violet-500 text-xs"></i>
                           <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest">Expected Timeline</span>
                        </div>
                        <p className="text-sm font-bold text-gray-700">{selectedNode.duration}</p>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center px-10">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                     <i className="fa-solid fa-fingerprint text-gray-200 text-2xl"></i>
                  </div>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-loose">Select a roadmap node to visualize phase intelligence</p>
               </div>
            )}
         </div>

         <div className="p-8 border-t border-gray-50">
            <div className="p-5 bg-black rounded-[28px] text-white flex items-center justify-between">
               <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                     <i className="fa-solid fa-sparkles text-[10px]"></i>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest">Master Protocol</span>
               </div>
               <button className="text-[10px] font-black uppercase text-white/50 hover:text-white">Settings</button>
            </div>
         </div>
      </div>

      {/* Main Stage: The Tree */}
      <div 
        className="flex-1 relative cursor-grab active:cursor-grabbing" 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
         <div 
           className="absolute transition-transform duration-75" 
           style={{ transform: `translate(${offset.x + window.innerWidth/2 - 220}px, ${offset.y + 100}px)` }}
         >
            <RenderNode node={roadmap} x={0} y={0} level={0} />
         </div>

         {/* UI Controls */}
         <div className="absolute bottom-10 right-10 flex flex-col space-y-3 z-40">
            <button onClick={() => setOffset({x:0, y:0})} className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-400 hover:text-black transition-all border border-gray-100">
               <i className="fa-solid fa-crosshairs text-sm"></i>
            </button>
            <div className="w-12 p-1 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col">
               <button className="h-10 hover:bg-gray-50 rounded-xl transition-colors"><i className="fa-solid fa-plus text-[10px]"></i></button>
               <button className="h-10 hover:bg-gray-50 rounded-xl transition-colors"><i className="fa-solid fa-minus text-[10px]"></i></button>
            </div>
         </div>
      </div>

      <FloatingEditor 
        onSend={onEdit} 
        isLoading={isLoading} 
        placeholder={selectedNode ? `Ask about "${selectedNode.label}"...` : "Modify your career roadmap..."}
      />
    </div>
  );
};

export default RoadmapWorkspace;
