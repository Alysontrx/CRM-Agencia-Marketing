import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ModalNovoUsuario } from '../components/Modals';
import { Edit2, Trash2, Plus } from 'lucide-react';
import type { User } from '../data/types';

export default function EquipePage() {
  const { currentUser, users, tarefas, deleteUser } = useApp();
  const teamUsers = users.filter(u => u.funcao !== 'Cliente');
  
  const [modalUsuario, setModalUsuario] = useState(false);
  const [editUsuario, setEditUsuario] = useState<User | undefined>(undefined);

  const isAdmin = currentUser?.funcao === 'Admin';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-800/30 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-zinc-400" />
            Performance da Equipe (Sense)
          </CardTitle>
          {isAdmin && (
            <Button onClick={() => { setEditUsuario(undefined); setModalUsuario(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all h-8 px-3 text-xs">
              <Plus className="w-4 h-4 mr-1" /> Novo Funcionário
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamUsers.map(member => {
              const userTasks = tarefas.filter(t => t.responsavel_id === member.id);
              const pendentes = userTasks.filter(t => t.status !== 'Aprovado' && t.status !== 'Fechado');
              const concluidas = userTasks.filter(t => t.status === 'Aprovado' || t.status === 'Fechado');
              const atrasadas = pendentes.filter(t => t.status === 'Atrasado');

              return (
                <Card key={member.id} className="bg-zinc-950/50 border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4 mb-5">
                      <Avatar className="h-12 w-12 border-2 border-zinc-800 shadow-xl">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-zinc-800 text-zinc-300 font-bold">{member.nome[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-100">{member.nome}</h3>
                        <p className="text-xs text-zinc-500 font-medium">{member.funcao}</p>
                      </div>
                      
                      {isAdmin && (
                        <div className="ml-auto flex gap-1">
                          <button onClick={() => { setEditUsuario(member); setModalUsuario(true); }} className="p-1.5 bg-zinc-800 text-zinc-400 hover:text-white rounded-md transition-colors shadow-lg">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => { if(confirm('Excluir funcionário?')) deleteUser(member.id); }} className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-colors shadow-lg">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Tarefas Pendentes</span>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold">{pendentes.length}</Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Tarefas Concluídas</span>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold">{concluidas.length}</Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-3 border-t border-zinc-800/50">
                        <span className="text-zinc-500 font-medium">Atrasos Atuais</span>
                        <span className={`font-bold ${atrasadas.length > 0 ? 'text-rose-500' : 'text-zinc-600'}`}>{atrasadas.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
      <ModalNovoUsuario isOpen={modalUsuario} onClose={() => { setModalUsuario(false); setEditUsuario(undefined); }} editData={editUsuario} />
    </motion.div>
  );
}
