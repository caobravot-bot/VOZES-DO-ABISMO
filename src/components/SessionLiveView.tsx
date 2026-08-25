import React, { useState } from 'react';
import { Campaign, Character, NPC, Creature, User, CampaignSessionData } from '../types';
import { SessionControlBar } from './SessionControlBar';
import { NPCList } from './NPCList';
import { CreatureList } from './CreatureList';
import { 
  Radio, 
  ChevronLeft, 
  Users, 
  Skull, 
  ShieldAlert, 
  Heart, 
  Zap, 
  Swords, 
  Dices, 
  Activity,
  Plus
} from 'lucide-react';

interface SessionLiveViewProps {
  campaign: Campaign;
  characters: Character[];
  npcs: NPC[];
  creatures: Creature[];
  sessionData: CampaignSessionData;
  currentUser: User;
  onBack: () => void;
  onSelectCharacter: (id: string) => void;
  onUpdateSessionData: (sessionData: CampaignSessionData) => void;
  onUpdateNpc: (npc: NPC) => void;
  onDeleteNpc: (id: string) => void;
  onCreateNpc: (npc: Partial<NPC>) => void;
  onUpdateCreature: (creature: Creature) => void;
  onDeleteCreature: (id: string) => void;
  onCreateCreature: (creature: Partial<Creature>) => void;
  onOpenCombatMode: () => void;
  onThemeChange: (theme: string) => void;
  onOpenRoll: (rollName: string, formula: string, type: 'ATAQUE' | 'DANO') => void;
}

export const SessionLiveView: React.FC<SessionLiveViewProps> = ({
  campaign,
  characters,
  npcs,
  creatures,
  sessionData,
  currentUser,
  onBack,
  onSelectCharacter,
  onUpdateSessionData,
  onUpdateNpc,
  onDeleteNpc,
  onCreateNpc,
  onUpdateCreature,
  onDeleteCreature,
  onCreateCreature,
  onOpenCombatMode,
  onThemeChange,
  onOpenRoll,
}) => {
  const [activeSessionTab, setActiveSessionTab] = useState<'PARTY' | 'NPCS' | 'BESTIARIO'>('PARTY');
  const isMaster = currentUser.role === 'MESTRE';

  return (
    <div className="space-y-5 pb-12">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14161d] hover:bg-[#1e2230] border border-[#222634] rounded-lg text-xs font-mono text-slate-300 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-red-500" />
          <span>Voltar ao Dossiê Principal</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            SESSÃO CONECTADA EM TEMPO REAL
          </span>
        </div>
      </div>

      {/* Realtime Session Controller */}
      <SessionControlBar
        campaignId={campaign.id}
        sessionData={sessionData}
        currentUser={currentUser}
        onOpenCombatMode={onOpenCombatMode}
        onThemeChange={onThemeChange}
      />

      {/* Tabs for Live Session Manager */}
      <div className="flex items-center gap-1 border-b border-[#222634] pb-1">
        <button
          onClick={() => setActiveSessionTab('PARTY')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-xs font-mono transition-all border-t border-x ${
            activeSessionTab === 'PARTY'
              ? 'bg-[#14161d] text-white border-[#2e3344] font-bold border-b-2 border-b-red-500 shadow-md'
              : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span>VITAIS DO GRUPO ({characters.length})</span>
        </button>

        <button
          onClick={() => setActiveSessionTab('NPCS')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-xs font-mono transition-all border-t border-x ${
            activeSessionTab === 'NPCS'
              ? 'bg-[#14161d] text-white border-[#2e3344] font-bold border-b-2 border-b-red-500 shadow-md'
              : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>NPCS & TESTEMUNHAS ({npcs.length})</span>
        </button>

        <button
          onClick={() => setActiveSessionTab('BESTIARIO')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-xs font-mono transition-all border-t border-x ${
            activeSessionTab === 'BESTIARIO'
              ? 'bg-[#14161d] text-white border-[#2e3344] font-bold border-b-2 border-b-red-500 shadow-md'
              : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Skull className="w-3.5 h-3.5 text-rose-500" />
          <span>BESTIÁRIO & ENTIDADES ({creatures.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeSessionTab === 'PARTY' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Monitoramento tático de todos os investigadores em campo:</span>
            <span>Atualizado instantaneamente</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {characters.map((char) => {
              const hexColor = char.presence?.hexColor || '#F8FAFC';
              const pvPercent = Math.min(100, Math.max(0, (char.resources.pv.current / (char.resources.pv.max || 1)) * 100));
              const prPercent = Math.min(100, Math.max(0, (char.resources.pr.current / (char.resources.pr.max || 1)) * 100));

              return (
                <div
                  key={char.id}
                  onClick={() => onSelectCharacter(char.id)}
                  className="p-4 bg-[#14161d] border border-[#222634] hover:border-red-600/60 rounded-xl space-y-3 shadow-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded bg-slate-900 border overflow-hidden shrink-0 flex items-center justify-center font-mono font-bold text-xs"
                        style={{ borderColor: hexColor }}
                      >
                        {char.avatarUrl ? (
                          <img src={char.avatarUrl} alt={char.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          char.name.substring(0, 2)
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white font-mono uppercase">
                          {char.name}
                        </h3>
                        <div className="text-[11px] font-mono text-slate-400">
                          {char.race} • {char.orientation} • Defesa {typeof char.resources.defense === 'object' ? ((char.resources.defense as any)?.total ?? (char.resources.defense as any)?.base ?? 14) : (char.resources.defense ?? 14)}
                        </div>
                      </div>
                    </div>

                    <span 
                      className="px-2 py-0.5 rounded border text-[10px] font-mono"
                      style={{ borderColor: `${hexColor}60`, color: hexColor }}
                    >
                      {char.presence?.aspect}
                    </span>
                  </div>

                  {/* Vitals */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 bg-[#0d0e12] rounded border border-[#222634]">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-rose-400">VIDA (PV)</span>
                        <strong className="text-white">{char.resources.pv.current}/{char.resources.pv.max}</strong>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-rose-600 rounded-full" style={{ width: `${pvPercent}%` }} />
                      </div>
                    </div>

                    <div className="p-2 bg-[#0d0e12] rounded border border-[#222634]">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-blue-400">PRESENÇA (PR)</span>
                        <strong className="text-white">{char.resources.pr.current}/{char.resources.pr.max}</strong>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ width: `${prPercent}%`, backgroundColor: hexColor === '#F8FAFC' ? '#60A5FA' : hexColor }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Conditions */}
                  {char.conditions && char.conditions.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      {char.conditions.map((c) => (
                        <span key={c.id} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSessionTab === 'NPCS' && (
        <NPCList
          npcs={npcs}
          onUpdateNpc={onUpdateNpc}
          onDeleteNpc={onDeleteNpc}
          onCreateNpc={onCreateNpc}
          isMaster={isMaster}
        />
      )}

      {activeSessionTab === 'BESTIARIO' && (
        <CreatureList
          creatures={creatures}
          onOpenRoll={onOpenRoll}
          onUpdateCreature={onUpdateCreature}
          onDeleteCreature={onDeleteCreature}
          onCreateCreature={onCreateCreature}
          isMaster={isMaster}
        />
      )}

    </div>
  );
};
