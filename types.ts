export enum ElementType {
  Container = 'container',
  Button = 'button',
  Input = 'input',
  Text = 'text',
  Image = 'image',
  Card = 'card',
  Header = 'header',
  Divider = 'divider',
  Icon = 'icon'
}

export interface UIStyle {
  color?: string;
  backgroundColor?: string;
  width?: string;
  padding?: string;
  borderRadius?: string;
  flexDirection?: 'row' | 'col';
  justifyContent?: 'start' | 'center' | 'end' | 'between';
  alignItems?: 'start' | 'center' | 'end';
}

export interface UIComponentNode {
  id: string;
  type: ElementType;
  label?: string; // For buttons, headers, text
  placeholder?: string; // For inputs
  style?: UIStyle;
  children?: UIComponentNode[];
}

export interface WireframeData {
  title: string;
  description: string;
  rootElements: UIComponentNode[];
}

export enum ViewMode {
  PM = 'PM',       // Prompt & Concept
  DESIGN = 'DESIGN', // Visual Wireframe
  DEV = 'DEV'      // Code View
}