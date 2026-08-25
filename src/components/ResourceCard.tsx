import React, { useState } from 'react';
import { ResourceValue, CustomResource } from '../types';
import { Heart, Zap, Shield, Plus, Minus, Settings2, Sparkles } from 'lucide-react';

interface ResourceCardProps {
  pv: ResourceValue;
  pr: ResourceValue;
  defense: number | any;
  defenseBonus: number;
  customResources?: CustomResource[];
  presenceColor: string;
  onUpdatePv: (newVal: number, tempVal?: number) => void;
  onUpdatePr: (newVal: number, tempVal?: number) => void;
  onUpdateDefense: (defense: number, bonus: number) => void;
  onUpdateCustomResource?: (id: string, current: number) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  pv,
  pr,
  defense,
  defenseBonus,
  customResources = [],
  presenceColor,
  onUpdatePv,
  onUpdatePr,
  onUpdateDefense,
  onUpdateCustomResource,
}) => {
  const numericDefense = typeof defense === 'object'
    ? (defense?.total ?? defense?.base ?? 14)
    : (typeof defense === 'number' ? defense : 14);

  const [pvDelta, setPvDelta] = useState<number>(5);
  const [prDelta, setPrDelta] = useState<number>(5);
  const [isEditingMax, setIsEditingMax] = useState(false);
  const [editPvMax, setEditPvMax] = useState(pv.max);
  const [editPrMax, setEditPrMax] = useState(pr.max);
  const [editDefBase, setEditDefBase] = useState(numericDefense);

  const pvPercent = Math.min(100, Math.max(0, (pv.current / (pv.max || 1)) * 100));
  const prPercent = Math.min(100, Math.max(0, (pr.current / (pr.max || 1)) * 100));

  const totalDefense = numericDefense + (defenseBonus || 0);

  const handleSaveMax = () => {
    onUpdatePv(Math.min(pv.current, editPvMax));
    onUpdatePr(Math.min(pr.current, editPrMax));
    onUpdateDefense(editDefBase, defenseBonus);
    setIsEditingMax(false);
  };

  return (
    <div className="space-y-3">
      
      {/* Main Core Resource Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        
        {/* PONTOS DE VIDA (PV) CARD */}
        <div className="bg-[#14161d] border border-[#222634] hover:border-rose-900/60 rounded-xl p-4 shadow-lg space-y-3 transition-colors relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs font-mono uppercase tracking-wider">
              <Heart className="w-4 h-4 fill-rose-500/20 text-rose-500" />
              <span>Pontos de Vida</span>
            </div>
            {pv.temp > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                +{pv.temp} TEMP
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              {pv.current}
              <span className="text-base sm:text-lg font-normal text-slate-500"> / {pv.max}</span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              {Math.round(pvPercent)}%
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-[#0b0c10] rounded-full overflow-hidden border border-[#222634]">
            <div
              className="h-full bg-gradient-to-r from-rose-700 to-rose-500 transition-all duration-300"
              style={{ width: `${pvPercent}%` }}
            />
          </div>

          {/* Fast Steppers */}
          <div className="flex items-center justify-between gap-1 pt-1">
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdatePv(Math.max(0, pv.current - pvDelta))}
                className="px-2.5 py-1 bg-[#1c202c] hover:bg-rose-950 hover:text-rose-200 border border-[#2e3344] text-slate-200 font-mono text-xs font-bold rounded transition-colors"
              >
                -{pvDelta}
              </button>
              <button
                onClick={() => onUpdatePv(Math.max(0, pv.current - 1))}
                className="px-2 py-1 bg-[#1c202c] hover:bg-rose-950 text-slate-300 border border-[#2e3344] font-mono text-xs rounded"
              >
                -1
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdatePv(Math.min(pv.max + (pv.temp || 0), pv.current + 1))}
                className="px-2 py-1 bg-[#1c202c] hover:bg-emerald-950 text-slate-300 border border-[#2e3344] font-mono text-xs rounded"
              >
                +1
              </button>
              <button
                onClick={() => onUpdatePv(Math.min(pv.max + (pv.temp || 0), pv.current + pvDelta))}
                className="px-2.5 py-1 bg-[#1c202c] hover:bg-emerald-950 hover:text-emerald-200 border border-[#2e3344] text-slate-200 font-mono text-xs font-bold rounded transition-colors"
              >
                +{pvDelta}
              </button>
            </div>
          </div>
        </div>

        {/* PONTOS DE PRESENÇA (PR) CARD */}
        <div className="bg-[#14161d] border border-[#222634] hover:border-blue-900/60 rounded-xl p-4 shadow-lg space-y-3 transition-colors relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs font-mono uppercase tracking-wider">
              <Zap className="w-4 h-4 fill-blue-500/20 text-blue-500" />
              <span>Pontos de Presença</span>
            </div>
            {pr.temp > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                +{pr.temp} TEMP
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              {pr.current}
              <span className="text-base sm:text-lg font-normal text-slate-500"> / {pr.max}</span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              {Math.round(prPercent)}%
            </div>
          </div>

          {/* PR Progress Bar (Dynamic Presence Accent Glow) */}
          <div className="w-full h-2.5 bg-[#0b0c10] rounded-full overflow-hidden border border-[#222634]">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${prPercent}%`,
                backgroundColor: presenceColor === '#F8FAFC' ? '#60A5FA' : presenceColor,
                boxShadow: `0 0 10px ${presenceColor}50`,
              }}
            />
          </div>

          {/* Fast PR Steppers */}
          <div className="flex items-center justify-between gap-1 pt-1">
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdatePr(Math.max(0, pr.current - prDelta))}
                className="px-2.5 py-1 bg-[#1c202c] hover:bg-blue-950 hover:text-blue-200 border border-[#2e3344] text-slate-200 font-mono text-xs font-bold rounded transition-colors"
              >
                -{prDelta}
              </button>
              <button
                onClick={() => onUpdatePr(Math.max(0, pr.current - 1))}
                className="px-2 py-1 bg-[#1c202c] hover:bg-blue-950 text-slate-300 border border-[#2e3344] font-mono text-xs rounded"
              >
                -1
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdatePr(Math.min(pr.max + (pr.temp || 0), pr.current + 1))}
                className="px-2 py-1 bg-[#1c202c] hover:bg-cyan-950 text-slate-300 border border-[#2e3344] font-mono text-xs rounded"
              >
                +1
              </button>
              <button
                onClick={() => onUpdatePr(Math.min(pr.max + (pr.temp || 0), pr.current + prDelta))}
                className="px-2.5 py-1 bg-[#1c202c] hover:bg-cyan-950 hover:text-cyan-200 border border-[#2e3344] text-slate-200 font-mono text-xs font-bold rounded transition-colors"
              >
                +{prDelta}
              </button>
            </div>
          </div>
        </div>

        {/* DEFESA & PROTEÇÃO TÁTICA */}
        <div className="bg-[#14161d] border border-[#222634] hover:border-slate-600 rounded-xl p-4 shadow-lg flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs font-mono uppercase tracking-wider">
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Defesa Geral</span>
            </div>
            <button
              onClick={() => setIsEditingMax(!isEditingMax)}
              className="text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1"
            >
              <Settings2 className="w-3 h-3" />
              <span>Ajustar</span>
            </button>
          </div>

          <div className="flex items-baseline justify-between my-2">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
              {totalDefense}
            </div>
            <div className="text-xs font-mono text-slate-400">
              Base {numericDefense} {defenseBonus !== 0 ? `(${defenseBonus > 0 ? '+' : ''}${defenseBonus} Bônus)` : ''}
            </div>
          </div>

          {/* Defense Bonus Quick Toggles */}
          <div className="flex items-center justify-between gap-1 pt-1">
            <span className="text-[11px] font-mono text-slate-400">Bônus Temp:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdateDefense(numericDefense, Math.max(-10, (defenseBonus || 0) - 2))}
                className="px-2 py-0.5 bg-[#1c202c] hover:bg-[#252a3a] border border-[#2e3344] text-xs font-mono text-slate-300 rounded"
              >
                -2
              </button>
              <button
                onClick={() => onUpdateDefense(numericDefense, 0)}
                className="px-2 py-0.5 bg-[#1c202c] hover:bg-[#252a3a] border border-[#2e3344] text-[10px] font-mono text-slate-400 rounded"
              >
                0
              </button>
              <button
                onClick={() => onUpdateDefense(numericDefense, (defenseBonus || 0) + 2)}
                className="px-2 py-0.5 bg-[#1c202c] hover:bg-[#252a3a] border border-[#2e3344] text-xs font-mono text-slate-300 rounded"
              >
                +2
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Modal/Inline Quick Limits Editor */}
      {isEditingMax && (
        <div className="p-3 bg-[#0d0e14] border border-[#2a2e3d] rounded-lg text-xs font-mono space-y-2 animate-in fade-in">
          <div className="text-slate-400 uppercase font-bold text-[10px]">
            Configurar Tetos Máximos de Recursos
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-slate-500 block">PV Máximo</label>
              <input
                type="number"
                value={editPvMax}
                onChange={(e) => setEditPvMax(Number(e.target.value) || 1)}
                className="w-full px-2 py-1 bg-[#14161d] border border-[#2e3344] rounded text-slate-200"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">PR Máximo</label>
              <input
                type="number"
                value={editPrMax}
                onChange={(e) => setEditPrMax(Number(e.target.value) || 1)}
                className="w-full px-2 py-1 bg-[#14161d] border border-[#2e3344] rounded text-slate-200"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">Defesa Base</label>
              <input
                type="number"
                value={editDefBase}
                onChange={(e) => setEditDefBase(Number(e.target.value) || 10)}
                className="w-full px-2 py-1 bg-[#14161d] border border-[#2e3344] rounded text-slate-200"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setIsEditingMax(false)}
              className="px-2.5 py-1 text-slate-400 hover:text-slate-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveMax}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      {/* Custom Auxiliary Trackers (e.g. Sanidade / Estabilidade Mental) */}
      {customResources.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {customResources.map((res) => {
            const resPercent = Math.min(100, Math.max(0, (res.current / (res.max || 1)) * 100));
            return (
              <div key={res.id} className="p-3 bg-[#11131a] border border-[#222634] rounded-lg flex items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 font-medium">{res.name}</span>
                    <span className="text-slate-400">{res.current} / {res.max}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ width: `${resPercent}%`, backgroundColor: res.color || '#38BDF8' }}
                    />
                  </div>
                </div>
                {onUpdateCustomResource && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateCustomResource(res.id, Math.max(0, res.current - 5))}
                      className="px-2 py-1 bg-[#1a1d26] hover:bg-slate-800 border border-[#2e3344] text-xs font-mono rounded text-slate-300"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => onUpdateCustomResource(res.id, Math.min(res.max, res.current + 5))}
                      className="px-2 py-1 bg-[#1a1d26] hover:bg-slate-800 border border-[#2e3344] text-xs font-mono rounded text-slate-300"
                    >
                      +5
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
