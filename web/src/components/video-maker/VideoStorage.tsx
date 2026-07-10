import React, { useState } from 'react';
import { Folder, FileVideo, FileAudio, FileImage, Type, Download, Upload, Search, Clock, Star, MoreVertical } from 'lucide-react';

export default function VideoStorage() {
  const folders = [
    { id: 1, name: 'Vídeos Brutos', icon: FileVideo, count: 145, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 2, name: 'Áudios & SFX', icon: FileAudio, count: 89, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 3, name: 'Músicas', icon: FileAudio, count: 32, color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { id: 4, name: 'Logos & Assets', icon: FileImage, count: 56, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { id: 5, name: 'Tipografias', icon: Type, count: 12, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 6, name: 'Exportações', icon: Download, count: 24, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0f0f11] rounded-3xl border border-zinc-800/80 shadow-2xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
      
      {/* HEADER STORAGE */}
      <div className="p-6 border-b border-zinc-800/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 bg-zinc-950/50 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-black text-white">Central de Arquivos</h2>
          <p className="text-sm text-zinc-500">Organize seus assets e versões finais.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Pesquisar arquivos..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button className="flex-shrink-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-indigo-500/20">
            <Upload className="w-4 h-4" /> Upload
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative z-10 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR STORAGE */}
        <div className="w-full md:w-64 flex flex-col gap-1 pr-6 md:border-r border-zinc-800/50">
          <button className="flex items-center gap-3 px-4 py-2.5 bg-zinc-800/50 text-white rounded-xl font-semibold text-sm">
            <Folder className="w-4 h-4 text-indigo-400" /> Todos os Arquivos
          </button>
          <button className="flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:bg-zinc-800/30 hover:text-white rounded-xl font-medium text-sm transition-colors">
            <Clock className="w-4 h-4" /> Recentes
          </button>
          <button className="flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:bg-zinc-800/30 hover:text-white rounded-xl font-medium text-sm transition-colors">
            <Star className="w-4 h-4" /> Favoritos
          </button>
          <button className="flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:bg-zinc-800/30 hover:text-white rounded-xl font-medium text-sm transition-colors mt-auto">
            <Download className="w-4 h-4" /> Downloads Locais
          </button>
        </div>

        {/* MAIN STORAGE AREA */}
        <div className="flex-1">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Pastas do Sistema</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {folders.map(folder => {
              const Icon = folder.icon;
              return (
                <div key={folder.id} className="bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40 rounded-2xl p-4 cursor-pointer transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${folder.bg}`}>
                      <Icon className={`w-5 h-5 ${folder.color}`} />
                    </div>
                    <button className="text-zinc-600 hover:text-zinc-300">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-zinc-200 group-hover:text-white transition-colors">{folder.name}</h4>
                  <p className="text-xs text-zinc-500 font-medium">{folder.count} arquivos</p>
                </div>
              )
            })}
          </div>

          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Arquivos Recentes</h3>
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-semibold text-xs">
                <tr>
                  <th className="px-6 py-3 font-medium">Nome</th>
                  <th className="px-6 py-3 font-medium">Tamanho</th>
                  <th className="px-6 py-3 font-medium">Modificado</th>
                  <th className="px-6 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                <tr className="hover:bg-zinc-800/40 transition-colors cursor-pointer group">
                  <td className="px-6 py-3 flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-blue-500/10"><FileVideo className="w-4 h-4 text-blue-400" /></div>
                    <span className="font-medium text-zinc-200 group-hover:text-white">v3_final_render_cliente.mp4</span>
                  </td>
                  <td className="px-6 py-3 text-zinc-400">1.2 GB</td>
                  <td className="px-6 py-3 text-zinc-400">Hoje, 14:30</td>
                  <td className="px-6 py-3">
                    <button className="text-zinc-500 hover:text-indigo-400 font-medium text-xs">Baixar</button>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-800/40 transition-colors cursor-pointer group">
                  <td className="px-6 py-3 flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10"><FileAudio className="w-4 h-4 text-emerald-400" /></div>
                    <span className="font-medium text-zinc-200 group-hover:text-white">vo_locucao_v1.wav</span>
                  </td>
                  <td className="px-6 py-3 text-zinc-400">45 MB</td>
                  <td className="px-6 py-3 text-zinc-400">Ontem, 09:15</td>
                  <td className="px-6 py-3">
                    <button className="text-zinc-500 hover:text-indigo-400 font-medium text-xs">Baixar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
