import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';

interface WidgetContainerProps {
  id: string;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  noPadding?: boolean;
}

export function WidgetContainer({ id, title, children, icon, fullWidth = false, noPadding = false }: WidgetContainerProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`${fullWidth ? 'col-span-1 lg:col-span-3' : 'col-span-1'} w-full h-full relative group`}
    >
      <Card className={`bg-zinc-900 border-zinc-800 shadow-2xl rounded-3xl h-full flex flex-col overflow-hidden transition-all duration-300 ${isDragging ? 'shadow-emerald-500/20 border-emerald-500/30 ring-1 ring-emerald-500/50' : 'hover:border-zinc-700/50'}`}>
        
        {/* Header Drag Handle */}
        {title && (
          <CardHeader className="pb-3 pt-5 px-6 border-b border-zinc-800/30 flex flex-row items-center justify-between group/header">
            <CardTitle className="text-sm lg:text-base font-bold text-white flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>
            <div 
              {...attributes} 
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          </CardHeader>
        )}
        
        <CardContent className={`flex-1 ${noPadding ? 'p-0' : 'p-6'} ${!title ? 'pt-6' : ''}`}>
          {!title && (
            <div 
              {...attributes} 
              {...listeners}
              className="absolute top-4 right-4 z-10 cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
