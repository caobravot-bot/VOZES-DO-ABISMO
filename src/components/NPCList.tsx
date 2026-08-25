import React, { useState } from 'react';
import { NPC, NPCStatus, DangerLevel, Attitude } from '../types';
import { Users, Plus, Search, ShieldAlert, Heart, Skull, AlertTriangle, Eye, EyeOff, Trash2 } from 'lucide-react';

interface NPCListProps {
  npcs: NPC[];
  onUpdateNpc: (npc: NPC) => void;
  onDeleteNpc: (npcId: string) => void;
  onCreateNpc: (npc: Partial<NPC>) => void;
  isMaster?: boolean;
}

export const NPCList: React.FC<NPCListProps> = ({
  npcs,
  onUpdateNpc,
  onDeleteNpc,
  onCreateNpc,
  isMaster = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isCreating, setIsCreating] = useState(false);

  // New NPC form
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<NPCStatus>('VIVO');
  const [dangerLevel, setDangerLevel] = useState<DangerLevel>('INOFENSIVO');
  const [attitude, setAttitude] = useState<Attitude>('NEUTRO');
  const [publicDescription, setPublicDescription] = useState('');
  const [masterNotes, setMasterNotes] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const statusColors: Record<NPCStatus, string> = {
    VIVO: 'text-emerald-400 border-emerald-800 bg-emerald-950/40',
    DESAPARECIDO: 'text-amber-400 border-amber-800 bg-amber-950/40',
    MORTO: 'text-slate-500 border-slate-700 bg-slate-900',
    TRANSFORMADO: 'text-purple-400 border-purple-800 bg-purple-950/40',
    INCONSCIENTE: 'text-blue-400 border-blue-800 bg-blue-950/40',
  };

  const dangerColors: Record<DangerLevel, string> = {
    INOFENSIVO: 'text-slate-400',
    BAIXO: 'text-blue-400',
    MÉDIO: 'text-amber-400',
    ALTO: 'text-orange-400 font-bold',
    EXTREMO: 'text-rose-500 font-extrabold animate-pulse',
  };

  const attitudeColors: Record<Attitude, string> = {
    ALIADO: 'text-emerald-400',
    AMIGÁVEL: 'text-teal-400',
    NEUTRO: 'text-slate-400',
    HOSTIL: 'text-rose-400',
    DESCONHECIDO: 'text-purple-400',
  };

  const npcsList = npcs || [];
  const filteredNPCs = npcsList.filter((n) => {
    const matchesSearch = (n.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.occupation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || n.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreateNpc({
      name: name.trim(),
      occupation,
      location,
      status,
      dangerLevel,
      attitude,
      publicDescription,
      masterNotes: isMaster ? masterNotes : undefined,
      knownSecrets: [],
      avatarUrl: avatarUrl || undefined,
    });
    setName('');
    setOccupation('');
    setLocation('');
    setPublicDescription('');
    setMasterNotes('');
    setAvatarUrl('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#222634] pb-3">
        <div>
          <h2 className="text-sm font-bold font-mono tracking-wider text-slate-200 uppercase flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>ARQUIVO DE NPCS & TESTEMUNHAS ({filteredNPCs.length})</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Registros de habitantes da ilha, cientistas, sobreviventes e autoridades.
          </p>
        </div>

        {isMaster && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-xs font-mono font-bold shadow transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo NPC</span>
          </button>
        )}
      </div>

      {/* Controls & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, ocupação ou local..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] focus:border-cyan-500 rounded text-xs font-mono text-slate-200 outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {['ALL', 'VIVO', 'DESAPARECIDO', 'TRANSFORMADO', 'MORTO'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-cyan-950 text-cyan-200 border border-cyan-700 font-bold'
                  : 'bg-[#14161d] text-slate-400 hover:text-slate-200 border border-[#222634]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <div className="p-4 bg-[#14161d] border border-cyan-900/60 rounded-xl space-y-3 animate-in fade-in">
          <div className="text-xs font-mono font-bold text-cyan-400 uppercase">
            Cadastrar Novo NPC no Dossiê da Campanha
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Nome do NPC</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Dra. Helena Rios"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Ocupação / Função</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="Ex: Bióloga Chefe"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Localização Frequente</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Estação Meteorológica"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Status Vital</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as NPCStatus)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              >
                <option value="VIVO">VIVO</option>
                <option value="DESAPARECIDO">DESAPARECIDO</option>
                <option value="TRANSFORMADO">TRANSFORMADO</option>
                <option value="INCONSCIENTE">INCONSCIENTE</option>
                <option value="MORTO">MORTO</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Nível de Perigo</label>
              <select
                value={dangerLevel}
                onChange={(e) => setDangerLevel(e.target.value as DangerLevel)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              >
                <option value="INOFENSIVO">INOFENSIVO</option>
                <option value="BAIXO">BAIXO</option>
                <option value="MÉDIO">MÉDIO</option>
                <option value="ALTO">ALTO</option>
                <option value="EXTREMO">EXTREMO</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Atitude com os Players</label>
              <select
                value={attitude}
                onChange={(e) => setAttitude(e.target.value as Attitude)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              >
                <option value="ALIADO">ALIADO</option>
                <option value="AMIGÁVEL">AMIGÁVEL</option>
                <option value="NEUTRO">NEUTRO</option>
                <option value="HOSTIL">HOSTIL</option>
                <option value="DESCONHECIDO">DESCONHECIDO</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block">Descrição Pública (Visível para Players)</label>
            <textarea
              value={publicDescription}
              onChange={(e) => setPublicDescription(e.target.value)}
              rows={2}
              placeholder="O que os investigadores sabem visualmente e através de conversas..."
              className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-rose-400 block font-bold">
              Segredos & Notas do Mestre (Restrito)
            </label>
            <textarea
              value={masterNotes}
              onChange={(e) => setMasterNotes(e.target.value)}
              rows={2}
              placeholder="Motivações ocultas, se é um traidor, se foi corrompido pela Ilha..."
              className="w-full px-2.5 py-1.5 bg-rose-950/20 border border-rose-900/60 rounded text-xs font-mono text-rose-200"
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
              onClick={handleCreate}
              className="px-4 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white font-mono text-xs font-bold rounded"
            >
              Salvar NPC
            </button>
          </div>
        </div>
      )}

      {/* NPCs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNPCs.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs">
            Nenhum NPC registrado com os filtros selecionados.
          </div>
        ) : (
          filteredNPCs.map((npc) => (
            <div
              key={npc.id}
              className="p-4 bg-[#14161d] border border-[#222634] hover:border-cyan-800/60 rounded-xl space-y-3 transition-colors shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-900 border border-[#2a2e3d] flex items-center justify-center font-mono font-bold text-slate-400 shrink-0 overflow-hidden">
                    {npc.avatarUrl ? (
                      <img src={npc.avatarUrl} alt={npc.name} className="w-full h-full object-cover" />
                    ) : (
                      npc.name.substring(0, 2)
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase font-mono">
                      {npc.name}
                    </h3>
                    <div className="text-xs font-mono text-slate-400">
                      {npc.occupation} • {npc.location}
                    </div>
                  </div>
                </div>

                <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${statusColors[npc.status]}`}>
                  {npc.status}
                </span>
              </div>

              {/* Matrix */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#0d0e12] p-2 rounded border border-[#222634]">
                <div>
                  <span className="text-slate-500 block text-[10px]">PERIGO</span>
                  <span className={dangerColors[npc.dangerLevel]}>{npc.dangerLevel}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ATITUDE</span>
                  <span className={attitudeColors[npc.attitude]}>{npc.attitude}</span>
                </div>
              </div>

              {/* Public Description */}
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {npc.publicDescription}
              </p>

              {/* Master Secrets */}
              {isMaster && npc.masterNotes && (
                <div className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded text-xs font-mono text-rose-200/90">
                  <strong className="text-rose-400 block text-[10px] uppercase">NOTAS RESTRITAS DO MESTRE:</strong>
                  {npc.masterNotes}
                </div>
              )}

              {/* Master Action Bar */}
              {isMaster && (
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <select
                    value={npc.status}
                    onChange={(e) => onUpdateNpc({ ...npc, status: e.target.value as NPCStatus })}
                    className="bg-[#0d0e12] border border-[#2a2e3d] text-[10px] font-mono text-slate-300 rounded px-1.5 py-1"
                  >
                    <option value="VIVO">VIVO</option>
                    <option value="DESAPARECIDO">DESAPARECIDO</option>
                    <option value="TRANSFORMADO">TRANSFORMADO</option>
                    <option value="INCONSCIENTE">INCONSCIENTE</option>
                    <option value="MORTO">MORTO</option>
                  </select>

                  <button
                    onClick={() => onDeleteNpc(npc.id)}
                    className="p-1 text-slate-600 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
};
