import React, { useState } from 'react';
import { Campaign, Character, User, NPC, Creature } from '../types';
import { 
  FolderLock, 
  Users, 
  Plus, 
  Skull, 
  Radio, 
  ChevronRight, 
  Sparkles, 
  MoreVertical,
  Trash2,
  Copy,
  Edit,
  Folder,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';

interface DashboardProps {
  campaign: Campaign;
  characters: Character[];
  npcs: NPC[];
  creatures: Creature[];
  currentUser: User;
  onSelectCharacter: (characterId: string) => void;
  onCreateCharacter: () => void;
  onDuplicateCharacter?: (characterId: string) => void;
  onDeleteCharacterRequest?: (character: Character) => void;
  onOpenSessionView: () => void;
  onOpenCMSModal?: () => void;
  onOpenCreateNpc?: () => void;
  onOpenCreateCreature?: () => void;
  onToggleNpcReveal?: (npcId: string) => void;
  onSwitchRole: (role: 'MESTRE' | 'PLAYER') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  campaign,
  characters = [],
  npcs = [],
  creatures = [],
  currentUser,
  onSelectCharacter,
  onCreateCharacter,
  onDuplicateCharacter,
  onDeleteCharacterRequest,
  onOpenSessionView,
  onOpenCMSModal,
  onOpenCreateNpc,
  onOpenCreateCreature,
  onToggleNpcReveal,
  onSwitchRole,
}) => {
  const isMaster = currentUser.role === 'MASTER' || currentUser.role === 'MESTRE';
  const charList = characters || [];
  const [activeMenuCharId, setActiveMenuCharId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Campaign Classified Dossier Header */}
      <div className="bg-[#0D0F14] border border-[#232836] rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-800 via-rose-600 to-amber-700 opacity-90" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="stamp-confidential text-xs">
                MISTÉRIO DA ILHA // ARQUIVO ATIVO
              </span>
              <span className="text-xs font-mono text-slate-400">
                SESSÃO Nº {campaign.sessionNumber || 1} • {campaign.systemVersion || 'v2.0'}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/50 text-rose-400 border border-rose-950">
                CÓDIGO: {campaign.code}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-title-paranormal tracking-wide">
              {campaign.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-2xl leading-relaxed">
              {campaign.description}
            </p>
          </div>

          {/* Master quick action toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
            <button
              onClick={onOpenSessionView}
              className="px-4 py-2.5 bg-rose-700 hover:bg-rose-600 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-rose-950/60 flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>TERMINAL AO VIVO</span>
            </button>

            {isMaster && onOpenCMSModal && (
              <button
                onClick={onOpenCMSModal}
                className="px-4 py-2.5 bg-[#181D26] hover:bg-[#232836] border border-rose-900/60 text-rose-200 font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Folder className="w-4 h-4 text-rose-400" />
                <span>Arquivos da Ilha (CMS)</span>
              </button>
            )}

            <button
              onClick={onCreateCharacter}
              className="px-4 py-2.5 bg-[#181D26] hover:bg-[#232836] border border-[#2A2E3D] text-slate-200 font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4 text-rose-400" />
              <span>Novo Agente</span>
            </button>
          </div>
        </div>

        {/* Campaign Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-[#1E222D] text-xs font-mono">
          <div className="p-2.5 bg-[#090B0E] rounded-lg border border-[#1E222D]">
            <span className="text-slate-500 block text-[10px]">DOSSIÊS DE AGENTES</span>
            <strong className="text-slate-100 text-sm font-title-paranormal">{characters.length} Fichas</strong>
          </div>
          <div className="p-2.5 bg-[#090B0E] rounded-lg border border-[#1E222D]">
            <span className="text-slate-500 block text-[10px]">TESTEMUNHAS / NPCS</span>
            <strong className="text-sky-400 text-sm font-title-paranormal">{npcs.length} Catalogados</strong>
          </div>
          <div className="p-2.5 bg-[#090B0E] rounded-lg border border-[#1E222D]">
            <span className="text-slate-500 block text-[10px]">AMEAÇAS & BESTIÁRIO</span>
            <strong className="text-rose-400 text-sm font-title-paranormal">{creatures.length} Entidades</strong>
          </div>
          <div className="p-2.5 bg-[#090B0E] rounded-lg border border-[#1E222D]">
            <span className="text-slate-500 block text-[10px]">NÍVEL DE ACESSO</span>
            <strong className="text-amber-400 text-sm font-title-paranormal">
              {isMaster ? 'DIRETOR DA ILHA (MESTRE)' : 'INVESTIGADOR (PLAYER)'}
            </strong>
          </div>
        </div>
      </div>

      {/* Characters Index (Dossiês de Investigadores) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderLock className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold font-title-paranormal tracking-wider text-slate-200 uppercase">
              DOSSIÊS DE AGENTES SOB INVESTIGAÇÃO
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Clique no cartão para inspecionar a ficha completa
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {charList.map((char) => {
            const presence = char.presence || { aspect: 'ENTONA', colorName: 'Branca', hexColor: '#F8FAFC' };
            const hexColor = presence.hexColor || '#F8FAFC';
            const pvCurrent = char.resources?.pv?.current ?? 0;
            const pvMax = char.resources?.pv?.max || 1;
            const prCurrent = char.resources?.pr?.current ?? 0;
            const prMax = char.resources?.pr?.max || 1;
            const pvPercent = Math.min(100, Math.max(0, (pvCurrent / pvMax) * 100));
            const prPercent = Math.min(100, Math.max(0, (prCurrent / prMax) * 100));
            const isMenuOpen = activeMenuCharId === char.id;

            return (
              <div
                key={char.id}
                onClick={() => onSelectCharacter(char.id)}
                className="dossier-paper-dark rounded-xl p-5 shadow-xl cursor-pointer transition-all duration-200 group relative flex flex-col justify-between hover:border-rose-700/80"
              >
                {/* Physical Top Presence Border */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-xl opacity-90 transition-all group-hover:h-1.5"
                  style={{ backgroundColor: hexColor, boxShadow: `0 0 12px ${hexColor}40` }}
                />

                <div className="space-y-3.5">
                  {/* Header Row: Archive Code + Action Menu */}
                  <div className="flex items-center justify-between text-[11px] font-mono border-b border-[#232836] pb-2">
                    <span className="text-rose-400 font-bold tracking-wider">
                      {char.archiveCode || 'ARQ-CONFIDENCIAL'}
                    </span>
                    
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-slate-500 font-bold">GRAU {char.level || 1}</span>

                      {isMaster && (
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenuCharId(isMenuOpen ? null : char.id)}
                            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute right-0 top-6 z-20 w-44 bg-[#0D0F14] border border-[#2A2E3D] rounded-lg shadow-2xl py-1 text-xs font-mono animate-fadeIn">
                              <button
                                onClick={() => {
                                  setActiveMenuCharId(null);
                                  onSelectCharacter(char.id);
                                }}
                                className="w-full px-3 py-1.5 text-left text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                              >
                                <Edit className="w-3.5 h-3.5 text-slate-400" /> Abrir & Editar
                              </button>
                              {onDuplicateCharacter && (
                                <button
                                  onClick={() => {
                                    setActiveMenuCharId(null);
                                    onDuplicateCharacter(char.id);
                                  }}
                                  className="w-full px-3 py-1.5 text-left text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                                >
                                  <Copy className="w-3.5 h-3.5 text-slate-400" /> Duplicar Ficha
                                </button>
                              )}
                              {onDeleteCharacterRequest && (
                                <button
                                  onClick={() => {
                                    setActiveMenuCharId(null);
                                    onDeleteCharacterRequest(char);
                                  }}
                                  className="w-full px-3 py-1.5 text-left text-red-400 hover:bg-red-950/50 flex items-center gap-2 border-t border-slate-800 mt-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Excluir Dossiê
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Photo with Paperclip visual + Name & Details */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      {/* Fake metal paperclip */}
                      <div className="absolute -top-2 left-2 z-10 w-2.5 h-4 border-2 border-slate-400 rounded-full bg-slate-600/30" />
                      <div 
                        className="w-16 h-16 rounded bg-slate-900 border-2 overflow-hidden shadow"
                        style={{ borderColor: hexColor }}
                      >
                        {char.avatarUrl ? (
                          <img 
                            src={char.avatarUrl} 
                            alt={char.name} 
                            referrerPolicy="no-referrer" 
                            className="w-full h-full object-cover filter contrast-105" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono font-bold">
                            {char.name.substring(0, 2)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-extrabold text-slate-100 font-title-paranormal uppercase truncate group-hover:text-rose-400 transition-colors">
                        {char.name}
                      </h3>
                      {char.nickname && (
                        <p className="text-xs text-rose-300/80 italic truncate font-sans">
                          "{char.nickname}"
                        </p>
                      )}
                      <p className="text-xs font-mono text-slate-400 truncate mt-0.5">
                        {char.race} • {char.orientation}
                      </p>
                    </div>
                  </div>

                  {/* Presence Aura & Mark Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono">
                    <span 
                      className="px-2 py-0.5 rounded border text-[10px] font-bold"
                      style={{ 
                        borderColor: `${hexColor}70`, 
                        backgroundColor: `${hexColor}15`, 
                        color: hexColor === '#F8FAFC' ? '#F1F5F9' : hexColor 
                      }}
                    >
                      ● {presence.aspect} ({presence.colorName})
                    </span>

                    {char.mark && (
                      <span className="px-2 py-0.5 rounded bg-black/50 border border-[#232836] text-amber-300 text-[10px] font-bold">
                        {char.mark.symbol} {char.mark.type}
                      </span>
                    )}
                  </div>

                  {/* Vitals Gauges (PV & PR) */}
                  <div className="space-y-2 pt-1">
                    {/* PV */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-red-400 font-bold">PV: {char.resources.pv.current} / {char.resources.pv.max}</span>
                        <span className="text-slate-500">{Math.round(pvPercent)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#090B0E] rounded-full overflow-hidden border border-red-950">
                        <div className="h-full bg-red-600 rounded-full transition-all" style={{ width: `${pvPercent}%` }} />
                      </div>
                    </div>

                    {/* PR */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-sky-400 font-bold">PR: {char.resources.pr.current} / {char.resources.pr.max}</span>
                        <span className="text-slate-500">{Math.round(prPercent)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#090B0E] rounded-full overflow-hidden border border-sky-950">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ width: `${prPercent}%`, backgroundColor: hexColor === '#F8FAFC' ? '#38BDF8' : hexColor }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-[#1E222D] flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-slate-100">
                  <span className="font-bold">ABRIR DOSSIÊ COMPLETO</span>
                  <ChevronRight className="w-4 h-4 text-rose-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NPCs & Witnesses Section */}
      {npcs.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-[#1E222D]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold font-title-paranormal tracking-wider text-slate-200 uppercase">
                TESTEMUNHAS & CONTATOS DE CAMPO ({npcs.length})
              </h2>
            </div>
            {isMaster && onOpenCreateNpc && (
              <button
                onClick={onOpenCreateNpc}
                className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Contato
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {npcs.map((npc) => (
              <div
                key={npc.id}
                className="p-3.5 bg-[#10131A] border border-[#232836] rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden shrink-0">
                    {npc.avatarUrl ? (
                      <img src={npc.avatarUrl} alt={npc.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                        {npc.name.substring(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-100 font-title-paranormal truncate">{npc.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{npc.occupation || npc.location}</p>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-sky-300">
                      {npc.attitude} • {npc.dangerLevel}
                    </span>
                  </div>
                </div>

                {isMaster && onToggleNpcReveal && (
                  <button
                    onClick={() => onToggleNpcReveal(npc.id)}
                    title={npc.revealedToPlayers ? 'Visível aos Jogadores (Clique para Ocultar)' : 'Oculto aos Jogadores (Clique para Revelar)'}
                    className={`p-2 rounded-lg border transition-colors ${
                      npc.revealedToPlayers
                        ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                        : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {npc.revealedToPlayers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Role Demonstration Switcher Card */}
      <div className="p-4 bg-[#10131A] border border-[#232836] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">
            Você está operando como: <strong className="text-rose-400 uppercase">{currentUser.role} ({currentUser.name})</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Alternar papel:</span>
          <button
            onClick={() => onSwitchRole('PLAYER')}
            className={`px-3 py-1 rounded border transition-colors ${
              currentUser.role === 'PLAYER'
                ? 'bg-rose-700 text-white font-bold border-rose-600'
                : 'bg-[#181D26] text-slate-400 hover:text-white border-[#2A2E3D]'
            }`}
          >
            Investigador (Player)
          </button>
          <button
            onClick={() => onSwitchRole('MESTRE')}
            className={`px-3 py-1 rounded border transition-colors ${
              currentUser.role === 'MESTRE'
                ? 'bg-rose-700 text-white font-bold border-rose-600'
                : 'bg-[#181D26] text-slate-400 hover:text-white border-[#2A2E3D]'
            }`}
          >
            Mestre (Diretor)
          </button>
        </div>
      </div>
    </div>
  );
};
