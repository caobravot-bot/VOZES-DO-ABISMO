import React, { useState } from 'react';
import { Ritual } from '../types';
import { Sparkles, Plus, Flame, Star, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface RitualsTabProps {
  rituals: Ritual[];
  currentPr: number;
  onCastRitual: (ritual: Ritual) => void;
  onUpdateRitual: (ritual: Ritual) => void;
  onDeleteRitual: (ritualId: string) => void;
  onCreateRitual: (ritual: Partial<Ritual>) => void;
  isMaster?: boolean;
}

export const RitualsTab: React.FC<RitualsTabProps> = ({
  rituals,
  currentPr,
  onCastRitual,
  onUpdateRitual,
  onDeleteRitual,
  onCreateRitual,
  isMaster = false,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [troca, setTroca] = useState('40%');
  const [execution, setExecution] = useState('Ação Padrão');
  const [range, setRange] = useState('Médio (15m)');
  const [duration, setDuration] = useState('Instantânea');
  const [prCost, setPrCost] = useState(25);
  const [damageFormula, setDamageFormula] = useState('4d12');
  const [damageType, setDamageType] = useState('Paranormal / Fogo');
  const [effect, setEffect] = useState('');
  const [prerequisites, setPrerequisites] = useState('Presença Grau I');

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreateRitual({
      name: name.trim().toUpperCase(),
      description,
      troca,
      execution,
      range,
      duration,
      prCost,
      damageFormula,
      damageType,
      effect,
      prerequisites,
      favorite: true,
    });
    setName('');
    setDescription('');
    setEffect('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#222634] pb-3">
        <div>
          <h2 className="text-sm font-bold font-mono tracking-wider text-slate-200 uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>GRIMÓRIO DE RITUAIS & PACTOS DA ILHA</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Rituais de troca paranormal que consomem Pontos de Presença (PR) para manifestar efeitos sobrenaturais.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded text-xs font-mono font-bold shadow transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Ritual</span>
        </button>
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <div className="p-4 bg-[#14161d] border border-purple-900/60 rounded-xl space-y-3 animate-in fade-in">
          <div className="text-xs font-mono font-bold text-purple-400 uppercase">
            Transcrever Novo Ritual Paranormal
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Nome do Ritual</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: INCINERAÇÃO DA SOMBRA"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Troca Paranormal (%)</label>
              <input
                type="text"
                value={troca}
                onChange={(e) => setTroca(e.target.value)}
                placeholder="Ex: 40%"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Gasto de PR</label>
              <input
                type="number"
                value={prCost}
                onChange={(e) => setPrCost(Number(e.target.value) || 0)}
                placeholder="Ex: 25"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Execução</label>
              <input
                type="text"
                value={execution}
                onChange={(e) => setExecution(e.target.value)}
                placeholder="Ex: Ação Padrão"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Alcance</label>
              <input
                type="text"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="Ex: Médio (15m)"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Dano / Fórmula</label>
              <input
                type="text"
                value={damageFormula}
                onChange={(e) => setDamageFormula(e.target.value)}
                placeholder="Ex: 4d12"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Tipo de Dano</label>
              <input
                type="text"
                value={damageType}
                onChange={(e) => setDamageType(e.target.value)}
                placeholder="Ex: Luz, Psíquico"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block">Efeito & Consequências</label>
            <input
              type="text"
              value={effect}
              onChange={(e) => setEffect(e.target.value)}
              placeholder="Ex: Alvos falham em Reflexos ficam cegos por 1 rodada..."
              className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block">Descrição do Ritual</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Manifestação visual, palavras de evocação e canalização da Presença..."
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
              className="px-4 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-mono text-xs font-bold rounded"
            >
              Salvar Ritual
            </button>
          </div>
        </div>
      )}

      {/* Ritual Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rituals.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs">
            Nenhum ritual transcrito no momento. Clique em "Novo Ritual" para registrar um pacto.
          </div>
        ) : (
          rituals.map((rit) => {
            const canCast = currentPr >= rit.prCost;

            return (
              <div
                key={rit.id}
                className="p-4 bg-[#14161d] border border-purple-950/80 hover:border-purple-800 rounded-xl space-y-3 transition-colors shadow-lg relative overflow-hidden"
              >
                {/* Visual Ambient Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl pointer-events-none" />

                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-white uppercase font-mono tracking-tight flex items-center gap-2">
                      <span>{rit.name}</span>
                    </h3>
                    <div className="text-[11px] font-mono text-purple-400 mt-0.5">
                      Troca: <strong className="text-purple-300">{rit.troca}</strong> • {rit.execution} • Alcance: {rit.range}
                    </div>
                  </div>

                  <button
                    onClick={() => onUpdateRitual({ ...rit, favorite: !rit.favorite })}
                    className={`p-1 rounded transition-colors ${
                      rit.favorite ? 'text-purple-400' : 'text-slate-600 hover:text-slate-400'
                    }`}
                    title={rit.favorite ? 'Desfavoritar' : 'Favoritar no modo combate'}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                {/* Ritual Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#0d0e12] p-2.5 rounded-lg border border-[#222634]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">GASTO DE PR</span>
                    <strong className="text-blue-400 text-sm">{rit.prCost} PR</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">DANO / MANIFESTAÇÃO</span>
                    <strong className="text-purple-300 text-sm">{rit.damageFormula || 'Efeito Puro'}</strong>{' '}
                    {rit.damageType && <span className="text-[10px] text-slate-400">({rit.damageType})</span>}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {rit.description}
                </p>

                {/* Effect */}
                {rit.effect && (
                  <div className="text-[11px] font-mono text-purple-200 bg-purple-950/30 border border-purple-900/50 p-2 rounded">
                    <strong>Efeito:</strong> {rit.effect}
                  </div>
                )}

                {/* Cast Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="text-[10px] font-mono text-slate-500">
                    {rit.prerequisites && <span>Requisito: {rit.prerequisites}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onCastRitual(rit)}
                      disabled={!canCast}
                      className="px-4 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-30 text-white font-mono font-bold text-xs rounded-lg shadow flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>CONJURAR (-{rit.prCost} PR)</span>
                    </button>

                    <button
                      onClick={() => onDeleteRitual(rit.id)}
                      title="Excluir ritual"
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
