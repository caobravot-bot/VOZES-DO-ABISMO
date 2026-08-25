import React from 'react';
import { MarkData, MarkType } from '../types';
import { Sun, Moon, Star, Eye, Crown, Bird, Lock, Unlock, ShieldAlert, Sparkles } from 'lucide-react';

interface MarksTabProps {
  mark?: MarkData;
  onUpdateMark: (updated: Partial<MarkData>) => void;
  onToggleReveal: () => void;
  isMaster?: boolean;
}

export const MarksTab: React.FC<MarksTabProps> = ({
  mark,
  onUpdateMark,
  onToggleReveal,
  isMaster = false,
}) => {
  if (!mark) {
    return (
      <div className="p-8 text-center bg-[#14161d] border border-[#222634] rounded-xl text-slate-500 font-mono text-xs">
        Nenhuma Marca Sobrenatural gravada no agente.
      </div>
    );
  }

  const markIcons: Record<MarkType, React.ReactNode> = {
    SOL: <Sun className="w-8 h-8 text-amber-400" />,
    LUA: <Moon className="w-8 h-8 text-blue-300" />,
    ESTRELA: <Star className="w-8 h-8 text-cyan-300" />,
    OLHO: <Eye className="w-8 h-8 text-emerald-400" />,
    COROA: <Crown className="w-8 h-8 text-yellow-400" />,
    CORUJA: <Bird className="w-8 h-8 text-slate-300" />,
  };

  const markTypesList: Array<{ type: MarkType; label: string; concept: string; symbol: string }> = [
    { type: 'SOL', label: 'Marca do Sol', concept: 'Matéria / Calor / Criação', symbol: '☀' },
    { type: 'LUA', label: 'Marca da Lua', concept: 'Fluidez / Ilusão / Maré', symbol: '🌙' },
    { type: 'ESTRELA', label: 'Marca da Estrela', concept: 'Destino / Cosmos / Luz', symbol: '⭐' },
    { type: 'OLHO', label: 'Marca do Olho', concept: 'Verdade / Visão / Revelação', symbol: '👁' },
    { type: 'COROA', label: 'Marca da Coroa', concept: 'Comando / Vontade / Soberania', symbol: '👑' },
    { type: 'CORUJA', label: 'Marca da Coruja', concept: 'Conhecimento / Silêncio / Vigília', symbol: '🦉' },
  ];

  return (
    <div className="space-y-4">
      
      {/* Active Mark Highlight Card */}
      <div className="bg-[#14161d] border border-[#222634] rounded-xl p-5 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#222634] pb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#0e1017] border border-[#2a2e3d] shadow-inner flex items-center justify-center">
              {markIcons[mark.type] || <Sun className="w-8 h-8 text-amber-400" />}
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase flex items-center gap-2">
                <span>ESTIGMA SOBRENATURAL</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">ESTÁGIO: {mark.stage}</span>
              </div>
              <h2 className="text-xl font-extrabold text-white uppercase font-mono tracking-tight flex items-center gap-2">
                <span>{mark.symbol} MARCA DO {mark.type}</span>
              </h2>
              <div className="text-xs font-mono text-slate-400 mt-0.5">
                Conceito Universal: <strong className="text-amber-300">{mark.concept}</strong>
              </div>
            </div>
          </div>

          {/* Master Controls */}
          {isMaster && (
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleReveal}
                className={`px-3 py-1.5 rounded text-xs font-mono border flex items-center gap-1.5 transition-colors ${
                  mark.revealed
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                    : 'bg-rose-950/60 text-rose-300 border-rose-800'
                }`}
              >
                {mark.revealed ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{mark.revealed ? 'Marca Revelada' : 'Marca Oculta (Player não vê)'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Mark Lore & Powers */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-mono text-slate-400 uppercase font-bold mb-1">
              Registro & Descrição Fenomenológica
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {mark.description}
            </p>
          </div>

          {/* Granted Powers */}
          {mark.powers && mark.powers.length > 0 && (
            <div>
              <h3 className="text-xs font-mono text-amber-400 uppercase font-bold mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Poderes Concedidos pelo Estigma</span>
              </h3>
              <div className="space-y-1.5">
                {(mark.powers || []).map((pow, i) => (
                  <div key={i} className="p-2.5 bg-[#0d0e12] border border-[#222634] rounded text-xs font-mono text-slate-200">
                    {pow}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pact & Consequences */}
          {mark.restrictions && (
            <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs font-mono space-y-1">
              <div className="text-amber-300 font-bold uppercase text-[10px]">
                Preço / Restrições do Pacto com o Estigma
              </div>
              <p className="text-amber-200/90 text-xs">
                {mark.restrictions}
              </p>
            </div>
          )}
        </div>

        {/* Master stage switcher */}
        {isMaster && (
          <div className="mt-4 pt-3 border-t border-[#222634] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-slate-400">Alterar Estágio da Marca:</span>
            <div className="flex items-center gap-1">
              {['Grau I', 'Grau II', 'Grau III', 'Grau IV', 'Despertar Total'].map((stg) => (
                <button
                  key={stg}
                  onClick={() => onUpdateMark({ stage: stg })}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    mark.stage === stg
                      ? 'bg-amber-600 text-slate-950 font-bold'
                      : 'bg-[#1c202c] text-slate-400 hover:text-white border border-[#2e3344]'
                  }`}
                >
                  {stg}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Overview of The 6 Sacred Marks of The Island */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
          O Panteão das 6 Marcas da Ilha
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {markTypesList.map((m) => {
            const isCurrent = mark.type === m.type;

            return (
              <div
                key={m.type}
                onClick={() => {
                  if (isMaster) {
                    onUpdateMark({
                      type: m.type,
                      concept: m.concept.split('/')[0].trim(),
                      symbol: m.symbol,
                    });
                  }
                }}
                className={`p-3 rounded-xl border text-center space-y-1.5 transition-all ${
                  isCurrent
                    ? 'bg-[#1e2333] border-amber-500 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-[#14161d] border-[#222634] hover:border-slate-600'
                } ${isMaster ? 'cursor-pointer' : ''}`}
              >
                <div className="text-xl">{m.symbol}</div>
                <div className="text-xs font-bold text-slate-100 font-mono">{m.type}</div>
                <div className="text-[10px] font-mono text-slate-400 truncate">{m.concept}</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
