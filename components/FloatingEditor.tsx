
import React, { useState } from 'react';

interface FloatingEditorProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const FloatingEditor: React.FC<FloatingEditorProps> = ({ onSend, isLoading, placeholder }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim() && !isLoading) {
      onSend(value);
      setValue('');
    }
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6 animate-in slide-in-from-bottom-10 duration-700">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-rose-500/10 rounded-[24px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <form 
          onSubmit={handleSubmit}
          className="relative bg-white/80 backdrop-blur-2xl border border-gray-200 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center p-2"
        >
          <div className="flex-1 px-4">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder || "Refine this project with AI..."}
              className="w-full bg-transparent border-none focus:ring-0 text-gray-900 text-sm py-2 placeholder-gray-300 outline-none font-medium"
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading || !value.trim()}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-[14px] font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
              value.trim() ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-300'
            }`}
          >
            {isLoading ? (
              <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Update</span>
                <i className="fa-solid fa-sparkles text-[10px]"></i>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FloatingEditor;
