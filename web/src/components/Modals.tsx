import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { TarefaData, ClienteData, MetricaData, LeadData } from '../data/types';

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex-none flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-800/60 bg-zinc-900/20">
          <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
          <button className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-1.5 rounded-md transition-colors" onClick={onClose}>✕</button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ModalNovaTarefa({ isOpen, onClose, editData }: { isOpen: boolean; onClose: () => void, editData?: TarefaData }) {
  const { clientes, users, addTarefa, updateTarefa } = useApp();
  const [form, setForm] = useState({ titulo: '', cliente_id: '', responsavel_id: '', prioridade: 'Média', prazo: '', setor: 'Geral' });
  const [checklists, setChecklists] = useState<Array<{ id: string; text: string; completed: boolean }>>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  React.useEffect(() => {
    if (editData) {
      setForm({
        titulo: editData.titulo,
        cliente_id: editData.cliente_id.toString(),
        responsavel_id: editData.responsavel_id.toString(),
        prioridade: editData.prioridade,
        prazo: editData.prazo || '',
        setor: editData.setor
      });
      setChecklists(editData.checklists || []);
    } else {
      setForm({ titulo: '', cliente_id: '', responsavel_id: '', prioridade: 'Média', prazo: '', setor: 'Geral' });
      setChecklists([]);
    }
  }, [editData, isOpen]);

  const handleAddChecklist = () => {
    if (!newChecklistText.trim()) return;
    setChecklists([...checklists, { id: Date.now().toString(), text: newChecklistText, completed: false }]);
    setNewChecklistText('');
  };

  const handleToggleChecklist = (id: string) => {
    const updated = checklists.map(c => c.id === id ? { ...c, completed: !c.completed } : c);
    setChecklists(updated);
    
    // Auto-limpeza (Magica)
    const allDone = updated.length > 0 && updated.every(c => c.completed);
    if (allDone && editData && editData.status !== 'Feito') {
      updateTarefa(editData.id, { checklists: updated, status: 'Feito' });
      onClose(); // Fechar já que concluiu
    } else if (editData) {
      // Salva apenas os checklists sem mudar o status
      updateTarefa(editData.id, { checklists: updated });
    }
  };

  const handleDeleteChecklist = (id: string) => {
    setChecklists(checklists.filter(c => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cliente_id || !form.responsavel_id) return;
    
    if (editData) {
      updateTarefa(editData.id, {
        titulo: form.titulo,
        cliente_id: parseInt(form.cliente_id),
        responsavel_id: parseInt(form.responsavel_id),
        prioridade: form.prioridade,
        prazo: form.prazo || undefined,
        setor: form.setor,
        checklists
      });
    } else {
      addTarefa({
        titulo: form.titulo,
        cliente_id: parseInt(form.cliente_id),
        responsavel_id: parseInt(form.responsavel_id),
        prioridade: form.prioridade,
        prazo: form.prazo || undefined,
        setor: form.setor,
        status: 'A fazer',
        checklists
      });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? "Editar Tarefa" : "Nova Tarefa"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Título da Tarefa</label>
          <input className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" required value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} placeholder="Ex: Criar arte promocional" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Cliente</label>
          <select className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" required value={form.cliente_id} onChange={e => setForm({...form, cliente_id: e.target.value})}>
            <option value="">Selecione o cliente...</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Responsável</label>
          <select className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" required value={form.responsavel_id} onChange={e => setForm({...form, responsavel_id: e.target.value})}>
            <option value="">Atribuir a...</option>
            {users.filter(u => u.funcao !== 'Cliente').map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Prioridade</label>
            <select className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" value={form.prioridade} onChange={e => setForm({...form, prioridade: e.target.value})}>
              <option>Baixa</option><option>Média</option><option>Alta</option><option>Urgente</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Prazo</label>
            <input type="date" className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 [color-scheme:dark]" required value={form.prazo} onChange={e => setForm({...form, prazo: e.target.value})} />
          </div>
        </div>
        
        {/* Sessão de Checklists */}
        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <label className="text-sm font-medium text-zinc-300">Subtarefas (Checklist)</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" 
              placeholder="Ex: Aprovar roteiro..." 
              value={newChecklistText}
              onChange={e => setNewChecklistText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddChecklist(); } }}
            />
            <button type="button" onClick={handleAddChecklist} className="px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-semibold transition-colors">
              Adicionar
            </button>
          </div>
          <div className="space-y-2 mt-3 max-h-40 overflow-y-auto custom-scrollbar pr-1">
            {checklists.map(c => (
              <div key={c.id} className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800/80 p-2.5 rounded-lg group">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={c.completed} 
                    onChange={() => handleToggleChecklist(c.id)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500/50 cursor-pointer" 
                  />
                  <span className={`text-sm ${c.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                    {c.text}
                  </span>
                </div>
                <button type="button" onClick={() => handleDeleteChecklist(c.id)} className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  &times;
                </button>
              </div>
            ))}
            {checklists.length === 0 && (
              <div className="text-xs text-zinc-500 text-center py-2">Nenhuma subtarefa adicionada.</div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
          <button type="button" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" onClick={onClose}>Cancelar</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all">Criar Tarefa</button>
        </div>
      </form>
    </Modal>
  );
}

export function ModalNovoCliente({ isOpen, onClose, editData }: { isOpen: boolean; onClose: () => void, editData?: ClienteData }) {
  const { users, addCliente, updateCliente } = useApp();
  const [form, setForm] = useState({ nome: '', servico: '', responsavel_id: '', logo: '', mrr: '', dia_pagamento: '', whatsapp: '', instagram_url: '', entregas_mensais: '' });

  React.useEffect(() => {
    if (editData) {
      setForm({
        nome: editData.nome,
        servico: editData.servico,
        responsavel_id: editData.responsavel_id.toString(),
        logo: editData.logo || '',
        mrr: editData.mrr ? editData.mrr.toString() : '',
        dia_pagamento: editData.dia_pagamento ? editData.dia_pagamento.toString() : '',
        whatsapp: editData.whatsapp || '',
        instagram_url: editData.instagram_url || '',
        entregas_mensais: editData.entregas_mensais ? editData.entregas_mensais.toString() : ''
      });
    } else {
      setForm({ nome: '', servico: '', responsavel_id: '', logo: '', mrr: '', dia_pagamento: '', whatsapp: '', instagram_url: '', entregas_mensais: '' });
    }
  }, [editData, isOpen]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.responsavel_id) return;
    
    if (editData) {
      updateCliente(editData.id, {
        nome: form.nome,
        servico: form.servico,
        responsavel_id: parseInt(form.responsavel_id),
        mrr: parseFloat(form.mrr) || 0,
        dia_pagamento: form.dia_pagamento ? parseInt(form.dia_pagamento) : undefined,
        whatsapp: form.whatsapp || undefined,
        logo: form.logo || undefined,
        instagram_url: form.instagram_url || undefined,
        entregas_mensais: form.entregas_mensais ? parseInt(form.entregas_mensais) : 0
      });
    } else {
      addCliente({
        nome: form.nome,
        servico: form.servico,
        responsavel_id: parseInt(form.responsavel_id),
        logo: form.logo || undefined,
        mrr: form.mrr ? parseFloat(form.mrr) : 0,
        dia_pagamento: form.dia_pagamento ? parseInt(form.dia_pagamento) : undefined,
        whatsapp: form.whatsapp || undefined,
        instagram_url: form.instagram_url || undefined,
        entregas_mensais: form.entregas_mensais ? parseInt(form.entregas_mensais) : 0
      });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? "Editar Cliente" : "Novo Cliente"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Nome da Empresa</label>
            <input className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">WhatsApp (Cobrança)</label>
            <input className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} placeholder="Ex: 11999999999" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Serviço Contratado</label>
            <input className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" required value={form.servico} onChange={e => setForm({...form, servico: e.target.value})} placeholder="Ex: Gestão Redes Sociais" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Link do Instagram</label>
            <input className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" value={form.instagram_url} onChange={e => setForm({...form, instagram_url: e.target.value})} placeholder="https://instagram.com/perfil" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">MRR (R$)</label>
              <input type="number" step="0.01" className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={form.mrr} onChange={e => setForm({...form, mrr: e.target.value})} placeholder="0.00" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Vencimento (Dia)</label>
              <input type="number" min="1" max="31" className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={form.dia_pagamento} onChange={e => setForm({...form, dia_pagamento: e.target.value})} placeholder="Ex: 5" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Entregas Mensais</label>
              <input type="number" min="0" className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={form.entregas_mensais} onChange={e => setForm({...form, entregas_mensais: e.target.value})} placeholder="Ex: 12" />
            </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Logo da Empresa (Foto)</label>
          <input type="file" accept="image/*" className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700" onChange={handleLogoUpload} />
          {form.logo && (
            <div className="mt-2">
              <img src={form.logo} className="w-12 h-12 rounded-lg object-cover border border-zinc-700 shadow-sm" alt="Preview" />
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Gestor de Conta (Responsável)</label>
          <select className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" required value={form.responsavel_id} onChange={e => setForm({...form, responsavel_id: e.target.value})}>
            <option value="">Selecione o gestor...</option>
            {users.filter(u => u.funcao !== 'Cliente').map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
          </select>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
          <button type="button" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" onClick={onClose}>Cancelar</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all">Salvar Cliente</button>
        </div>
      </form>
    </Modal>
  );
}

export function ModalNovaMetrica({ isOpen, onClose, editData }: { isOpen: boolean; onClose: () => void, editData?: MetricaData }) {
  const { clientes, addMetrica, updateMetrica } = useApp();
  const [form, setForm] = useState({ cliente_id: '', tipo: 'mensal', seguidores: '', alcance: '', engajamento: '', leads: '', cliques_site: '', data: new Date().toISOString().split('T')[0] });

  React.useEffect(() => {
    if (editData) {
      setForm({
        cliente_id: editData.cliente_id.toString(),
        tipo: editData.tipo,
        seguidores: editData.seguidores.toString(),
        alcance: editData.alcance.toString(),
        engajamento: editData.engajamento.toString(),
        leads: editData.leads.toString(),
        cliques_site: (editData.cliques_site || 0).toString(),
        data: editData.data_registro.split('T')[0]
      });
    } else {
      setForm({ cliente_id: '', tipo: 'mensal', seguidores: '', alcance: '', engajamento: '', leads: '', cliques_site: '', data: new Date().toISOString().split('T')[0] });
    }
  }, [editData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cliente_id) return;
    
    if (editData) {
      updateMetrica(editData.id, {
        cliente_id: parseInt(form.cliente_id),
        data_registro: form.data,
        tipo: form.tipo,
        seguidores: parseInt(form.seguidores) || 0,
        alcance: parseInt(form.alcance) || 0,
        engajamento: parseFloat(form.engajamento) || 0,
        leads: parseInt(form.leads) || 0,
        cliques_site: parseInt(form.cliques_site) || 0,
      });
    } else {
      addMetrica({
        cliente_id: parseInt(form.cliente_id),
        data_registro: form.data,
        tipo: form.tipo as any,
        seguidores: parseInt(form.seguidores) || 0,
        alcance: parseInt(form.alcance) || 0,
        engajamento: parseFloat(form.engajamento) || 0,
        leads: parseInt(form.leads) || 0,
        cliques_site: parseInt(form.cliques_site) || 0,
      });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? "Editar Métrica" : "Registrar Métrica (Antes x Depois)"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Cliente</label>
            <select className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" required value={form.cliente_id} onChange={e => setForm({...form, cliente_id: e.target.value})}>
              <option value="">Selecione...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Tipo de Registro</label>
            <select className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" required value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
              <option value="baseline">Baseline (Início do Projeto)</option>
              <option value="mensal">Evolução Mensal</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Seguidores</label>
            <input type="number" className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" required value={form.seguidores} onChange={e => setForm({...form, seguidores: e.target.value})} placeholder="Ex: 1500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Alcance Mensal (Opcional)</label>
            <input type="number" className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" value={form.alcance} onChange={e => setForm({...form, alcance: e.target.value})} placeholder="Ex: 5000" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Taxa de Engajamento (%) (Opcional)</label>
            <input type="number" step="0.1" className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" value={form.engajamento} onChange={e => setForm({...form, engajamento: e.target.value})} placeholder="Ex: 2.5" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Leads Gerados (Opcional)</label>
            <input type="number" className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" value={form.leads} onChange={e => setForm({...form, leads: e.target.value})} placeholder="Ex: 45" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Cliques no Site (Opcional)</label>
            <input type="number" className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" value={form.cliques_site} onChange={e => setForm({...form, cliques_site: e.target.value})} placeholder="Ex: 850 (Deixe 0 se 1º mês)" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
          <button type="button" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" onClick={onClose}>Cancelar</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all">Registrar Métrica</button>
        </div>
      </form>
    </Modal>
  );
}

export function ModalNovoLead({ isOpen, onClose, editData }: { isOpen: boolean; onClose: () => void, editData?: LeadData }) {
  const { addLead, updateLead } = useApp();
  const [form, setForm] = useState({ empresa: '', contato: '', telefone: '', email: '', origem: 'Instagram', valor_estimado: '' });

  React.useEffect(() => {
    if (editData) {
      setForm({
        empresa: editData.empresa,
        contato: editData.contato,
        telefone: editData.telefone || '',
        email: editData.email || '',
        origem: editData.origem,
        valor_estimado: editData.valor_estimado.toString()
      });
    } else {
      setForm({ empresa: '', contato: '', telefone: '', email: '', origem: 'Instagram', valor_estimado: '' });
    }
  }, [editData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editData) {
      updateLead(editData.id, {
        empresa: form.empresa,
        contato: form.contato,
        telefone: form.telefone,
        email: form.email,
        origem: form.origem,
        valor_estimado: parseFloat(form.valor_estimado) || 0
      });
    } else {
      addLead({
        empresa: form.empresa,
        contato: form.contato,
        telefone: form.telefone,
        email: form.email,
        origem: form.origem,
        valor_estimado: parseFloat(form.valor_estimado) || 0,
        status: 'Prospect'
      });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? "Editar Lead" : "Novo Lead (Negociação)"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Nome da Empresa</label>
          <input className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" required value={form.empresa} onChange={e => setForm({...form, empresa: e.target.value})} placeholder="Ex: Clínica Sorriso" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Nome do Contato</label>
            <input className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" required value={form.contato} onChange={e => setForm({...form, contato: e.target.value})} placeholder="Ex: Dr. Silva" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Telefone / WhatsApp</label>
            <input className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} placeholder="(11) 99999-9999" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">E-mail</label>
          <input type="email" className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="contato@empresa.com" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Valor Estimado (MRR/Fee)</label>
            <input type="number" step="0.01" className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" required value={form.valor_estimado} onChange={e => setForm({...form, valor_estimado: e.target.value})} placeholder="1500.00" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Origem do Lead</label>
            <div className="flex flex-wrap gap-2">
              {['Instagram', 'Indicação', 'WhatsApp', 'Site', 'Outros'].map(origem => (
                <div 
                  key={origem} 
                  className={`cursor-pointer px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${form.origem === origem ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:border-zinc-600 hover:text-zinc-200'}`}
                  onClick={() => setForm({...form, origem})}
                >
                  {origem}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
          <button type="button" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" onClick={onClose}>Cancelar</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all">Adicionar Lead</button>
        </div>
      </form>
    </Modal>
  );
}

export function ModalNovoUsuario({ isOpen, onClose, editData }: { isOpen: boolean; onClose: () => void, editData?: any }) {
  const { addUser, updateUser } = useApp();
  const [form, setForm] = useState({ nome: '', email: '', funcao: 'Designer', avatar: '' });

  React.useEffect(() => {
    if (editData) {
      setForm({
        nome: editData.nome || '',
        email: editData.email || '',
        funcao: editData.funcao || 'Designer',
        avatar: editData.avatar || editData.avatar_url || ''
      });
    } else {
      setForm({ nome: '', email: '', funcao: 'Designer', avatar: '' });
    }
  }, [editData, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editData) {
      updateUser(editData.id, form as any);
    } else {
      addUser(form as any);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? "Editar Funcionário" : "Novo Funcionário"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Nome</label>
          <input type="text" className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Nome completo" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">E-mail</label>
          <input type="email" className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="exemplo@sense.com" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Função / Cargo</label>
          <select className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" value={form.funcao} onChange={e => setForm({...form, funcao: e.target.value})}>
            {['Admin', 'Designer', 'Social Media', 'Secretária', 'Videomaker'].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Foto do Perfil</label>
          <div className="flex items-center gap-4">
            {form.avatar ? (
              <img src={form.avatar} alt="Preview" className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 bg-zinc-800" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-zinc-500 text-xs">Sem foto</div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600 hover:file:text-white transition-all cursor-pointer outline-none" 
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
          <button type="button" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" onClick={onClose}>Cancelar</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all">{editData ? 'Salvar Alterações' : 'Adicionar Funcionário'}</button>
        </div>
      </form>
    </Modal>
  );
}
