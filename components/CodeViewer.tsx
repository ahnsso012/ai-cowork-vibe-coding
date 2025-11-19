import React, { useMemo } from 'react';
import { Copy } from 'lucide-react';
import { UIComponentNode, WireframeData, ElementType } from '../types';

interface Props {
  data: WireframeData;
}

const generateComponentCode = (node: UIComponentNode, depth: number = 0): string => {
  const indent = '  '.repeat(depth);
  const { type, label, placeholder, style, children } = node;
  
  // Helper to clean up style object to string classes
  const classNames = [
    style?.flexDirection === 'row' ? 'flex-row' : (type === ElementType.Container || type === ElementType.Card ? 'flex-col' : ''),
    (type === ElementType.Container || type === ElementType.Card) ? 'flex' : '',
    style?.justifyContent ? `justify-${style.justifyContent}` : '',
    style?.alignItems ? `items-${style.alignItems}` : '',
    style?.width,
    style?.padding,
    style?.backgroundColor,
    style?.color,
    type === ElementType.Card ? 'bg-white shadow rounded-xl border border-gray-200' : '',
    type === ElementType.Button ? 'bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded transition' : '',
    type === ElementType.Input ? 'border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none' : '',
    type === ElementType.Header ? 'text-2xl font-bold text-gray-900' : '',
    type === ElementType.Text ? 'text-gray-600' : '',
  ].filter(Boolean).join(' ');

  const childrenCode = children 
    ? children.map(c => generateComponentCode(c, depth + 1)).join('\n') 
    : '';

  switch (type) {
    case ElementType.Container:
    case ElementType.Card:
      return `${indent}<div className="${classNames} gap-4">\n${childrenCode}\n${indent}</div>`;
    
    case ElementType.Header:
      return `${indent}<h2 className="${classNames}">${label}</h2>`;
    
    case ElementType.Text:
      return `${indent}<p className="${classNames}">${label || ''}</p>`;
      
    case ElementType.Button:
      return `${indent}<button className="${classNames}">${label}</button>`;
      
    case ElementType.Input:
      return `${indent}<div className="w-full">\n${indent}  ${label ? `<label className="block text-sm font-medium text-gray-700 mb-1">${label}</label>` : ''}\n${indent}  <input type="text" className="${classNames} w-full" placeholder="${placeholder || ''}" />\n${indent}</div>`;
      
    case ElementType.Image:
      return `${indent}<div className="${classNames} bg-gray-200 rounded h-48 flex items-center justify-center text-gray-400">Image Placeholder</div>`;

    case ElementType.Divider:
      return `${indent}<hr className="my-4 border-gray-200" />`;
      
    default:
      return `${indent}<div>Unknown</div>`;
  }
};

export const CodeViewer: React.FC<Props> = ({ data }) => {
  
  const codeString = useMemo(() => {
    const body = data.rootElements.map(node => generateComponentCode(node, 3)).join('\n');
    return `import React from 'react';

export const ${data.title.replace(/\s+/g, '')}Component = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">${data.title}</h1>
${body}
      </div>
    </div>
  );
};`;
  }, [data]);

  const copyToClipboard = () => {
      navigator.clipboard.writeText(codeString);
      alert('Code copied to clipboard!');
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-blue-100 font-mono text-sm rounded-xl overflow-hidden shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-black/20">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="text-xs text-slate-400">GeneratedComponent.tsx</div>
        <button onClick={copyToClipboard} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition">
            <Copy size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-6 whitespace-pre leading-relaxed">
        {codeString}
      </div>
    </div>
  );
};