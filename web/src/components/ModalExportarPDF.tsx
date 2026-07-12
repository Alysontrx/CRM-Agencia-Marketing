import React, { useState } from 'react';
import { Modal } from './Modals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Download } from 'lucide-react';
import { subDays, format } from 'date-fns';
import html2pdf from 'html2pdf.js';

interface ModalExportarPDFProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onExport: (startDate: string, endDate: string) => void;
}

export function ModalExportarPDF({ isOpen, onClose, title, onExport }: ModalExportarPDFProps) {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleExport = () => {
    onExport(startDate, endDate);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-sm text-zinc-400">Selecione o período para o qual deseja gerar o relatório.</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-medium">Data Inicial</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <Input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)}
                className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-200"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-medium">Data Final</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <Input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)}
                className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-200"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
          <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">Cancelar</Button>
          <Button onClick={handleExport} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Download className="w-4 h-4 mr-2" /> Gerar PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Utility function to generate the PDF from HTML content
export const generatePDFFromHTML = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  // Clone to avoid layout shift in the UI
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.display = 'block'; 
  
  // Create wrapper for dark mode report
  const wrapper = document.createElement('div');
  wrapper.appendChild(clone);
  wrapper.style.padding = '40px';
  wrapper.style.background = '#09090b'; 
  wrapper.style.color = '#e4e4e7';
  wrapper.style.width = '800px';
  
  const opt = {
    margin:       [10, 10, 10, 10],
    filename:     filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(wrapper).save();
};
