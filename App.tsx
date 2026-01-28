
import React, { useState } from 'react';
import InputBar from './components/InputBar';
import AgentChips from './components/AgentChips';
import SlidesWorkspace from './components/SlidesWorkspace';
import WebWorkspace from './components/WebWorkspace';
import ResearchWorkspace from './components/ResearchWorkspace';
import YouTubeWorkspace from './components/YouTubeWorkspace';
import RoadmapWorkspace from './components/RoadmapWorkspace';
import FloatingEditor from './components/FloatingEditor';
import ChatWorkspace from './components/ChatWorkspace';
import { getAgentResponse, getExecutionPlan } from './services/geminiService';
import { AgentResponse, AgentType, AppContext, ExecutionPlan, Message } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [currentContext, setCurrentContext] = useState<AppContext>('HUB');
  const [activeMode, setActiveMode] = useState<AgentType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastPrompt, setLastPrompt] = useState('');

  const handleHubInput = async (text: string) => {
    setLastPrompt(text);
    
    if (activeMode === AgentType.RESEARCHER || activeMode === AgentType.YOUTUBE_RESEARCHER) {
      setLoading(true);
      setCurrentContext('LOADING');
      try {
        const result = await getAgentResponse(text, activeMode);
        setResponse(result);
        if (activeMode === AgentType.RESEARCHER) setCurrentContext('RESEARCH');
        else setCurrentContext('YOUTUBE');
      } catch (error) {
        console.error("Direct Execution Error:", error);
        setCurrentContext('HUB');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setMessages([{ role: 'user', content: text }]);
    setCurrentContext('CHAT');
    
    try {
      const plan = await getExecutionPlan(text, activeMode);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I've analyzed your request. Here's a structured plan to build exactly what you need. Please review the steps below before we initiate the specialized agents.`,
        plan: plan
      }]);
    } catch (error) {
      console.error("Analysis Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I encountered a critical error during analysis. Could you please refine your request?" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleChatInput = async (text: string) => {
    setLoading(true);
    setLastPrompt(text);
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    
    try {
      const plan = await getExecutionPlan(`Original: ${lastPrompt}. Revision: ${text}`, activeMode);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I've updated the roadmap based on your feedback.`,
        plan: plan
      }]);
    } catch (error) {
      console.error("Analysis Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const executeStrategy = async () => {
    const lastPlanMessage = [...messages].reverse().find(m => m.plan);
    if (!lastPlanMessage || !lastPlanMessage.plan || !lastPlanMessage.plan.steps.length) {
      alert("System Error: Execution plan is invalid or empty.");
      return;
    }
    
    setIsExecuting(true);
    try {
      const primaryAgent = activeMode || (lastPlanMessage.plan.steps[0]?.agent as AgentType) || AgentType.ORCHESTRATOR;
      const result = await getAgentResponse(lastPrompt, primaryAgent, lastPlanMessage.plan);
      setResponse(result);

      if (result.type === AgentType.SLIDE_MASTER) setCurrentContext('SLIDES');
      else if (result.type === AgentType.WEB_ARCHITECT) setCurrentContext('WEB');
      else if (result.type === AgentType.VISUAL_DESIGNER) setCurrentContext('DESIGN');
      else if (result.type === AgentType.RESEARCHER) setCurrentContext('RESEARCH');
      else if (result.type === AgentType.YOUTUBE_RESEARCHER) setCurrentContext('YOUTUBE');
      else if (result.type === AgentType.ROADMAP_STRATEGIST) setCurrentContext('ROADMAP');
      else setCurrentContext('HUB');

    } catch (error) {
      console.error("Execution Failure:", error);
      alert("Execution interrupted.");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleWorkspaceEdit = async (text: string) => {
    setLoading(true);
    try {
      const result = await getAgentResponse(text, response?.type || AgentType.ORCHESTRATOR);
      setResponse(result);
    } catch (error) {
      console.error("Workspace edit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setCurrentContext('HUB');
    setActiveMode(null);
    setResponse(null);
    setMessages([]);
    setLastPrompt('');
  };

  const renderContent = () => {
    if (currentContext === 'LOADING') {
      return (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-10 animate-in fade-in duration-500">
           <div className="relative mb-12">
              <div className="w-24 h-24 border-4 border-gray-50 border-t-black rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <i className="fa-solid fa-sparkles text-2xl animate-pulse"></i>
              </div>
           </div>
           <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">OmniAgent Orchestrating</h2>
           <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.4em]">Intelligence Stream Active</p>
        </div>
      );
    }

    if (currentContext === 'CHAT') {
      return (
        <ChatWorkspace 
          messages={messages} 
          onSend={handleChatInput} 
          onApprove={executeStrategy} 
          isLoading={loading}
          isExecuting={isExecuting}
          onBack={resetAll}
        />
      );
    }

    if (currentContext === 'SLIDES' && response?.type === AgentType.SLIDE_MASTER) {
      return <SlidesWorkspace slides={response.content.slides || []} onBack={resetAll} onEdit={handleWorkspaceEdit} isLoading={loading} />;
    }

    if (currentContext === 'WEB' && response?.type === AgentType.WEB_ARCHITECT) {
      return <WebWorkspace content={response.content} onBack={resetAll} onEdit={handleWorkspaceEdit} isLoading={loading} />;
    }

    if (currentContext === 'RESEARCH' && response?.type === AgentType.RESEARCHER) {
      return <ResearchWorkspace content={response.content} onBack={resetAll} onEdit={handleWorkspaceEdit} isLoading={loading} lastQuery={lastPrompt} />;
    }

    if (currentContext === 'YOUTUBE' && response?.type === AgentType.YOUTUBE_RESEARCHER) {
      return <YouTubeWorkspace content={response.content} onBack={resetAll} onEdit={handleWorkspaceEdit} isLoading={loading} lastQuery={lastPrompt} />;
    }

    if (currentContext === 'ROADMAP' && response?.type === AgentType.ROADMAP_STRATEGIST) {
      return <RoadmapWorkspace roadmap={response.content.roadmap} onBack={resetAll} onEdit={handleWorkspaceEdit} isLoading={loading} />;
    }

    return (
      <div className={`w-full flex flex-col items-center transition-all duration-1000 ${loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="mb-0 text-center px-4">
          <div className="inline-block mb-4 animate-in zoom-in duration-1000">
             {activeMode ? (
               <div className="flex items-center justify-center space-x-3 bg-white border border-gray-100 px-6 py-2 rounded-full shadow-sm">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    activeMode === AgentType.ROADMAP_STRATEGIST ? 'bg-violet-500' : 'bg-black'
                  }`}></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{activeMode.replace('_', ' ')} ACTIVE</span>
               </div>
             ) : (
               <div className="bg-black text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-lg">OmniAgent Engine v2</div>
             )}
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#1a1a1a] tracking-tight mb-4 leading-[1.1] transition-all duration-700">
            {activeMode ? activeMode.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : "Create Anything."}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium tracking-tight mb-2">
            An elite multi-agent system built to design, code, and architect your digital vision.
          </p>
        </div>

        <InputBar onSend={handleHubInput} isLoading={loading} activeMode={activeMode} onClearMode={() => setActiveMode(null)} />
        {!activeMode && <AgentChips onAction={(type) => setActiveMode(type)} />}
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col items-center pt-28 pb-20 px-4 transition-all duration-1000 bg-[#fcfcfc]`}>
      <div className="fixed top-10 flex items-center bg-white/70 backdrop-blur-2xl border border-gray-200/50 px-8 py-4 rounded-full space-x-10 text-[13px] font-bold z-[100] shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={resetAll}>
           <div className="w-3 h-3 rounded-full bg-black"></div>
           <span className="tracking-tighter text-lg font-black text-gray-900">OmniAgent</span>
        </div>
        <div className="w-px h-5 bg-gray-200"></div>
        <div className="flex items-center space-x-8 text-gray-400">
          <button className="hover:text-black transition-colors" onClick={resetAll}>Home</button>
          <button className="hover:text-black transition-colors">Agents</button>
          <button className="hover:text-black transition-colors">History</button>
        </div>
        <button className="bg-black text-white px-6 py-2 rounded-full text-[11px] font-black hover:scale-105 transition-transform shadow-lg shadow-black/10">PRO ACCESS</button>
      </div>
      {renderContent()}
    </div>
  );
};

export default App;
