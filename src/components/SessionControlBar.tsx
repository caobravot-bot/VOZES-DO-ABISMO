import React, { useState } from 'react';
import { User, CampaignSessionData } from '../types';
import { 
  Radio, 
  Send, 
  Flame, 
  Sparkles, 
  CloudFog, 
  AlertTriangle, 
  ShieldCheck, 
  Swords,
  Volume2
} from 'lucide-react';
import { triggerSessionTheme, broadcastAlert } from '../lib/api';

interface SessionControlBarProps {
  campaignId: string;
  sessionData: CampaignSessionData;
  currentUser: User;
  onOpenCombatMode: () => void;
  onThemeChange: (theme: string) => void;
}

export const SessionControlBar: React.FC<SessionControlBarProps> = ({
  campaignId,
  sessionData,
  currentUser,
  onOpenCombatMode,
  onThemeChange,
}) => {
  const [customMsg, setCustomMsg] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const isMaster = currentUser.role === 'MESTRE';

  const themes: Array<{ key: string; label: string; icon: React.ReactNode; color: string }> = [
    { key: 'padrao', label: 'Padrão (Arquivo)', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'hover:border-slate-500' },
    { key: 'caos', label: 'Caos Carmesim', icon: <Flame className="w-3.5 h-3.5 text-rose-500" />, color: 'hover:border-rose-500' },
    { key: 'salvador', label: 'Entona Sagrada', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />, color: 'hover:border-amber-400' },
    { key: 'nevoa', label: 'Névoa Espessa', icon: <CloudFog className="w-3.5 h-3.5 text-blue-300" />, color: 'hover:border-blue-400' },
    { key: 'alerta', label: 'Alerta Máximo', icon: <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />, color: 'hover:border-yellow-400' },
  ];

  const handleApplyTheme = async (themeKey: string) => {
    onThemeChange(themeKey);
    if (isMaster) {
      try {
        await triggerSessionTheme(campaignId, themeKey, currentUser);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSendBroadcast = async () => {
    if (!customMsg.trim() || !isMaster) return;
    try {
      setIsBroadcasting(true);
      await broadcastAlert(
        campaignId,
        {
          title: 'COMUNICADO DO MESTRE',
          message: customMsg.trim(),
          type: 'SITUACAO',
        },
        currentUser
      );
      setCustomMsg('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="bg-[#11131a] border border-[#222634] rounded-xl p-3 sm:p-4 shadow-xl space-y-3">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Live Session Status */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-red-950/80 border border-red-800 text-red-400 shrink-0">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold flex items-center gap-2">
              <span>CANAL DE TRANSMISSÃO DA MESA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <div className="text-xs font-mono text-slate-200">
              {sessionData.activeScene || 'Investigação em andamento no Complexo 04'}
            </div>
          </div>
        </div>

        {/* Tactical Triggers */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={onOpenCombatMode}
            className="flex-1 md:flex-initial px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs rounded-lg shadow flex items-center justify-center gap-1.5 transition-colors"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>MODO COMBATE</span>
          </button>
        </div>

      </div>

      {/* Atmospheric Theme Switcher */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1e2330]">
        <span className="text-[11px] font-mono text-slate-400">Atmosfera Visual:</span>
        {themes.map((th) => (
          <button
            key={th.key}
            onClick={() => handleApplyTheme(th.key)}
            className={`px-2.5 py-1 rounded text-xs font-mono border flex items-center gap-1.5 transition-all ${
              sessionData.theme === th.key
                ? 'bg-red-950 text-white border-red-600 font-bold shadow'
                : `bg-[#161922] text-slate-400 border-[#262b3a] ${th.color}`
            }`}
          >
            {th.icon}
            <span>{th.label}</span>
          </button>
        ))}
      </div>

      {/* Master Broadcast Dispatcher */}
      {isMaster && (
        <div className="pt-2 border-t border-[#1e2330] flex items-center gap-2">
          <input
            type="text"
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendBroadcast()}
            placeholder="Enviar alerta ou sombreador narrativo em tempo real para as telas dos jogadores..."
            className="flex-1 px-3 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] focus:border-red-500 rounded text-xs font-mono text-slate-200 outline-none"
          />
          <button
            onClick={handleSendBroadcast}
            disabled={isBroadcasting || !customMsg.trim()}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-mono font-bold rounded flex items-center gap-1 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Transmitir</span>
          </button>
        </div>
      )}

    </div>
  );
};
