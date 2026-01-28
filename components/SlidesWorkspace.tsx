
import React, { useState, useRef } from 'react';
import { Slide } from '../types';
import FloatingEditor from './FloatingEditor';
import { jsPDF } from 'jspdf';
import pptxgen from 'pptxgenjs';

interface SlidesWorkspaceProps {
  slides: Slide[];
  onBack: () => void;
  onEdit: (prompt: string) => void;
  isLoading: boolean;
}

const SlidesWorkspace: React.FC<SlidesWorkspaceProps> = ({ slides = [], onBack, onEdit, isLoading }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  
  const currentSlide = slides.length > 0 ? slides[activeIdx] : null;

  const exportToPDF = async () => {
    if (slides.length === 0) return;
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1280, 720]
      });

      for (let i = 0; i < slides.length; i++) {
        if (i > 0) doc.addPage();
        const s = slides[i];
        
        doc.setFillColor(252, 252, 252);
        doc.rect(0, 0, 1280, 720, 'F');
        
        doc.setFillColor(245, 158, 11);
        doc.rect(100, 100, 80, 8, 'F');

        doc.setTextColor(26, 26, 26);
        doc.setFont('times', 'bold');
        doc.setFontSize(64);
        doc.text(s.title, 100, 180, { maxWidth: 1000 });

        doc.setFont('times', 'italic');
        doc.setFontSize(28);
        doc.setTextColor(100, 100, 100);
        doc.text(`"${s.content}"`, 100, 260, { maxWidth: 1000 });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(24);
        doc.setTextColor(50, 50, 50);
        s.points.forEach((p, idx) => {
          doc.setFillColor(245, 158, 11);
          doc.circle(115, 340 + idx * 45, 4, 'F');
          doc.text(p, 135, 345 + idx * 45, { maxWidth: 900 });
        });

        doc.setFontSize(14);
        doc.setTextColor(200, 200, 200);
        doc.text(`OmniAgent Intelligence Core | Page ${i + 1} of ${slides.length}`, 100, 650);
      }
      doc.save('OmniAgent-Presentation.pdf');
    } catch (err) {
      console.error("PDF Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPPTX = async () => {
    if (slides.length === 0) return;
    setIsExporting(true);
    try {
      const pptx = new pptxgen();
      
      slides.forEach((s, idx) => {
        const slide = pptx.addSlide();
        slide.background = { fill: "FCFCFC" };
        slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.5, w: 0.8, h: 0.1, fill: { color: "F59E0B" } });
        slide.addText(s.title, { 
          x: 0.5, y: 0.8, w: 9, h: 1.5, 
          fontSize: 44, bold: true, fontFace: "Georgia", color: "1A1A1A" 
        });
        slide.addText(s.content, { 
          x: 0.5, y: 2.2, w: 9, h: 0.8, 
          fontSize: 20, italic: true, fontFace: "Georgia", color: "666666" 
        });
        const bulletPoints = s.points.map(p => ({ text: p, options: { bullet: true, color: "333333", fontSize: 18 } }));
        slide.addText(bulletPoints, { x: 0.7, y: 3.2, w: 8.5, h: 3, lineSpacing: 35 });
        slide.addText(`Slide ${idx + 1} | Powered by OmniAgent`, { 
          x: 0.5, y: 5.2, w: 9, h: 0.3, 
          fontSize: 10, color: "CCCCCC", align: "right" 
        });
      });

      await pptx.writeFile({ fileName: 'OmniAgent-Professional-Deck.pptx' });
    } catch (err) {
      console.error("PPTX Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#fcfcfc] z-50 flex flex-col text-gray-900 font-sans selection:bg-amber-500/10 animate-in fade-in duration-700">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* Elegant Header */}
      <div className="h-20 border-b border-gray-100 bg-white/70 backdrop-blur-3xl flex items-center justify-between px-10 relative z-20 shadow-sm">
        <div className="flex items-center space-x-8">
          <button onClick={onBack} className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-2xl text-gray-400 hover:text-black transition-all group">
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          </button>
          <div className="h-8 w-px bg-gray-100"></div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 text-white">
              <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
            </div>
            <div>
              <h2 className="font-black text-sm tracking-tight uppercase text-gray-900">Presentation Studio</h2>
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Active Creation</span>
                <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                <span className="text-[9px] font-bold text-gray-400">{slides.length} Slides</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex bg-gray-50 p-1 rounded-2xl border border-gray-100 mr-4">
             <button 
               onClick={exportToPDF}
               disabled={isExporting}
               className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white hover:shadow-sm flex items-center space-x-2 text-gray-500 hover:text-black"
             >
                <i className="fa-solid fa-file-pdf text-red-500"></i>
                <span>{isExporting ? 'Exporting...' : 'PDF'}</span>
             </button>
             <button 
               onClick={exportToPPTX}
               disabled={isExporting}
               className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white hover:shadow-sm flex items-center space-x-2 text-gray-500 hover:text-black"
             >
                <i className="fa-solid fa-file-powerpoint text-amber-500"></i>
                <span>{isExporting ? 'Encoding...' : 'PPTX'}</span>
             </button>
          </div>
          <button className="px-10 py-3 bg-black text-white hover:scale-105 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-xl transition-all transform active:scale-95">
             <i className="fa-solid fa-play mr-3"></i>
             Present
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Sidebar Nav */}
        <div className="w-80 border-r border-gray-100 bg-white/50 backdrop-blur-xl flex flex-col overflow-y-auto custom-scrollbar p-6 space-y-6">
          <div className="px-2 mb-2">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Deck Narrative</span>
          </div>
          
          {slides.map((slide, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative group w-full text-left rounded-[28px] transition-all duration-500 overflow-hidden border ${
                activeIdx === idx 
                ? 'bg-white border-amber-200 shadow-[0_15px_30px_rgba(245,158,11,0.08)] scale-[1.02]' 
                : 'bg-transparent border-transparent opacity-60 hover:opacity-100 hover:bg-white hover:border-gray-100'
              }`}
            >
              <div className="aspect-video bg-gray-100 relative overflow-hidden m-2 rounded-2xl">
                 <div className="w-full h-full scale-[0.22] origin-top-left p-12">
                    <div className="h-2 w-20 bg-amber-500 mb-8 rounded-full"></div>
                    <h4 className="text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight">{slide.title}</h4>
                    <p className="text-2xl text-gray-400 mb-10">{slide.content}</p>
                 </div>
                 <div className={`absolute bottom-3 right-4 text-[9px] font-black px-2 py-0.5 rounded-md ${activeIdx === idx ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    0{idx + 1}
                 </div>
              </div>
              <div className="px-4 pb-4">
                 <div className="text-[10px] font-bold text-gray-600 line-clamp-1">{slide.title}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Workspace Canvas */}
        <div className="flex-1 bg-gray-50/50 p-12 md:p-20 flex items-center justify-center overflow-auto relative">
          {/* Elegant Ambient Gradients */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full"></div>
             <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full"></div>
          </div>

          {currentSlide ? (
            <div 
              ref={slideRef}
              className="w-full max-w-6xl aspect-video bg-white rounded-[50px] shadow-[0_40px_80px_rgba(0,0,0,0.08)] flex flex-col justify-center px-24 py-20 animate-in zoom-in-95 duration-700 relative overflow-hidden group/slide border border-gray-100"
            >
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center space-x-6 mb-12">
                   <div className="h-2 w-24 bg-amber-500 rounded-full"></div>
                   <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Section Focus</span>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <h1 className="text-6xl md:text-7xl font-serif font-bold text-[#1a1a1a] leading-tight mb-12 tracking-tight">
                    {currentSlide.title}
                  </h1>
                  
                  <div className="flex flex-col md:flex-row md:items-start gap-16">
                    <div className="md:w-5/12">
                       <p className="text-2xl text-gray-400 font-light italic leading-relaxed border-l-2 border-amber-100 pl-10 py-2">
                         {currentSlide.content}
                       </p>
                    </div>
                    
                    <div className="md:w-7/12 space-y-5">
                      {currentSlide.points?.map((p, i) => (
                        <div key={i} className="flex items-start space-x-6 group/item transform transition-all hover:translate-x-2 duration-300">
                          <div className="mt-2 w-4 h-4 rounded-full bg-amber-500/10 flex items-center justify-center text-[8px] font-black text-amber-600 border border-amber-200">
                             {i + 1}
                          </div>
                          <span className="text-xl text-gray-700 font-medium tracking-tight group-hover:text-black transition-colors">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-12 border-t border-gray-50">
                   <div className="flex items-center space-x-6">
                      <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white text-[10px]">
                         <i className="fa-solid fa-om"></i>
                      </div>
                      <div>
                         <div className="text-[10px] font-black text-gray-900 uppercase tracking-widest">OmniAgent Engine</div>
                         <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Editorial Series v4.2</div>
                      </div>
                   </div>
                   <div className="text-[40px] font-serif font-black text-gray-50 italic select-none">
                      {activeIdx + 1}
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <i className="fa-solid fa-sparkles text-amber-500 text-2xl"></i>
              </div>
              <p className="text-gray-300 font-black uppercase tracking-[0.4em] text-xs">Architecting Slides...</p>
            </div>
          )}
        </div>
      </div>

      <FloatingEditor 
        onSend={onEdit} 
        isLoading={isLoading} 
        placeholder="Iterate on this slide deck... (e.g. 'Add a case study slide')"
      />
    </div>
  );
};

export default SlidesWorkspace;
