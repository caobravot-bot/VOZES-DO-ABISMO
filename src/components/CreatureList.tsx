import React, { useState } from 'react';
import { Creature, ThreatLevel } from '../types';
import { Skull, Plus, Shield, Heart, Zap, Crosshair, Flame, Eye, Trash2 } from 'lucide-react';

interface CreatureListProps {
  creatures: Creature[];
  onOpenRoll: (rollName: string, formula: string, rollType: 'ATAQUE' | 'DANO') => void;
  onUpdateCreature: (creature: Creature) => void;
  onDeleteCreature: (creatureId: string) => void;
  onCreateCreature: (creature: Partial<Creature>) => void;
  isMaster?: boolean;
}

export const CreatureList: React.FC<CreatureListProps> = ({
  creatures,
  onOpenRoll,
  onUpdateCreature,
  onDeleteCreature,
  onCreateCreature,
  isMaster = false,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [concept, setConcept] = useState('');
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('NÍVEL 3 (LETAL)');
  const [pv, setPv] = useState(120);
  const [defense, setDefense] = useState(22);
  const [presenceElement, setPresenceElement] = useState('Entona Vermelha');
  const [description, setDescription] = useState('');
  const [immunities, setImmunities] = useState('Dano Balístico, Efeitos Mentais');
  const [weaknesses, setWeaknesses] = useState('Luz Solar, Rituais Entona Branca');

  const threatColors: Record<ThreatLevel, string> = {
    'NÍVEL 1 (MENOR)': 'text-emerald-400 border-emerald-800 bg-emerald-950/40',
    'NÍVEL 2 (PERIGOSO)': 'text-blue-400 border-blue-800 bg-blue-950/40',
    'NÍVEL 3 (LETAL)': 'text-amber-400 border-amber-800 bg-amber-950/40',
    'NÍVEL 4 (APOCALÍPTICO)': 'text-orange-400 border-orange-800 bg-orange-950/40',
    'NÍVEL 5 (ENTIDADE DA ILHA)': 'text-rose-500 border-rose-800 bg-rose-950/60 font-extrabold animate-pulse',
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreateCreature({
      name: name.trim().toUpperCase(),
      concept,
      threatLevel,
      pv: { current: pv, max: pv, temp: 0 },
      defense,
      presenceElement,
      description,
      immunities: immunities.split(',').map((s) => s.trim()).filter(Boolean),
      weaknesses: weaknesses.split(',').map((s) => s.trim()).filter(Boolean),
      attacks: [
        {
          id: 'atk-1',
          name: 'Golpe Deformador',
          attackFormula: '1d20 + 14',
          damageFormula: '3d10 + 6',
          damageType: 'Impacto / Paranormal',
          critical: '19-20 / x2',
        },
      ],
      abilities: [],
    });
    setName('');
    setConcept('');
    setDescription('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#222634] pb-3">
        <div>
          <h2 className="text-sm font-bold font-mono tracking-wider text-slate-200 uppercase flex items-center gap-2">
            <Skull className="w-4 h-4 text-rose-500" />
            <span>BESTIÁRIO & ENTIDADES DA ILHA</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Catálogo de horrores biológicos, espectros da névoa e manifestações paranormais catalogadas.
          </p>
        </div>

        {isMaster && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded text-xs font-mono font-bold shadow transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Ameaça</span>
          </button>
        )}
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <div className="p-4 bg-[#14161d] border border-rose-900/60 rounded-xl space-y-3 animate-in fade-in">
          <div className="text-xs font-mono font-bold text-rose-400 uppercase">
            Catalogar Nova Criatura Sobrenatural
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Nome da Criatura</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: O TECE-CARNE"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100 uppercase"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Conceito / Origem</label>
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Ex: Aberração Biológica de Matéria"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Grau de Perigo</label>
              <select
                value={threatLevel}
                onChange={(e) => setThreatLevel(e.target.value as ThreatLevel)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              >
                <option value="NÍVEL 1 (MENOR)">NÍVEL 1 (MENOR)</option>
                <option value="NÍVEL 2 (PERIGOSO)">NÍVEL 2 (PERIGOSO)</option>
                <option value="NÍVEL 3 (LETAL)">NÍVEL 3 (LETAL)</option>
                <option value="NÍVEL 4 (APOCALÍPTICO)">NÍVEL 4 (APOCALÍPTICO)</option>
                <option value="NÍVEL 5 (ENTIDADE DA ILHA)">NÍVEL 5 (ENTIDADE DA ILHA)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Pontos de Vida (PV)</label>
              <input
                type="number"
                value={pv}
                onChange={(e) => setPv(Number(e.target.value) || 50)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Defesa</label>
              <input
                type="number"
                value={defense}
                onChange={(e) => setDefense(Number(e.target.value) || 15)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Presença / Elemento</label>
              <input
                type="text"
                value={presenceElement}
                onChange={(e) => setPresenceElement(e.target.value)}
                placeholder="Ex: Entona Carmesim"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Imunidades & Resistências</label>
              <input
                type="text"
                value={immunities}
                onChange={(e) => setImmunities(e.target.value)}
                placeholder="Ex: Balístico, Corte"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Fraquezas</label>
              <input
                type="text"
                value={weaknesses}
                onChange={(e) => setWeaknesses(e.target.value)}
                placeholder="Ex: Luz Solar, Fogo"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block">Descrição e Comportamento</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Manifestação visual, táticas de caça, sons emitidos..."
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
              className="px-4 py-1.5 bg-rose-700 hover:bg-rose-600 text-white font-mono text-xs font-bold rounded"
            >
              Registrar Ameaça
            </button>
          </div>
        </div>
      )}

      {/* Creatures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(creatures || []).map((c) => (
          <div
            key={c.id}
            className="p-4 bg-[#14161d] border border-rose-950/80 hover:border-rose-800 rounded-xl space-y-3 transition-colors shadow-lg"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-white uppercase font-mono tracking-tight">
                  {c.name}
                </h3>
                <div className="text-xs font-mono text-rose-400">
                  {c.concept} • Presença: {c.presenceElement}
                </div>
              </div>

              <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${threatColors[c.threatLevel] || threatColors['NÍVEL 1 (MENOR)']}`}>
                {c.threatLevel}
              </span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#0d0e12] p-2.5 rounded-lg border border-[#222634]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>PV: <strong className="text-white text-sm">{c.pv?.current ?? 0}/{c.pv?.max ?? 0}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" />
                <span>DEFESA: <strong className="text-white text-sm">{c.defense ?? 10}</strong></span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {c.description}
            </p>

            {/* Immunities & Weaknesses */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 bg-black/40 rounded border border-white/5">
                <span className="text-slate-500 block text-[10px]">IMUNIDADES</span>
                <span className="text-slate-300">{(c.immunities || []).join(', ') || 'Nenhuma'}</span>
              </div>
              <div className="p-2 bg-rose-950/20 rounded border border-rose-900/30">
                <span className="text-rose-400 block text-[10px]">FRAQUEZAS</span>
                <span className="text-rose-200">{(c.weaknesses || []).join(', ') || 'Desconhecidas'}</span>
              </div>
            </div>

            {/* Attacks List */}
            {c.attacks && c.attacks.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Ataques da Entidade:</span>
                {(c.attacks || []).map((atk, idx) => (
                  <div key={atk.id || idx} className="p-2 bg-[#0d0e12] rounded border border-[#222634] flex items-center justify-between text-xs font-mono">
                    <div>
                      <strong className="text-slate-200">{atk.name}</strong> ({atk.damageFormula})
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenRoll(`Ataque de ${c.name} (${atk.name})`, atk.attackFormula, 'ATAQUE')}
                        className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold"
                      >
                        Atacar
                      </button>
                      <button
                        onClick={() => onOpenRoll(`Dano de ${c.name} (${atk.name})`, atk.damageFormula, 'DANO')}
                        className="px-2 py-1 bg-[#1a1d26] hover:bg-[#252a3a] text-rose-300 rounded text-[10px] font-bold"
                      >
                        Dano
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isMaster && (
              <div className="flex justify-end pt-2 border-t border-white/5">
                <button
                  onClick={() => onDeleteCreature(c.id)}
                  className="p-1 text-slate-600 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};
