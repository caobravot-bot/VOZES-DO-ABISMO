import React from 'react';
import { Character, User } from '../types';
import { 
  FileText, 
  Sparkles, 
  Sun, 
  Moon, 
  Star, 
  Eye, 
  Crown, 
  Bird, 
  Edit3, 
  Activity,
  Shield,
  Layers
} from 'lucide-react';

interface CharacterHeaderProps {
  character: Character;
  currentUser: User;
  onOpenEditModal: () => void;
  autosaveStatus: 'IDLE' | 'SAVING' | 'SAVED' | 'ERROR';
}

export const CharacterHeader: React.FC<CharacterHeaderProps> = ({
  character,
  currentUser,
  onOpenEditModal,
  autosaveStatus,
}) => {
  const presence = character.presence || {
    aspect: 'ENTONA',
    colorName: 'Branca',
    hexColor: '#F8FAFC',
    level: 1,
    stage: 'Desperto',
  };

  const mark = character.mark || {
    type: 'SOL',
    symbol: '☀',
    concept: 'MATÉRIA',
    stage: 'Grau I',
    revealed: true,
  };

  const markIcons: Record<string, React.ReactNode> = {
    SOL: <Sun className="w-4 h-4 text-amber-400" />,
    LUA: <Moon className="w-4 h-4 text-blue-300" />,
    ESTRELA: <Star className="w-4 h-4 text-cyan-300" />,
    OLHO: <Eye className="w-4 h-4 text-emerald-400" />,
    COROA: <Crown className="w-4 h-4 text-yellow-400" />,
    CORUJA: <Bird className="w-4 h-4 text-slate-300" />,
  };

  const hexColor = presence.hexColor || '#F8FAFC';

  return (
    <div className="relative bg-[#14161d] border border-[#222634] rounded-xl p-4 sm:p-6 shadow-xl overflow-hidden">
      
      {/* Dynamic Subtle Presence Ambient Top Glow */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-80"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${hexColor} 50%, transparent 100%)`,
          boxShadow: `0 0 16px ${hexColor}60`,
        }}
      />

      <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6">
        
        {/* Character Avatar / Photo with Presence Ring */}
        <div className="relative group shrink-0 mx-auto md:mx-0">
          <div 
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-slate-900 border-2 transition-all duration-300"
            style={{
              borderColor: hexColor,
              boxShadow: `0 0 18px ${hexColor}25`,
            }}
          >
            {character.avatarUrl ? (
              <img
                src={character.avatarUrl}
                alt={character.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale-20 contrast-110 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-2xl font-bold">
                {character.name.substring(0, 2)}
              </div>
            )}
          </div>

          <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 bg-[#0b0c10] border border-[#2a2e3d] rounded text-[10px] font-mono text-slate-300 shadow">
            NV {character.level}
          </div>
        </div>

        {/* Dossier Metadata & Identity */}
        <div className="flex-1 w-full space-y-2.5">
          
          {/* Classification & Code */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#222634] pb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase bg-red-950/60 px-2 py-0.5 rounded border border-red-900/60">
                {character.classification || 'CONFIDENCIAL'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {character.archiveCode || 'ARQ-XXXX'}
              </span>
            </div>

            {/* Autosave Status */}
            <div className="flex items-center gap-2">
              {autosaveStatus === 'SAVING' && (
                <span className="text-[10px] font-mono text-amber-400 animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  Salvando...
                </span>
              )}
              {autosaveStatus === 'SAVED' && (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  ✓ Salvo
                </span>
              )}
              {autosaveStatus === 'ERROR' && (
                <span className="text-[10px] font-mono text-rose-400">
                  ⚠ Erro ao salvar
                </span>
              )}

              <button
                onClick={onOpenEditModal}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#1c202c] hover:bg-[#252b3b] border border-[#2e3344] hover:border-slate-500 text-slate-300 rounded text-xs font-medium transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                <span>Editar Dossiê</span>
              </button>
            </div>
          </div>

          {/* Name & Nickname */}
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase font-mono">
                {character.name}
              </h1>
              {character.nickname && (
                <span className="text-sm font-medium italic text-slate-400">
                  "{character.nickname}"
                </span>
              )}
            </div>

            {character.statusPhrase && (
              <p className="text-xs text-slate-300 italic mt-0.5">
                "{character.statusPhrase}"
              </p>
            )}
          </div>

          {/* Biometrics & Attributes Line */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400 pt-1">
            <div><span className="text-slate-500">Raça:</span> <strong className="text-slate-200">{character.race}</strong></div>
            <div><span className="text-slate-500">Idade:</span> <strong className="text-slate-200">{character.age} anos</strong></div>
            <div><span className="text-slate-500">Altura:</span> <strong className="text-slate-200">{character.height}</strong></div>
            <div><span className="text-slate-500">Gênero:</span> <strong className="text-slate-200">{character.gender}</strong></div>
            <div><span className="text-slate-500">Função:</span> <strong className="text-slate-200">{character.orientation}</strong></div>
          </div>

          {/* Presence & Mark Badges (Dynamic Accent!) */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            
            {/* Presence Badge */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10121a] border text-xs font-mono transition-all"
              style={{
                borderColor: `${hexColor}50`,
                boxShadow: `0 0 8px ${hexColor}15`,
              }}
            >
              <span 
                className="w-2 h-2 rounded-full shrink-0" 
                style={{ backgroundColor: hexColor, boxShadow: `0 0 6px ${hexColor}` }}
              />
              <span className="text-slate-400">PRESENÇA:</span>
              <strong style={{ color: hexColor }}>
                {presence.aspect} — {presence.colorName}
              </strong>
            </div>

            {/* Mark Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10121a] border border-[#2a2e3d] text-xs font-mono">
              <span className="shrink-0">{markIcons[mark.type] || <Sun className="w-4 h-4 text-amber-400" />}</span>
              <span className="text-slate-400">MARCA:</span>
              <strong className="text-slate-200">
                {mark.symbol} {mark.type} {mark.concept ? `(${mark.concept})` : ''}
              </strong>
            </div>

            {/* Active Conditions Count */}
            {character.conditions && character.conditions.length > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                <span>{character.conditions.length} CONDIÇÃO ATIVA</span>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
