import React from 'react';
import { UIComponentNode, ElementType } from '../types';
import { Image as ImageIcon, Type as TypeIcon, Box } from 'lucide-react';

interface Props {
  node: UIComponentNode;
}

export const WireframeRenderer: React.FC<Props> = ({ node }) => {
  const { type, label, placeholder, style, children } = node;

  // Map generic tailwind classes or use defaults
  const baseClasses = `
    ${style?.width || 'w-full'} 
    ${style?.padding || ''} 
    ${style?.backgroundColor || ''} 
    ${style?.color || ''}
    ${style?.borderRadius || ''}
  `;

  const layoutClasses = `
    flex 
    ${style?.flexDirection === 'row' ? 'flex-row' : 'flex-col'} 
    gap-4
    ${style?.justifyContent ? `justify-${style.justifyContent}` : ''}
    ${style?.alignItems ? `items-${style.alignItems}` : ''}
  `;

  const renderChildren = () => children?.map((child) => <WireframeRenderer key={child.id} node={child} />);

  switch (type) {
    case ElementType.Container:
      return (
        <div className={`${baseClasses} ${layoutClasses} border border-dashed border-slate-300 p-4 min-h-[50px]`}>
           {/* Helper label for container in Design Mode */}
           <div className="text-[10px] uppercase text-slate-400 mb-1 select-none flex items-center gap-1">
             <Box size={10}/> Container
           </div>
           {renderChildren()}
        </div>
      );
    
    case ElementType.Card:
      return (
        <div className={`bg-white shadow-sm border border-slate-200 rounded-xl p-6 ${layoutClasses} ${style?.width || 'w-full'}`}>
          {renderChildren()}
        </div>
      );

    case ElementType.Header:
      return (
        <h2 className={`text-2xl font-bold text-slate-800 ${baseClasses}`}>
          {label || 'Header'}
        </h2>
      );

    case ElementType.Text:
      return (
        <p className={`text-slate-600 leading-relaxed ${baseClasses}`}>
          {label || 'Lorem ipsum dolor sit amet.'}
        </p>
      );

    case ElementType.Button:
      return (
        <button className={`
          px-4 py-2 rounded-lg font-medium transition-colors
          bg-indigo-600 text-white hover:bg-indigo-700
          ${style?.width === 'w-full' ? 'w-full' : 'w-auto'}
        `}>
          {label || 'Button'}
        </button>
      );

    case ElementType.Input:
      return (
        <div className="w-full space-y-1">
          {label && <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>}
          <input 
            type="text" 
            placeholder={placeholder || 'Enter text...'}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-slate-50"
            readOnly
          />
        </div>
      );

    case ElementType.Image:
      return (
        <div className={`bg-slate-200 rounded-lg flex items-center justify-center aspect-video ${baseClasses}`}>
          <div className="flex flex-col items-center text-slate-400">
            <ImageIcon size={32} />
            <span className="text-xs mt-2">Image Placeholder</span>
          </div>
        </div>
      );

    case ElementType.Divider:
        return <hr className="border-t border-slate-200 my-4 w-full" />;

    default:
      return <div className="text-red-500 text-xs">Unknown Component: {type}</div>;
  }
};