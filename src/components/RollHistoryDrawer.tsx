import React from 'react';
import { RollHistoryEntry } from '../types';
import { Dices, X, Sparkles, AlertTriangle, Clock } from 'lucide-react';

interface RollHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rolls: RollHistoryEntry[];
}

export const RollHistoryDrawer: React.FC<RollHistoryDrawerProps> = ({ isOpen, onClose, rolls }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#11131a] border-l border-[#262b3a] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0d0e14] border-b border-[#222634]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-amber-950/60 border border-amber-800 text-amber-400">
              <Dices className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                REGISTRO DA MESA
              </div>
              <div className="text-sm font-bold text-slate-100">Histórico de Rolagens</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-[#1a1d26] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {(!rolls || rolls.length === 0) ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono">
              Nenhuma rolagem registrada ainda nesta sessão de investigação.
            </div>
          ) : (
            (rolls || []).map((roll) => {
              const timeFormatted = new Date(roll.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              return (
                <div
                  key={roll.id}
                  className={`p-3 rounded-lg border bg-[#151822] transition-colors ${
                    roll.isCrit
                      ? 'border-amber-500/70 shadow-sm shadow-amber-950/30'
                      : roll.isFumble
                      ? 'border-rose-600/70 shadow-sm shadow-rose-950/30'
                      : 'border-[#262b3a]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider">
                        {roll.characterName}
                      </div>
                      <div className="text-xs font-medium text-slate-200 mt-0.5">
                        {roll.rollName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-extrabold font-mono ${
                        roll.isCrit ? 'text-amber-400' : roll.isFumble ? 'text-rose-400' : 'text-slate-100'
                      }`}>
                        {roll.result}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 flex items-center justify-end gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{timeFormatted}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#1e2330] flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{roll.diceBreakdown}</span>
                    {roll.isCrit && (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Crítico
                      </span>
                    )}
                    {roll.isFumble && (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Falha Crítica
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0d0e14] border-t border-[#222634] text-center text-[10px] font-mono text-slate-400">
          Rolagens sincronizadas em tempo real via canal seguro da Ilha
        </div>

      </div>
    </div>
  );
};
