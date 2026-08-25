import React from 'react';
import { IndividualityData, IndividualityLevel } from '../types';
import { Fingerprint, Lock, Unlock, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';

interface IndividualityTabProps {
  individuality?: IndividualityData;
  onUpdateLevel: (levelIndex: number, level: IndividualityLevel) => void;
  onToggleUnlock: (levelIndex: number) => void;
  onUpdateNotes: (notes: string) => void;
  isMaster?: boolean;
}

export const IndividualityTab: React.FC<IndividualityTabProps> = ({
  individuality,
  onUpdateLevel,
  onToggleUnlock,
  onUpdateNotes,
  isMaster = false,
}) => {
  if (!individuality) {
    return (
      <div className="p-8 text-center bg-[#14161d] border border-[#222634] rounded-xl text-slate-500 font-mono text-xs">
        Nenhum registro de Individualidade indexado neste dossiê.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Header Banner */}
      <div className="bg-[#14161d] border border-[#222634] rounded-xl p-4 sm:p-5 shadow-lg space-y-2 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#222634] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-800 text-red-400">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase">
                ANOMALIA PESSOAL // DNA PARANORMAL
              </div>
              <h2 className="text-lg font-extrabold text-white uppercase font-mono">
                {individuality.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded bg-[#0d0e12] border border-[#2a2e3d] text-slate-300">
              DESPERTAR ATUAL: <strong className="text-red-400">NÍVEL {individuality.currentLevel} / 5</strong>
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
          {individuality.description}
        </p>

        {individuality.riskLevel && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 pt-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>NÍVEL DE PERICULOSIDADE AO AMBIENTE: {individuality.riskLevel}</span>
          </div>
        )}
      </div>

      {/* The 5 Awakening Levels */}
      <div className="space-y-3">
        <div className="text-xs font-mono tracking-widest text-slate-400 uppercase font-bold flex items-center gap-2">
          <span>PROGRESSÃO EM 5 NÍVEIS DE DESPERTAR</span>
        </div>

        <div className="space-y-3">
          {(individuality.levels || []).map((lvl, index) => {
            const isUnlocked = lvl.unlocked;

            return (
              <div
                key={lvl.level}
                className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
                  isUnlocked
                    ? 'bg-[#14161d] border-red-900/60 shadow-lg'
                    : 'bg-[#0f1117] border-[#1e2230] opacity-80'
                }`}
              >
                {/* Visual Level Indicator */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-extrabold text-sm border ${
                      isUnlocked
                        ? 'bg-red-950 text-red-300 border-red-700 shadow'
                        : 'bg-[#161922] text-slate-500 border-[#262b3a]'
                    }`}>
                      {lvl.level}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white uppercase font-mono">
                          {isUnlocked ? lvl.title : (isMaster ? `${lvl.title} (BLOQUEADO)` : '███████████████')}
                        </span>
                        <span className={`text-[9px] font-mono px-2 py-0.2 rounded border flex items-center gap-1 ${
                          isUnlocked
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                            : 'bg-slate-900 text-slate-500 border-slate-700'
                        }`}>
                          {isUnlocked ? <Unlock className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                          <span>{isUnlocked ? 'DESPERTO' : 'BLOQUEADO'}</span>
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Condição: {lvl.condition}
                      </div>
                    </div>
                  </div>

                  {/* Master unlock toggle */}
                  {isMaster && (
                    <button
                      onClick={() => onToggleUnlock(index)}
                      className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors flex items-center gap-1 ${
                        isUnlocked
                          ? 'bg-red-950/60 text-red-300 border-red-800 hover:bg-red-900'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                      }`}
                    >
                      {isUnlocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      <span>{isUnlocked ? 'Bloquear' : 'Desbloquear'}</span>
                    </button>
                  )}
                </div>

                {/* Body Details (Redacted if locked for players!) */}
                <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                  {isUnlocked ? (
                    <>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {lvl.description}
                      </p>
                      {lvl.effects && (
                        <div className="text-xs font-mono text-red-300 bg-red-950/20 border border-red-900/40 p-2.5 rounded-lg">
                          <strong>Manifestação Mecânica:</strong> {lvl.effects}
                        </div>
                      )}
                    </>
                  ) : isMaster ? (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Visível apenas para o Mestre até ser desbloqueado:</span>
                      </div>
                      <p className="text-xs text-slate-400 italic">
                        {lvl.description}
                      </p>
                      {lvl.effects && (
                        <div className="text-[11px] font-mono text-slate-400 bg-black/40 p-2 rounded">
                          <strong>Efeito Futuro:</strong> {lvl.effects}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-2 text-center text-slate-600 font-mono text-xs tracking-widest select-none">
                      [ CONTEÚDO SELADO PELO MESTRE — O AGENTE AINDA NÃO ATINGIU A TROCA NECESSÁRIA ]
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
