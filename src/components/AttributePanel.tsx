import React from 'react';
import { AttributeData, AttributeKey, CharacterSkill } from '../types';
import { Dices, Shield, Zap, Brain, Flame, Compass, Users, Plus, Minus } from 'lucide-react';

interface AttributePanelProps {
  attributes: {
    for: AttributeData;
    des: AttributeData;
    con: AttributeData;
    int: AttributeData;
    sab: AttributeData;
    car: AttributeData;
  };
  skills: CharacterSkill[];
  selectedAttr: AttributeKey | 'ALL';
  onSelectAttr: (attr: AttributeKey | 'ALL') => void;
  onRollAttribute: (attrKey: AttributeKey, attrName: string, val: number) => void;
  onUpdateAttribute?: (attrKey: AttributeKey, newVal: number) => void;
  isEditMode?: boolean;
}

export const AttributePanel: React.FC<AttributePanelProps> = ({
  attributes,
  skills,
  selectedAttr,
  onSelectAttr,
  onRollAttribute,
  onUpdateAttribute,
  isEditMode = false,
}) => {
  const attrConfigs: Array<{
    key: AttributeKey;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    desc: string;
    accentBorder: string;
    accentText: string;
  }> = [
    { 
      key: 'for', 
      label: 'FORÇA', 
      shortLabel: 'FOR', 
      icon: <Flame className="w-4 h-4 text-orange-400" />, 
      desc: 'Empuxo físico e impacto',
      accentBorder: 'border-orange-900/40 hover:border-orange-600',
      accentText: 'text-orange-300'
    },
    { 
      key: 'des', 
      label: 'DESTREZA', 
      shortLabel: 'DES', 
      icon: <Zap className="w-4 h-4 text-emerald-400" />, 
      desc: 'Reflexos, agilidade e pontaria',
      accentBorder: 'border-emerald-900/40 hover:border-emerald-600',
      accentText: 'text-emerald-300'
    },
    { 
      key: 'con', 
      label: 'CONSTITUIÇÃO', 
      shortLabel: 'CON', 
      icon: <Shield className="w-4 h-4 text-rose-400" />, 
      desc: 'Vigor orgânico e fôlego',
      accentBorder: 'border-rose-900/40 hover:border-rose-600',
      accentText: 'text-rose-300'
    },
    { 
      key: 'int', 
      label: 'INTELIGÊNCIA', 
      shortLabel: 'INT', 
      icon: <Brain className="w-4 h-4 text-sky-400" />, 
      desc: 'Raciocínio dedutivo e rituais',
      accentBorder: 'border-sky-900/40 hover:border-sky-600',
      accentText: 'text-sky-300'
    },
    { 
      key: 'sab', 
      label: 'SABEDORIA', 
      shortLabel: 'SAB', 
      icon: <Compass className="w-4 h-4 text-purple-400" />, 
      desc: 'Percepção e intuição da ilha',
      accentBorder: 'border-purple-900/40 hover:border-purple-600',
      accentText: 'text-purple-300'
    },
    { 
      key: 'car', 
      label: 'CARISMA', 
      shortLabel: 'CAR', 
      icon: <Users className="w-4 h-4 text-amber-400" />, 
      desc: 'Imposição e autoridade social',
      accentBorder: 'border-amber-900/40 hover:border-amber-600',
      accentText: 'text-amber-300'
    },
  ];

  return (
    <div className="space-y-3">
      {/* Attribute Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {attrConfigs.map((cfg) => {
          const data = attributes[cfg.key] || { value: 0 };
          const isSelected = selectedAttr === cfg.key;
          const totalVal = data.value + (data.bonus || 0) + (data.tempBonus || 0);
          const relatedSkillsCount = skills.filter((s) => (s.currentAttr || s.baseAttr) === cfg.key).length;

          return (
            <div
              key={cfg.key}
              onClick={() => onSelectAttr(isSelected ? 'ALL' : cfg.key)}
              className={`p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between select-none ${
                isSelected
                  ? 'bg-[#181D26] border-rose-600 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/50'
                  : `bg-[#10131A] ${cfg.accentBorder}`
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-mono font-bold tracking-wider flex items-center gap-1.5 ${cfg.accentText}`}>
                  {cfg.icon}
                  <span>{cfg.shortLabel}</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-400">
                  {relatedSkillsCount}
                </span>
              </div>

              {/* Direct Value Display */}
              <div className="my-2 text-center">
                <div className="text-3xl font-extrabold font-title-paranormal text-slate-100">
                  {data.value}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Atributo Direto
                  {data.bonus ? (
                    <span className="text-emerald-400 ml-1">+{data.bonus}</span>
                  ) : null}
                </div>
              </div>

              {/* Edit or Roll Mode */}
              {isEditMode && onUpdateAttribute ? (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onUpdateAttribute(cfg.key, Math.max(0, data.value - 1))}
                    className="flex-1 py-1 bg-[#181D26] hover:bg-slate-700 text-slate-300 rounded text-xs font-bold flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateAttribute(cfg.key, data.value + 1)}
                    className="flex-1 py-1 bg-[#181D26] hover:bg-slate-700 text-slate-300 rounded text-xs font-bold flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRollAttribute(cfg.key, `Teste de ${cfg.label}`, totalVal);
                    }}
                    className="w-full py-1 bg-[#181D26] hover:bg-rose-950 hover:text-rose-200 border border-slate-800 text-[10px] font-mono text-slate-300 rounded flex items-center justify-center gap-1 transition-colors"
                  >
                    <Dices className="w-3 h-3 text-rose-400" />
                    <span>Rolar {totalVal >= 0 ? `+${totalVal}` : totalVal}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Filter notification & clear button */}
      <div className="flex items-center justify-between px-1 text-xs font-mono text-slate-400">
        <div>
          {selectedAttr === 'ALL' ? (
            <span>Exibindo todas as perícias registradas.</span>
          ) : (
            <span>
              Filtrando perícias por: <strong className="text-rose-400 uppercase font-bold">{selectedAttr}</strong> (Clique no card para limpar filtro)
            </span>
          )}
        </div>
        {selectedAttr !== 'ALL' && (
          <button
            onClick={() => onSelectAttr('ALL')}
            className="text-[11px] text-rose-400 hover:text-rose-300 underline font-mono"
          >
            Mostrar Todas as Perícias
          </button>
        )}
      </div>
    </div>
  );
};
