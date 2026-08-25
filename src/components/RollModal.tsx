import React, { useState } from 'react';
import { Dices, X, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { RollHistoryEntry, User } from '../types';
import { rollDice } from '../lib/api';

interface RollModalProps {
  isOpen: boolean;
  onClose: () => void;
  rollName: string;
  defaultFormula: string;
  rollType: 'PERÍCIA' | 'ATAQUE' | 'DANO' | 'RITUAL' | 'LIVRE';
  characterName: string;
  campaignId: string;
  currentUser: User;
  onRollComplete?: (entry: RollHistoryEntry) => void;
}

export const RollModal: React.FC<RollModalProps> = ({
  isOpen,
  onClose,
  rollName,
  defaultFormula,
  rollType,
  characterName,
  campaignId,
  currentUser,
  onRollComplete,
}) => {
  const [formula, setFormula] = useState(defaultFormula);
  const [circumstanceMod, setCircumstanceMod] = useState<number>(0);
  const [isRolling, setIsRolling] = useState(false);
  const [lastResult, setLastResult] = useState<RollHistoryEntry | null>(null);

  if (!isOpen) return null;

  const handleExecuteRoll = async () => {
    try {
      setIsRolling(true);
      const res = await rollDice(
        {
          campaignId,
          characterName,
          rollType,
          rollName,
          formula,
          circumstanceMod,
        },
        currentUser
      );
      setLastResult(res);
      if (onRollComplete) onRollComplete(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRolling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#14161d] border border-[#2a2e3d] rounded-xl shadow-2xl overflow-hidden text-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0f1117] border-b border-[#222634]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-amber-950/60 border border-amber-800 text-amber-400">
              <Dices className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                TESTE PARANORMAL // {rollType}
              </div>
              <div className="text-sm font-bold text-slate-100">{rollName}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          
          {/* Formula editor */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Fórmula de Rolagem (Dados + Modificadores)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d0e12] border border-[#2a2e3d] focus:border-red-500 rounded font-mono text-sm text-slate-100 outline-none"
                placeholder="Ex: 1d20 + 12 ou 2d10"
              />
            </div>
          </div>

          {/* Quick Circumstance Modifiers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Bônus / Vantagem
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCircumstanceMod((v) => v + 2)}
                  className="flex-1 py-1.5 bg-[#1a1d26] hover:bg-[#232733] border border-[#2e3344] text-xs font-mono text-emerald-400 rounded"
                >
                  +2
                </button>
                <button
                  type="button"
                  onClick={() => setCircumstanceMod((v) => v + 5)}
                  className="flex-1 py-1.5 bg-[#1a1d26] hover:bg-[#232733] border border-[#2e3344] text-xs font-mono text-emerald-400 rounded"
                >
                  +5
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Penalidade / Desvantagem
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCircumstanceMod((v) => v - 2)}
                  className="flex-1 py-1.5 bg-[#1a1d26] hover:bg-[#232733] border border-[#2e3344] text-xs font-mono text-rose-400 rounded"
                >
                  -2
                </button>
                <button
                  type="button"
                  onClick={() => setCircumstanceMod((v) => v - 5)}
                  className="flex-1 py-1.5 bg-[#1a1d26] hover:bg-[#232733] border border-[#2e3344] text-xs font-mono text-rose-400 rounded"
                >
                  -5
                </button>
              </div>
            </div>
          </div>

          {/* Mod adjustment input */}
          <div className="flex items-center justify-between p-2.5 bg-[#0f1117] rounded border border-[#222634]">
            <span className="text-xs text-slate-300 font-mono">Modificador Circunstancial Total:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={circumstanceMod}
                onChange={(e) => setCircumstanceMod(Number(e.target.value) || 0)}
                className="w-16 px-2 py-1 bg-[#1a1d26] border border-[#2e3344] rounded text-center font-mono text-sm text-amber-300 outline-none"
              />
              <button
                type="button"
                onClick={() => setCircumstanceMod(0)}
                className="text-[10px] text-slate-400 hover:text-slate-200 underline font-mono"
              >
                Zerar
              </button>
            </div>
          </div>

          {/* Display Result if Rolled */}
          {lastResult && (
            <div className={`p-4 rounded-lg border text-center animate-in zoom-in-95 duration-200 ${
              lastResult.isCrit
                ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                : lastResult.isFumble
                ? 'bg-rose-950/40 border-rose-600 text-rose-200'
                : 'bg-[#0f1117] border-red-900/60 text-slate-100'
            }`}>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1 flex items-center justify-center gap-1.5">
                {lastResult.isCrit && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                {lastResult.isFumble && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                <span>{lastResult.isCrit ? 'ACERTO CRÍTICO!' : lastResult.isFumble ? 'FALHA CRÍTICA!' : 'RESULTADO FINAL'}</span>
              </div>
              <div className="text-4xl font-extrabold font-mono tracking-tight my-1 text-white">
                {lastResult.result}
              </div>
              <div className="text-xs font-mono text-slate-400">
                {lastResult.diceBreakdown}
              </div>
            </div>
          )}

          {/* Action Roll Button */}
          <div className="pt-2">
            <button
              onClick={handleExecuteRoll}
              disabled={isRolling}
              className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg shadow-red-950/60 flex items-center justify-center gap-2 transition-all"
            >
              <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
              <span>{isRolling ? 'CALCULANDO ROLAGEM...' : 'ROLAR DADOS'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
