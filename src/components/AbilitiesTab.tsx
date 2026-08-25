import React, { useState } from 'react';
import { Ability, AbilityCategory, AbilityStatus } from '../types';
import { Zap, Plus, Sparkles, Lock, EyeOff, Star, Trash2, CheckCircle2 } from 'lucide-react';

interface AbilitiesTabProps {
  abilities: Ability[];
  currentPr: number;
  onUseAbility: (ability: Ability) => void;
  onUpdateAbility: (ability: Ability) => void;
  onDeleteAbility: (abilityId: string) => void;
  onCreateAbility: (ability: Partial<Ability>) => void;
  isMaster?: boolean;
}

export const AbilitiesTab: React.FC<AbilitiesTabProps> = ({
  abilities,
  currentPr,
  onUseAbility,
  onUpdateAbility,
  onDeleteAbility,
  onCreateAbility,
  isMaster = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AbilityCategory>('Paranormal');
  const [description, setDescription] = useState('');
  const [execution, setExecution] = useState('Ação Padrão');
  const [range, setRange] = useState('Pessoal');
  const [duration, setDuration] = useState('Instantânea');
  const [prCost, setPrCost] = useState(6);
  const [status, setStatus] = useState<AbilityStatus>('DESBLOQUEADA');

  const categories = ['ALL', 'Racial', 'Classe', 'Combate', 'Paranormal', 'Individualidade', 'Marca', 'Item', 'Especial'];

  const filteredAbilities = abilities.filter((a) => {
    if (selectedCategory !== 'ALL' && a.category !== selectedCategory) return false;
    if (!isMaster && a.status === 'SECRETA') return false;
    return true;
  });

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreateAbility({
      name: name.trim(),
      category,
      description,
      execution,
      range,
      duration,
      prCost,
      status,
      favorite: false,
    });
    setName('');
    setDescription('');
    setIsCreating(false);
  };

  const statusBadges: Record<AbilityStatus, { label: string; style: string; icon: React.ReactNode }> = {
    PÚBLICA: { label: 'PÚBLICA', style: 'text-emerald-400 border-emerald-800 bg-emerald-950/40', icon: <CheckCircle2 className="w-3 h-3" /> },
    DESBLOQUEADA: { label: 'DESBLOQUEADA', style: 'text-emerald-400 border-emerald-800 bg-emerald-950/40', icon: <CheckCircle2 className="w-3 h-3" /> },
    BLOQUEADA: { label: 'BLOQUEADA', style: 'text-amber-400 border-amber-800 bg-amber-950/40', icon: <Lock className="w-3 h-3" /> },
    SECRETA: { label: 'SIGILOSA // MESTRE', style: 'text-rose-400 border-rose-800 bg-rose-950/40', icon: <EyeOff className="w-3 h-3" /> },
  };

  return (
    <div className="space-y-4">
      
      {/* Header & Categories */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#222634] pb-3">
        <div>
          <h2 className="text-sm font-bold font-mono tracking-wider text-slate-200 uppercase flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span>HABILIDADES & TALENTOS DO AGENTE</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Habilidades raciais, de combate, paranormais e concedidas por marcas ou itens.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-mono font-bold shadow transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nova Habilidade</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-950 text-blue-200 border border-blue-700 font-bold'
                : 'bg-[#14161d] text-slate-400 hover:text-slate-200 border border-[#222634]'
            }`}
          >
            {cat === 'ALL' ? 'Todas as Categorias' : cat}
          </button>
        ))}
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <div className="p-4 bg-[#14161d] border border-blue-900/60 rounded-xl space-y-3 animate-in fade-in">
          <div className="text-xs font-mono font-bold text-blue-400 uppercase">
            Cadastrar Nova Habilidade
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Nome da Habilidade</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Pulso Telecinético"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              >
                {categories.filter((c) => c !== 'ALL').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Custo de PR</label>
              <input
                type="number"
                value={prCost}
                onChange={(e) => setPrCost(Number(e.target.value) || 0)}
                placeholder="0 para passiva"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Execução</label>
              <input
                type="text"
                value={execution}
                onChange={(e) => setExecution(e.target.value)}
                placeholder="Ex: Ação Padrão, Reação"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Alcance & Duração</label>
              <input
                type="text"
                value={`${range} / ${duration}`}
                onChange={(e) => {
                  const parts = e.target.value.split('/');
                  setRange(parts[0] || 'Pessoal');
                  setDuration(parts[1] || 'Instantânea');
                }}
                placeholder="Ex: Curto (9m) / 1 Rodada"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Estado Inicial</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AbilityStatus)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              >
                <option value="DESBLOQUEADA">Desbloqueada (Ativa)</option>
                <option value="BLOQUEADA">Bloqueada (Visível)</option>
                {isMaster && <option value="SECRETA">Secreta (Apenas Mestre)</option>}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block">Descrição e Efeitos</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Descreva o funcionamento, regras e impactos narrativos..."
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
              onClick={handleCreate}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded"
            >
              Salvar Habilidade
            </button>
          </div>
        </div>
      )}

      {/* Abilities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredAbilities.length === 0 ? (
          <div className="col-span-full py-10 text-center text-slate-500 font-mono text-xs">
            Nenhuma habilidade encontrada nesta categoria.
          </div>
        ) : (
          filteredAbilities.map((ab) => {
            const isBlocked = ab.status === 'BLOQUEADA';
            const isSecret = ab.status === 'SECRETA';
            const badge = statusBadges[ab.status];
            const canAffordPr = currentPr >= ab.prCost;

            return (
              <div
                key={ab.id}
                className={`p-4 rounded-xl border space-y-3 transition-colors relative ${
                  isBlocked
                    ? 'bg-[#11131a] border-amber-950/60 opacity-75'
                    : isSecret
                    ? 'bg-rose-950/20 border-rose-900/60'
                    : 'bg-[#14161d] border-[#222634] hover:border-blue-800/60'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white uppercase font-mono">
                        {ab.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#0d0e12] border border-[#2a2e3d] text-slate-300">
                        {ab.category}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {ab.execution} • Alcance: {ab.range} • Duração: {ab.duration}
                    </div>
                  </div>

                  {/* Status Badge & Favorite Toggle */}
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1 ${badge.style}`}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>

                    <button
                      onClick={() => onUpdateAbility({ ...ab, favorite: !ab.favorite })}
                      className={`p-1 rounded text-xs transition-colors ${
                        ab.favorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                      }`}
                      title={ab.favorite ? 'Remover dos favoritos' : 'Favoritar para modo combate'}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {ab.description}
                </p>

                {/* Action footer */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="text-xs font-mono">
                    <span className="text-slate-500">Custo:</span>{' '}
                    <strong className="text-blue-400">
                      {ab.prCost > 0 ? `${ab.prCost} PR` : 'Sem Custo (Passiva)'}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Master status toggle */}
                    {isMaster && (
                      <select
                        value={ab.status}
                        onChange={(e) => onUpdateAbility({ ...ab, status: e.target.value as AbilityStatus })}
                        className="bg-[#0b0c10] border border-[#2a2e3d] text-[10px] font-mono text-slate-300 rounded px-1.5 py-1"
                      >
                        <option value="DESBLOQUEADA">Desbloquear</option>
                        <option value="BLOQUEADA">Bloquear</option>
                        <option value="SECRETA">Secreta</option>
                      </select>
                    )}

                    {ab.status === 'DESBLOQUEADA' && ab.prCost > 0 && (
                      <button
                        onClick={() => onUseAbility(ab)}
                        disabled={!canAffordPr}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-mono text-xs font-bold rounded-lg shadow flex items-center gap-1 transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>USAR ({ab.prCost} PR)</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteAbility(ab.id)}
                      title="Excluir habilidade"
                      className="p-1.5 text-slate-600 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
