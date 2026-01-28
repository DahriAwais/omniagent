
import React from 'react';
import { AgentResponse, AgentType, Slide } from '../types';

interface DisplayAreaProps {
  response: AgentResponse | null;
}

const DisplayArea: React.FC<DisplayAreaProps> = ({ response }) => {
  if (!response) return null;

  const renderSlides = (slides: Slide[]) => (
    <div className="flex flex-col space-y-6 w-full max-w-4xl mx-auto py-10">
      {slides.map((slide, idx) => (
        <div key={idx} className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-sm hover:shadow-md transition-shadow">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Slide {idx + 1}</span>
          <h3 className="text-3xl font-serif font-bold text-gray-900 mb-6">{slide.title}</h3>
          <p className="text-gray-600 mb-8 leading-relaxed italic">{slide.content}</p>
          <ul className="space-y-3">
            {slide.points.map((p, i) => (
              <li key={i} className="flex items-start space-x-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></div>
                <span className="text-gray-700">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderWeb = (content: any) => (
    <div className="w-full max-w-6xl mx-auto py-10">
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-md text-[11px] text-gray-400 px-3 py-1 text-center">
            localhost:3000/generated-preview
          </div>
        </div>
        <div 
          className="w-full min-h-[500px]"
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      </div>
    </div>
  );

  const renderDesign = (content: any) => (
    <div className="w-full max-w-4xl mx-auto py-10">
      <div className="bg-white p-4 rounded-[40px] shadow-2xl overflow-hidden group">
        <img 
          src={content.imageUrl} 
          alt="Generated Design" 
          className="w-full h-auto rounded-[32px] group-hover:scale-[1.02] transition-transform duration-700"
        />
        <div className="p-8">
          <h4 className="text-xl font-medium mb-2">Visual Masterpiece</h4>
          <p className="text-gray-500 text-sm leading-relaxed">{content.prompt}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 mb-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-tighter">
            {response.type.replace('_', ' ')} ACTIVE
          </span>
        </div>
        <p className="text-gray-400 max-w-xl mx-auto text-sm">{response.explanation}</p>
      </div>

      {response.type === AgentType.SLIDE_MASTER && renderSlides(response.content.slides)}
      {response.type === AgentType.WEB_ARCHITECT && renderWeb(response.content)}
      {response.type === AgentType.VISUAL_DESIGNER && renderDesign(response.content)}
      {response.type === AgentType.RESEARCHER && (
        <div className="bg-white border border-gray-100 rounded-3xl p-8 max-w-4xl mx-auto shadow-sm">
           <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{response.content.content}</p>
        </div>
      )}
    </div>
  );
};

export default DisplayArea;
