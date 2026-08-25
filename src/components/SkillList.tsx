import React, { useState } from 'react';
import { CharacterSkill, AttributeKey, AttributeData } from '../types';
import { Dices, Search, Plus, Trash2, BookOpen } from 'lucide-react';

interface SkillListProps {
  skills: CharacterSkill[];
  attributes: Record<AttributeKey, AttributeData>;
  filterAttr: AttributeKey | 'ALL';
  onRollSkill: (skill: CharacterSkill, formula: string) => void;
  onUpdateSkill: (skill: CharacterSkill) => void;
  onDeleteSkill: (skillId: string) => void;
  onCreateSkill: (newSkill: Partial<CharacterSkill>) => void;
  isMaster?: boolean;
}

export const SkillList: React.FC<SkillListProps> = ({
  skills,
  attributes,
  filterAttr,
  onRollSkill,
  onUpdateSkill,
  onDeleteSkill,
  onCreateSkill,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillAttr, setNewSkillAttr] = useState<AttributeKey>('int');
  const [newSkillTraining, setNewSkillTraining] = useState<string>('Treinado');
  const [newSkillBonus, setNewSkillBonus] = useState<number>(0);

  const skillsList = skills || [];
  const filteredSkills = skillsList.filter((sk) => {
    const activeAttr = sk.currentAttr || sk.baseAttr;
    const matchesAttr = filterAttr === 'ALL' || activeAttr === filterAttr;
    const matchesSearch = (sk.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAttr && matchesSearch;
  });

  const handleCreate = () => {
    if (!newSkillName.trim()) return;
    onCreateSkill({
      name: newSkillName.trim(),
      baseAttr: newSkillAttr,
      currentAttr: newSkillAttr,
      training: newSkillTraining,
      bonus: newSkillBonus,
      penalties: 0,
      tempMod: 0,
    });
    setNewSkillName('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-3 bg-[#10131A] border border-[#232836] rounded-xl p-4 sm:p-5 shadow-xl">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#232836] pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
            REGISTRO DE PERÍCIAS & ESPECIALIZAÇÕES ({filteredSkills.length})
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar perícia..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#090B0E] border border-[#232836] focus:border-rose-600 rounded text-xs font-mono text-slate-200 outline-none"
            />
          </div>

          {/* Add Skill Button */}
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-rose-950/70 hover:bg-rose-900 border border-rose-800/60 text-rose-200 rounded text-xs font-mono transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>

      {/* Creation Modal / Inline Bar */}
      {isCreating && (
        <div className="p-3 bg-[#090B0E] border border-rose-900/60 rounded-lg space-y-3 animate-in fade-in">
          <div className="text-xs font-mono text-rose-400 font-bold uppercase">
            Cadastrar Nova Perícia
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-mono text-slate-500 block">Nome da Perícia</label>
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Ex: Criptografia, Pilotagem"
                className="w-full px-2.5 py-1.5 bg-[#12151C] border border-[#232836] rounded text-xs font-mono text-slate-200 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-500 block">Atributo Base</label>
              <select
                value={newSkillAttr}
                onChange={(e) => setNewSkillAttr(e.target.value as AttributeKey)}
                className="w-full px-2 py-1.5 bg-[#12151C] border border-[#232836] rounded text-xs font-mono text-slate-200 outline-none"
              >
                <option value="for">FORÇA (FOR)</option>
                <option value="des">DESTREZA (DES)</option>
                <option value="con">CONSTITUIÇÃO (CON)</option>
                <option value="int">INTELIGÊNCIA (INT)</option>
                <option value="sab">SABEDORIA (SAB)</option>
                <option value="car">CARISMA (CAR)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-500 block">Grau / Treinamento</label>
              <input
                type="text"
                value={newSkillTraining}
                onChange={(e) => setNewSkillTraining(e.target.value)}
                placeholder="Treinado"
                className="w-full px-2 py-1.5 bg-[#12151C] border border-[#232836] rounded text-xs font-mono text-slate-200 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setIsCreating(false)}
              className="px-3 py-1 text-slate-400 hover:text-slate-200 text-xs font-mono"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-1 bg-rose-700 hover:bg-rose-600 text-white font-mono text-xs font-bold rounded"
            >
              Salvar Perícia
            </button>
          </div>
        </div>
      )}

      {/* Skills Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {filteredSkills.length === 0 ? (
          <div className="col-span-full py-8 text-center text-slate-500 font-mono text-xs">
            Nenhuma perícia registrada no dossiê.
          </div>
        ) : (
          filteredSkills.map((skill) => {
            const activeAttrKey = skill.currentAttr || skill.baseAttr;
            const attrVal = (attributes[activeAttrKey]?.value || 0) + (attributes[activeAttrKey]?.bonus || 0);
            const totalBonus = attrVal + (skill.bonus || 0) + (skill.tempMod || 0);
            const formula = `1d20 + ${totalBonus}`;

            return (
              <div
                key={skill.id}
                className="p-3 bg-[#12151C] hover:bg-[#181D26] border border-[#232836] hover:border-slate-600 rounded-lg flex items-center justify-between gap-2.5 transition-colors group"
              >
                {/* Skill Details */}
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-100 truncate">
                      {skill.name}
                    </span>
                    {skill.training && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#2A2E3D] bg-[#090B0E] text-rose-300">
                        {skill.training}
                      </span>
                    )}
                  </div>

                  {/* Alternative Attribute Selector */}
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500">Atributo:</span>
                    <select
                      value={activeAttrKey}
                      onChange={(e) => {
                        const newAttr = e.target.value as AttributeKey;
                        onUpdateSkill({
                          ...skill,
                          currentAttr: newAttr,
                        });
                      }}
                      className="bg-[#090B0E] border border-[#232836] rounded px-1.5 py-0.5 text-xs text-slate-300 uppercase cursor-pointer"
                    >
                      <option value="for">FOR ({attributes.for?.value || 0})</option>
                      <option value="des">DES ({attributes.des?.value || 0})</option>
                      <option value="con">CON ({attributes.con?.value || 0})</option>
                      <option value="int">INT ({attributes.int?.value || 0})</option>
                      <option value="sab">SAB ({attributes.sab?.value || 0})</option>
                      <option value="car">CAR ({attributes.car?.value || 0})</option>
                    </select>

                    {skill.bonus ? (
                      <span className="text-[10px] text-emerald-400 font-bold">
                        +{skill.bonus} bônus
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Score & Roll Button */}
                <div className="flex items-center gap-2">
                  <div className="text-right font-mono">
                    <div className="text-base font-extrabold text-slate-100">
                      +{totalBonus}
                    </div>
                    <div className="text-[9px] text-slate-500 uppercase">
                      Total
                    </div>
                  </div>

                  <button
                    onClick={() => onRollSkill(skill, formula)}
                    className="px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-white font-mono text-xs font-bold rounded-lg shadow flex items-center gap-1.5 transition-colors"
                  >
                    <Dices className="w-4 h-4 text-rose-300" />
                    <span>ROLAR</span>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteSkill(skill.id)}
                    title="Excluir perícia"
                    className="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
