import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { WireframeRenderer } from './components/WireframeRenderer';
import { CodeViewer } from './components/CodeViewer';
import { generateWireframe } from './services/geminiService';
import { WireframeData, ViewMode } from './types';
import { Send, Loader2, Sparkles, Box, AlertCircle } from 'lucide-react';

// Mock initial data so the app isn't empty on load
const INITIAL_DATA: WireframeData = {
  title: "Concept Dashboard",
  description: "A sample dashboard layout to get you started.",
  rootElements: [
    {
      id: "root-1",
      type: "container" as any,
      style: { flexDirection: "col", alignItems: "center" },
      children: [
        { id: "head-1", type: "header" as any, label: "Welcome to CoLab", style: { color: "text-slate-900" } },
        { id: "txt-1", type: "text" as any, label: "Start by describing your app idea below.", style: { color: "text-slate-500" } }
      ]
    }
  ]
};

const App: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>(ViewMode.PM);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [wireframe, setWireframe] = useState<WireframeData>(INITIAL_DATA);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const data = await generateWireframe(prompt);
      setWireframe(data);
      setMode(ViewMode.DESIGN); // Auto switch to design view
    } catch (err) {
      setError("Failed to generate wireframe. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderContent = () => {
    if (mode === ViewMode.PM) {
      return (
        <div className="max-w-2xl mx-auto pt-20 px-6">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-6">
                    <Sparkles size={32} />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-4">What are we building today?</h2>
                <p className="text-slate-600 text-lg">Describe your feature in plain English. Our AI Architect will draft the blueprint for your team.</p>
            </div>

            <div className="bg-white p-2 rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-100">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A login screen with email, password, 'Remember Me' checkbox, and a 'Sign In' button. Also add a link for 'Forgot Password'..."
                    className="w-full h-40 p-4 text-lg resize-none outline-none text-slate-700 placeholder:text-slate-300 rounded-xl"
                />
                <div className="flex justify-between items-center px-2 py-2 border-t border-slate-50">
                    <span className="text-xs text-slate-400 font-medium px-2">Powered by Gemini 2.5</span>
                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className={`
                            flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all
                            ${isGenerating || !prompt.trim() 
                                ? 'bg-slate-300 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 translate-y-0 hover:-translate-y-0.5'
                            }
                        `}
                    >
                        {isGenerating ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                        {isGenerating ? 'Architecting...' : 'Generate Blueprint'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <div className="font-bold text-slate-800 mb-1">Describe</div>
                    <div className="text-xs text-slate-500">Natural Language</div>
                </div>
                 <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <div className="font-bold text-slate-800 mb-1">Visualize</div>
                    <div className="text-xs text-slate-500">Instant Wireframes</div>
                </div>
                 <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <div className="font-bold text-slate-800 mb-1">Build</div>
                    <div className="text-xs text-slate-500">React + Tailwind</div>
                </div>
            </div>
        </div>
      );
    }

    if (mode === ViewMode.DESIGN) {
      return (
        <div className="h-full flex flex-col">
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">{wireframe.title || 'Untitled Design'}</h2>
                    <p className="text-sm text-slate-500 max-w-2xl truncate">{wireframe.description}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                    <Box size={14} />
                    Wireframe Mode
                </div>
            </header>
            <div className="flex-1 overflow-auto bg-[#F3F4F6] p-8 flex justify-center">
                <div className="w-full max-w-4xl bg-white min-h-[800px] shadow-sm border border-slate-300 rounded-t-lg overflow-hidden flex flex-col">
                    <div className="h-6 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    </div>
                    <div className="p-8 flex flex-col gap-6 flex-1">
                         {wireframe.rootElements.map((node) => (
                             <WireframeRenderer key={node.id} node={node} />
                         ))}
                    </div>
                </div>
            </div>
        </div>
      );
    }

    if (mode === ViewMode.DEV) {
        return (
            <div className="h-full p-6 flex flex-col">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Developer Handout</h2>
                    <p className="text-slate-500">Auto-generated React/Tailwind code based on the approved wireframe.</p>
                </div>
                <div className="flex-1 min-h-0">
                    <CodeViewer data={wireframe} />
                </div>
            </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar currentMode={mode} setMode={setMode} />
      <main className="flex-1 h-full overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;