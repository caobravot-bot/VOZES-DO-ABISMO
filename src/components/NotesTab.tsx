import React, { useState } from 'react';
import { FileText, Plus, Search, Tag, Trash2, Calendar, BookOpen } from 'lucide-react';

interface NoteItem {
  id: string;
  title: string;
  category: 'PISTA' | 'TEORIA' | 'NPC' | 'LOCAL' | 'SESSÃO';
  content: string;
  date: string;
}

interface NotesTabProps {
  initialNotes?: string;
  onSaveNotes?: (notes: string) => void;
}

export const NotesTab: React.FC<NotesTabProps> = ({ initialNotes = '', onSaveNotes }) => {
  const [notes, setNotes] = useState<NoteItem[]>([
    {
      id: 'n1',
      title: 'Farol Norte & Sinal de Rádio',
      category: 'PISTA',
      content: 'A transmissão captada às 03:33 repete a mesma frequência de código Morse que ouvimos no navio naufragado.',
      date: '25/08/2026',
    },
    {
      id: 'n2',
      title: 'Dr. Valerius e o Protocolo Entona',
      category: 'TEORIA',
      content: 'A corrupção na Ilha parece desacelerar quando estamos próximos de fontes de Presença Branca pura.',
      date: '24/08/2026',
    },
  ]);

  const [filterCat, setFilterCat] = useState<string>('ALL');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'PISTA' | 'TEORIA' | 'NPC' | 'LOCAL' | 'SESSÃO'>('PISTA');
  const [newContent, setNewContent] = useState('');

  const catColors: Record<string, string> = {
    PISTA: 'text-amber-400 border-amber-800 bg-amber-950/40',
    TEORIA: 'text-blue-400 border-blue-800 bg-blue-950/40',
    NPC: 'text-purple-400 border-purple-800 bg-purple-950/40',
    LOCAL: 'text-emerald-400 border-emerald-800 bg-emerald-950/40',
    SESSÃO: 'text-rose-400 border-rose-800 bg-rose-950/40',
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const item: NoteItem = {
      id: `note-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      content: newContent,
      date: new Date().toLocaleDateString('pt-BR'),
    };
    setNotes([item, ...notes]);
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const filteredNotes = notes.filter((n) => {
    if (filterCat !== 'ALL' && n.category !== filterCat) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#222634] pb-3">
        <div>
          <h2 className="text-sm font-bold font-mono tracking-wider text-slate-200 uppercase flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>DIÁRIO DE INVESTIGAÇÃO & PISTAS DE CAMPO</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Caderno pessoal do agente para registro de deduções, depoimentos de NPCs e anomalias geográficas.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-mono font-bold shadow transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Anotar Pista</span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['ALL', 'PISTA', 'TEORIA', 'NPC', 'LOCAL', 'SESSÃO'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors ${
              filterCat === cat
                ? 'bg-emerald-950 text-emerald-200 border border-emerald-700 font-bold'
                : 'bg-[#14161d] text-slate-400 hover:text-slate-200 border border-[#222634]'
            }`}
          >
            {cat === 'ALL' ? 'Todas as Anotações' : cat}
          </button>
        ))}
      </div>

      {/* Creation form */}
      {isCreating && (
        <div className="p-4 bg-[#14161d] border border-emerald-900/60 rounded-xl space-y-3 animate-in fade-in">
          <div className="text-xs font-mono font-bold text-emerald-400 uppercase">
            Registrar Nova Entrada no Diário
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-mono text-slate-400 block">Título do Registro</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Mensagem nas paredes do laboratório subterrâneo"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Categoria</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              >
                <option value="PISTA">Pista de Investigação</option>
                <option value="TEORIA">Teoria / Hipótese</option>
                <option value="NPC">NPC / Suspeito</option>
                <option value="LOCAL">Local / Ponto de Interesse</option>
                <option value="SESSÃO">Resumo de Sessão</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block">Conteúdo / Detalhes</label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
              placeholder="Descreva a pista encontrada, contradições no depoimento..."
              className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 text-slate-400 hover:text-slate-200 text-xs font-mono"
            >
              Cancelar
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded"
            >
              Salvar Entrada
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs">
            Nenhuma anotação registrada nesta categoria.
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-[#14161d] border border-[#222634] hover:border-slate-600 rounded-xl space-y-2.5 transition-colors shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">
                      {note.title}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${catColors[note.category]}`}>
                      {note.category}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{note.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-1 text-slate-600 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
