import React, { useState } from 'react';
import { Weapon, CharacterSkill, AttributeKey } from '../types';
import { Crosshair, Plus, Flame, RotateCw, Trash2, Shield, Swords, Check } from 'lucide-react';

interface CombatTabProps {
  weapons: Weapon[];
  skills: CharacterSkill[];
  onOpenRoll: (rollName: string, formula: string, rollType: 'ATAQUE' | 'DANO') => void;
  onUpdateWeapon: (weapon: Weapon) => void;
  onDeleteWeapon: (weaponId: string) => void;
  onCreateWeapon: (weapon: Partial<Weapon>) => void;
  onToggleEquip: (weaponId: string) => void;
  onReload: (weaponId: string) => void;
  onFire: (weaponId: string) => void;
}

export const CombatTab: React.FC<CombatTabProps> = ({
  weapons,
  skills,
  onOpenRoll,
  onUpdateWeapon,
  onDeleteWeapon,
  onCreateWeapon,
  onToggleEquip,
  onReload,
  onFire,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('Arma de Fogo');
  const [category, setCategory] = useState<'Corpo a corpo' | 'Distância'>('Distância');
  const [skillUsed, setSkillUsed] = useState(skills[0]?.name || 'Pontaria');
  const [damageFormula, setDamageFormula] = useState('2d10');
  const [damageType, setDamageType] = useState('Balístico');
  const [critical, setCritical] = useState('19-20 / x3');
  const [range, setRange] = useState('Médio (30m)');
  const [maxAmmo, setMaxAmmo] = useState(6);
  const [description, setDescription] = useState('');
  const [specialEffects, setSpecialEffects] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreateWeapon({
      name: name.trim(),
      type,
      category,
      skillUsed,
      attrUsed: category === 'Distância' ? 'des' : 'for',
      damageFormula,
      damageType,
      critical,
      range,
      currentAmmo: maxAmmo,
      maxAmmo,
      equipped: true,
      description,
      specialEffects,
    });
    setName('');
    setDescription('');
    setSpecialEffects('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-4">
      
      {/* Tab Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold font-mono tracking-wider text-slate-200 uppercase flex items-center gap-2">
            <Swords className="w-4 h-4 text-red-500" />
            <span>ARSENAL & SISTEMA DE COMBATE</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Armas de fogo, lâminas paranormais e ataques corporais cadastrados no arquivo.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono font-bold shadow-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Adicionar Arma</span>
        </button>
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <div className="p-4 bg-[#14161d] border border-red-900/60 rounded-xl space-y-3 animate-in fade-in">
          <div className="text-xs font-mono font-bold text-red-400 uppercase">
            Cadastrar Nova Arma no Arsenal
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Nome da Arma</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Rifle Antimaterial #03"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Tipo / Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              >
                <option value="Distância">Distância (Arma de Fogo / Arremesso)</option>
                <option value="Corpo a corpo">Corpo a corpo (Lâmina / Impacto)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Perícia Utilizada</label>
              <select
                value={skillUsed}
                onChange={(e) => setSkillUsed(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              >
                {skills.map((s) => (
                  <option key={s.id} value={s.name}>{s.name} (+{s.value})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Fórmula de Dano</label>
              <input
                type="text"
                value={damageFormula}
                onChange={(e) => setDamageFormula(e.target.value)}
                placeholder="Ex: 2d10 ou 1d8+3"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Tipo de Dano</label>
              <input
                type="text"
                value={damageType}
                onChange={(e) => setDamageType(e.target.value)}
                placeholder="Ex: Balístico, Corte"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Crítico / Multiplicador</label>
              <input
                type="text"
                value={critical}
                onChange={(e) => setCritical(e.target.value)}
                placeholder="Ex: 19-20 / x3"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Capacidade Munição</label>
              <input
                type="number"
                value={maxAmmo}
                onChange={(e) => setMaxAmmo(Number(e.target.value) || 1)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block">Efeitos Especiais / Propriedades Paranormais</label>
            <input
              type="text"
              value={specialEffects}
              onChange={(e) => setSpecialEffects(e.target.value)}
              placeholder="Ex: Gasta 5 PR para causar dano solar extra..."
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
              className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded"
            >
              Registrar Arma
            </button>
          </div>
        </div>
      )}

      {/* Weapon Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weapons.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs">
            Nenhuma arma cadastrada. Clique em "Adicionar Arma" para incluir armamento no arquivo.
          </div>
        ) : (
          weapons.map((wep) => {
            const skill = skills.find((s) => s.name === wep.skillUsed) || skills[0];
            const attackBonus = skill ? skill.value : 10;
            const attackFormula = `1d20 + ${attackBonus}`;
            const hasAmmo = wep.maxAmmo > 1;

            return (
              <div
                key={wep.id}
                className={`p-4 rounded-xl border transition-all space-y-3 relative ${
                  wep.equipped
                    ? 'bg-[#151822] border-red-900/60 shadow-lg'
                    : 'bg-[#11131a] border-[#222634] opacity-80 hover:opacity-100'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-white uppercase font-mono tracking-tight">
                        {wep.name}
                      </span>
                      {wep.equipped && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-900">
                          EQUIPADA
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {wep.type} • {wep.category} • Alcance: {wep.range}
                    </div>
                  </div>

                  {/* Equipped Toggle */}
                  <button
                    onClick={() => onToggleEquip(wep.id)}
                    className={`p-1.5 rounded text-xs font-mono border transition-colors ${
                      wep.equipped
                        ? 'bg-red-950 text-red-300 border-red-800'
                        : 'bg-[#1a1d26] text-slate-400 border-[#2e3344] hover:text-white'
                    }`}
                    title={wep.equipped ? 'Desequipar' : 'Equipar'}
                  >
                    <Check className={`w-3.5 h-3.5 ${wep.equipped ? 'opacity-100' : 'opacity-30'}`} />
                  </button>
                </div>

                {/* Stats Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#0d0e12] p-2.5 rounded-lg border border-[#222634]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">ATAQUE ({wep.skillUsed})</span>
                    <strong className="text-slate-100 text-sm">+{attackBonus}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">DANO & TIPO</span>
                    <strong className="text-rose-400 text-sm">{wep.damageFormula}</strong>{' '}
                    <span className="text-[10px] text-slate-400">({wep.damageType})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">CRÍTICO</span>
                    <span className="text-amber-300">{wep.critical}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">MUNIÇÃO / CARGA</span>
                    {hasAmmo ? (
                      <span className="text-slate-200 font-bold">{wep.currentAmmo} / {wep.maxAmmo}</span>
                    ) : (
                      <span className="text-slate-500">Infinita / N/A</span>
                    )}
                  </div>
                </div>

                {/* Description & Special Effects */}
                {wep.description && (
                  <p className="text-xs text-slate-400 italic">
                    {wep.description}
                  </p>
                )}

                {wep.specialEffects && (
                  <div className="text-[11px] text-amber-200/90 bg-amber-950/20 border border-amber-900/40 p-2 rounded">
                    <strong>Efeito:</strong> {wep.specialEffects}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                  <button
                    onClick={() => {
                      if (hasAmmo && wep.currentAmmo > 0) {
                        onFire(wep.id);
                      }
                      onOpenRoll(`Ataque com ${wep.name}`, attackFormula, 'ATAQUE');
                    }}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs rounded-lg shadow flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>ATACAR (+{attackBonus})</span>
                  </button>

                  <button
                    onClick={() => onOpenRoll(`Dano de ${wep.name}`, wep.damageFormula, 'DANO')}
                    className="flex-1 py-2 bg-[#1c202c] hover:bg-[#252a3a] text-rose-300 border border-rose-900/60 font-mono font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>ROLAR DANO</span>
                  </button>

                  {hasAmmo && (
                    <button
                      onClick={() => onReload(wep.id)}
                      title="Recarregar Munição"
                      className="px-2.5 py-2 bg-[#1a1d26] hover:bg-[#242836] border border-[#2e3344] text-slate-300 text-xs rounded-lg flex items-center justify-center transition-colors"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteWeapon(wep.id)}
                    title="Excluir arma"
                    className="p-2 text-slate-600 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
