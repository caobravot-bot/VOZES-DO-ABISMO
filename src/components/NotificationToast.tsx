import React from 'react';
import { SessionEvent } from '../types';
import { ShieldAlert, Radio, Gift, Sparkles, X, Dices } from 'lucide-react';

interface NotificationToastProps {
  event: SessionEvent | null;
  onDismiss: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ event, onDismiss }) => {
  if (!event) return null;

  const isWhisper = event.type === 'WHISPER';
  const isItem = event.type === 'ITEM_GRANTED';
  const isAbility = event.type === 'ABILITY_UNLOCKED';
  const isRoll = event.type === 'ROLL';
  const isTheme = event.type === 'THEME_TRIGGER';

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 rounded-lg shadow-2xl border backdrop-blur-md ${
        isWhisper
          ? 'bg-purple-950/90 border-purple-600/80 text-purple-200 shadow-purple-950/50'
          : isItem
          ? 'bg-amber-950/90 border-amber-500/80 text-amber-200 shadow-amber-950/50'
          : isAbility
          ? 'bg-blue-950/90 border-blue-500/80 text-blue-200 shadow-blue-950/50'
          : isTheme
          ? 'bg-red-950/90 border-red-600/80 text-red-200 shadow-red-950/50 animate-pulse'
          : 'bg-[#14161d]/95 border-red-800/80 text-slate-200 shadow-black/80'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-black/40 border border-white/10 shrink-0">
              {isWhisper && <Radio className="w-4 h-4 text-purple-400" />}
              {isItem && <Gift className="w-4 h-4 text-amber-400" />}
              {isAbility && <Sparkles className="w-4 h-4 text-blue-400" />}
              {isRoll && <Dices className="w-4 h-4 text-amber-400" />}
              {(!isWhisper && !isItem && !isAbility && !isRoll) && <ShieldAlert className="w-4 h-4 text-red-500" />}
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-wider uppercase text-white/70">
                {event.title}
              </div>
              <div className="text-xs font-semibold text-white mt-0.5">
                {event.message}
              </div>
              {event.targetCharacterName && (
                <div className="text-[10px] font-mono text-white/60 mt-1">
                  Destinatário: <span className="text-white font-medium">{event.targetCharacterName}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 text-white/50 hover:text-white rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
