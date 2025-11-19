import React from 'react';
import { Layout, Code, PenTool, Sparkles, Layers } from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentMode: ViewMode;
  setMode: (mode: ViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { id: ViewMode.PM, label: 'Plan (PM)', icon: <PenTool size={20} />, desc: 'Prompt & Scope' },
    { id: ViewMode.DESIGN, label: 'Design (UX)', icon: <Layout size={20} />, desc: 'Visual Wireframe' },
    { id: ViewMode.DEV, label: 'Develop (Eng)', icon: <Code size={20} />, desc: 'React Code' },
  ];

  return (
    <div className="w-72 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800 flex-shrink-0">
      <div className="p-6 flex items-center gap-3 text-white border-b border-slate-800">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">CoLab AI</h1>
          <p className="text-xs text-slate-400">Unified Workflow</p>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 px-2">
          Perspectives
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group text-left
              ${currentMode === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
          >
            <div className={`${currentMode === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
              {item.icon}
            </div>
            <div>
              <div className="font-medium text-sm">{item.label}</div>
              <div className={`text-xs ${currentMode === item.id ? 'text-indigo-200' : 'text-slate-600 group-hover:text-slate-400'}`}>
                {item.desc}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-4 flex items-start gap-3">
          <Layers size={16} className="text-indigo-400 mt-1" />
          <div className="text-xs text-slate-400 leading-relaxed">
            Collaborate seamlessly. Changes in planning automatically reflect in design and code drafts.
          </div>
        </div>
      </div>
    </div>
  );
};