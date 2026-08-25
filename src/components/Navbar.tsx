import React from 'react';
import { User, Campaign, ThemeEffect } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { 
  ShieldAlert, 
  Dices, 
  Swords, 
  Radio, 
  Users, 
  FolderLock, 
  BookOpen, 
  Sparkles, 
  Printer, 
  ChevronDown, 
  Skull, 
  UserCheck 
} from 'lucide-react';

export interface NavbarProps {
  currentUser: User;
  users?: User[];
  onSwitchUser?: (user: User) => void;
  onSwitchRole?: (role: 'MESTRE' | 'PLAYER') => void;
  campaign?: Campaign | null;
  campaignName?: string;
  onOpenCampaignModal?: () => void;
  onToggleRollHistory?: () => void;
  onToggleCombatMode?: () => void;
  onOpenSessionControls?: () => void;
  onOpenBestiary?: () => void;
  onOpenNpcDrawer?: () => void;
  onOpenPrintModal?: () => void;
  activeView?: 'DASHBOARD' | 'SHEET' | 'SESSION_LIVE';
  currentView?: 'DASHBOARD' | 'CHARACTER_SHEET' | 'SESSION_LIVE';
  onNavigate?: (view: any) => void;
  isCombatModeActive?: boolean;
  onOpenRollModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  users = INITIAL_USERS,
  onSwitchUser,
  onSwitchRole,
  campaign,
  campaignName,
  onOpenCampaignModal,
  onToggleRollHistory,
  onToggleCombatMode,
  onOpenSessionControls,
  onOpenBestiary,
  onOpenNpcDrawer,
  onOpenPrintModal,
  activeView,
  currentView,
  onNavigate,
  isCombatModeActive = false,
  onOpenRollModal,
}) => {
  const isMaster = currentUser.role === 'MASTER' || currentUser.role === 'MESTRE';
  const effectiveUsers = (users && users.length > 0) ? users : INITIAL_USERS;

  const themeLabels: Record<string, { label: string; color: string }> = {
    NORMAL: { label: 'ATMOSFERA ESTÁVEL', color: 'text-slate-400 border-slate-700' },
    CAOS: { label: 'ANOMALIA: CAOS', color: 'text-red-400 border-red-800 bg-red-950/40 animate-pulse' },
    SALVADOR: { label: 'CAMPO: SALVADOR', color: 'text-amber-300 border-amber-600 bg-amber-950/40' },
    ALAN: { label: 'DISTORÇÃO: ALAN', color: 'text-cyan-400 border-cyan-800 bg-cyan-950/40' },
    CONVERGÊNCIA: { label: 'CONVERGÊNCIA ATIVA', color: 'text-purple-400 border-purple-800 bg-purple-950/40' },
    padrao: { label: 'ATMOSFERA PADRÃO', color: 'text-slate-400 border-slate-700' },
    caos: { label: 'ANOMALIA: CAOS', color: 'text-red-400 border-red-800 bg-red-950/40 animate-pulse' },
    salvador: { label: 'CAMPO: SALVADOR', color: 'text-amber-300 border-amber-600 bg-amber-950/40' },
    nevoa: { label: 'NÉVOA PARANORMAL', color: 'text-cyan-400 border-cyan-800 bg-cyan-950/40' },
    alerta: { label: 'ALERTA MÁXIMO', color: 'text-rose-400 border-rose-800 bg-rose-950/40' },
  };

  const currentTheme = campaign?.themeEffect || 'NORMAL';
  const themeInfo = themeLabels[currentTheme] || themeLabels.NORMAL;
  const displayName = campaign?.name || campaignName || 'MISTÉRIO DA ILHA';

  const activeNav = currentView || (activeView === 'SHEET' ? 'CHARACTER_SHEET' : 'DASHBOARD');

  const handleSwitch = (u: User) => {
    if (onSwitchUser) {
      onSwitchUser(u);
    } else if (onSwitchRole) {
      onSwitchRole(u.role === 'MASTER' || u.role === 'MESTRE' ? 'MESTRE' : 'PLAYER');
    }
  };

  const handleNavClick = (view: 'DASHBOARD' | 'CHARACTER_SHEET' | 'SESSION_LIVE') => {
    if (onNavigate) {
      if (activeView && !currentView) {
        onNavigate(view === 'CHARACTER_SHEET' ? 'SHEET' : 'DASHBOARD');
      } else {
        onNavigate(view);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0d0e12]/95 backdrop-blur-md border-b border-[#222634] px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand & Classification */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleNavClick('DASHBOARD')}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-red-950/80 border border-red-700/80 flex items-center justify-center text-red-500 shadow-sm group-hover:border-red-500 transition-colors">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs tracking-widest text-red-500 font-bold uppercase flex items-center gap-1.5">
                <span>MISTÉRIO DA ILHA</span>
                <span className="text-[9px] px-1 py-0.2 bg-red-950 text-red-400 border border-red-900 rounded font-mono">RPG</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-tight flex items-center gap-1">
                <span>ARQUIVO PARANORMAL</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 hidden sm:inline">CONFIDENCIAL</span>
              </div>
            </div>
          </button>

          {/* Campaign Selector / Badge */}
          <button
            onClick={() => onOpenCampaignModal && onOpenCampaignModal()}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#14161d] border border-[#2a2e3d] hover:border-slate-600 rounded text-xs text-slate-300 transition-colors cursor-pointer"
          >
            <FolderLock className="w-3.5 h-3.5 text-red-400" />
            <span className="font-mono text-[11px] truncate max-w-[160px]">{displayName}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {/* Theme Indicator */}
          {campaign && campaign.themeEffect && campaign.themeEffect !== 'NORMAL' && (
            <div className={`hidden lg:flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${themeInfo.color}`}>
              <Radio className="w-3 h-3 animate-spin" />
              <span>{themeInfo.label}</span>
            </div>
          )}
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Dashboard / Sheet View Nav */}
          <div className="flex items-center bg-[#14161d] p-0.5 rounded border border-[#222634]">
            <button
              onClick={() => handleNavClick('DASHBOARD')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'DASHBOARD'
                  ? 'bg-red-950/70 text-red-200 border border-red-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isMaster ? 'Mesa do Mestre' : 'Dossiê'}
            </button>
            <button
              onClick={() => handleNavClick('CHARACTER_SHEET')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'CHARACTER_SHEET'
                  ? 'bg-red-950/70 text-red-200 border border-red-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ficha Ativa
            </button>
            <button
              onClick={() => handleNavClick('SESSION_LIVE')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer hidden sm:block ${
                activeNav === 'SESSION_LIVE'
                  ? 'bg-red-950/70 text-red-200 border border-red-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sessão Ao Vivo
            </button>
          </div>

          {/* Quick Dice Roll Button */}
          <button
            onClick={() => {
              if (onOpenRollModal) onOpenRollModal();
              else if (onToggleRollHistory) onToggleRollHistory();
            }}
            title="Rolar Dados Rápidos"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#14161d] border border-[#2a2e3d] hover:border-amber-500/60 text-slate-300 rounded text-xs transition-colors cursor-pointer"
          >
            <Dices className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Dados</span>
          </button>

          {/* Export / Print Dossier */}
          <button
            onClick={() => {
              if (onOpenPrintModal) onOpenPrintModal();
              else window.print();
            }}
            title="Exportar Dossiê / Imprimir"
            className="p-1.5 bg-[#14161d] border border-[#2a2e3d] hover:border-slate-600 text-slate-300 rounded text-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {/* User Profile / Quick Switcher */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-2 py-1 bg-[#181b24] border border-[#2e3344] hover:border-red-500/60 rounded text-xs transition-colors cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center text-[9px] font-bold text-slate-200">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  currentUser?.name?.[0] || 'U'
                )}
              </div>
              <span className="max-w-[80px] sm:max-w-[110px] truncate text-slate-200 font-medium">
                {currentUser?.name || 'Agente'}
              </span>
              <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                isMaster ? 'bg-red-950 text-red-400 border border-red-900' : 'bg-blue-950 text-blue-400 border border-blue-900'
              }`}>
                {isMaster ? 'MESTRE' : 'PLAYER'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Dropdown menu for fast account switching */}
            <div className="absolute right-0 mt-1 w-64 bg-[#14161d] border border-[#2a2e3d] rounded-lg shadow-2xl p-1.5 hidden group-hover:block z-50">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#222634] mb-1">
                Alternar Acesso de Usuário
              </div>
              <div className="space-y-0.5">
                {effectiveUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSwitch(u)}
                    className={`w-full text-left flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                      u.id === currentUser?.id
                        ? 'bg-red-950/60 text-red-300 border border-red-900/50'
                        : 'hover:bg-[#1e2230] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-4 h-4 rounded-full bg-slate-700 text-[8px] flex items-center justify-center font-bold text-white shrink-0 overflow-hidden">
                        {u.avatar ? (
                          <img src={u.avatar} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          u.name[0]
                        )}
                      </div>
                      <span className="truncate">{u.name}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">
                      {u.role === 'MASTER' || u.role === 'MESTRE' ? '[MESTRE]' : '[PLAYER]'}
                    </span>
                  </button>
                ))}
              </div>
              <div className="pt-1.5 mt-1 border-t border-[#222634] text-[10px] text-slate-400 text-center font-mono">
                Segurança: Permissões protegidas no servidor
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
