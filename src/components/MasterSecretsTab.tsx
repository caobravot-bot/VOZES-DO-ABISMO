import React from 'react';
import { MasterSecrets } from '../types';
import { ShieldAlert, Lock, AlertTriangle, Skull, Flame, FileWarning } from 'lucide-react';

interface MasterSecretsTabProps {
  secrets?: MasterSecrets;
  onUpdateSecrets: (updated: Partial<MasterSecrets>) => void;
  isMaster: boolean;
}

export const MasterSecretsTab: React.FC<MasterSecretsTabProps> = ({
  secrets,
  onUpdateSecrets,
  isMaster,
}) => {
  if (!isMaster) {
    return (
      <div className="p-12 text-center bg-[#110c10] border border-rose-950 rounded-xl space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-950/60 border border-rose-800 flex items-center justify-center text-rose-500">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold font-mono text-rose-400 uppercase tracking-wider">
          ACESSO NEGADO // NÍVEL DE SIGILO ULTRASECRETO
        </h3>
        <p className="text-xs text-slate-500 font-mono max-w-md mx-auto">
          Este módulo contém os arquivos confidenciais do Mestre da Campanha e não é transmitido ao terminal de agentes de campo.
        </p>
      </div>
    );
  }

  const data = secrets || {
    secretNotes: '',
    trueOrigin: '',
    islandConnection: '',
    narrativeTriggers: [],
    futureEvents: '',
    activeCurses: [],
  };

  return (
    <div className="space-y-4">
      
      {/* High-Security Warning Banner */}
      <div className="p-4 bg-rose-950/20 border-2 border-rose-800/80 rounded-xl space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-400 font-bold font-mono text-xs uppercase tracking-widest">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>TERMINAL RESTRITO DO MESTRE DA CAMPANHA</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700">
            SIGILO NÍVEL 5 (OMISSO PARA PLAYERS)
          </span>
        </div>
        <p className="text-xs text-rose-200/80 font-mono">
          Os dados inseridos nesta aba são filtrados e higienizados na API de backend. O jogador autenticado NÃO recebe estes campos na rede.
        </p>
      </div>

      {/* Grid of Classified Lore */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Verdadeira Origem */}
        <div className="p-4 bg-[#14161d] border border-rose-900/60 rounded-xl space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-300 uppercase">
            <Skull className="w-4 h-4 text-rose-400" />
            <span>Verdadeira Origem / Identidade Oculta</span>
          </div>
          <textarea
            value={data.trueOrigin || ''}
            onChange={(e) => onUpdateSecrets({ trueOrigin: e.target.value })}
            rows={4}
            placeholder="A verdade sobre a linhagem, clonagem, possessão ou memórias falsas implantadas..."
            className="w-full p-2.5 bg-[#0d0e12] border border-rose-900/40 rounded text-xs font-mono text-rose-100 outline-none"
          />
        </div>

        {/* Vínculo Secreto com a Ilha */}
        <div className="p-4 bg-[#14161d] border border-rose-900/60 rounded-xl space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-300 uppercase">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Relação Secreta com a Ilha & Entidades</span>
          </div>
          <textarea
            value={data.islandConnection || ''}
            onChange={(e) => onUpdateSecrets({ islandConnection: e.target.value })}
            rows={4}
            placeholder="Por que a Ilha chamou esse agente? Qual entidade está observando seus passos..."
            className="w-full p-2.5 bg-[#0d0e12] border border-rose-900/40 rounded text-xs font-mono text-rose-100 outline-none"
          />
        </div>

      </div>

      {/* Acontecimentos Futuros & Gatilhos Narrativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Futuro Planejado */}
        <div className="p-4 bg-[#14161d] border border-[#222634] rounded-xl space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase">
            <FileWarning className="w-4 h-4 text-amber-400" />
            <span>Acontecimentos Futuros Planejados</span>
          </div>
          <textarea
            value={data.futureEvents || ''}
            onChange={(e) => onUpdateSecrets({ futureEvents: e.target.value })}
            rows={4}
            placeholder="Eventos de ruptura na história, encontros fatais e revelações dramáticas..."
            className="w-full p-2.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-200 outline-none"
          />
        </div>

        {/* Notas Gerais do Mestre */}
        <div className="p-4 bg-[#14161d] border border-[#222634] rounded-xl space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Anotações Livres do Mestre</span>
          </div>
          <textarea
            value={data.secretNotes || ''}
            onChange={(e) => onUpdateSecrets({ secretNotes: e.target.value })}
            rows={4}
            placeholder="Lembretes táticos sobre vulnerabilidades, acordos fora da mesa..."
            className="w-full p-2.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-200 outline-none"
          />
        </div>

      </div>

    </div>
  );
};
