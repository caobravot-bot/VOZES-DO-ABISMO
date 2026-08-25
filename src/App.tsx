import React, { useState, useEffect } from 'react';
import { 
  Campaign, 
  Character, 
  User, 
  NPC, 
  Creature, 
  CampaignSessionData, 
  NotificationAlert,
  Ability,
  Ritual
} from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CharacterSheetView } from './components/CharacterSheetView';
import { SessionLiveView } from './components/SessionLiveView';
import { NotificationToast } from './components/NotificationToast';
import { RollModal } from './components/RollModal';
import { CharacterCreationWizard } from './components/CharacterCreationWizard';
import { DeleteCharacterModal } from './components/DeleteCharacterModal';
import { MasterCMSModal } from './components/MasterCMSModal';
import { 
  fetchCampaigns, 
  fetchCharacters, 
  fetchNPCs, 
  fetchCreatures, 
  fetchSessionData,
  createCharacter,
  deleteCharacter,
  updateCharacter,
  duplicateCharacter,
  subscribeToCampaignEvents
} from './lib/api';
import { initialCampaigns, initialCharacters, initialNPCs, initialCreatures, INITIAL_USERS } from './data/mockData';

export type AppView = 'DASHBOARD' | 'CHARACTER_SHEET' | 'SESSION_LIVE';

export default function App() {
  // Authentication & Current User State
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);

  // Main Campaign State
  const [campaign, setCampaign] = useState<Campaign>(initialCampaigns[0]);
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [npcs, setNpcs] = useState<NPC[]>(initialNPCs);
  const [creatures, setCreatures] = useState<Creature[]>(initialCreatures);
  const [sessionData, setSessionData] = useState<CampaignSessionData>({
    activeScene: 'Farol das Lamentações - Investigação Noturna',
    theme: 'padrao',
    round: 1,
  });

  // Routing State
  const [currentView, setCurrentView] = useState<AppView>('DASHBOARD');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(initialCharacters[0]?.id || 'char-takada-01');

  // Modals & Overlays
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isCMSModalOpen, setIsCMSModalOpen] = useState(false);
  const [deletingCharacter, setDeletingCharacter] = useState<Character | null>(null);

  // Real-time alerts & toasts
  const [notifications, setNotifications] = useState<NotificationAlert[]>([]);

  // Global Fast Roll Modal
  const [isGlobalRollOpen, setIsGlobalRollOpen] = useState(false);
  const [globalRollConfig, setGlobalRollConfig] = useState<{
    name: string;
    formula: string;
    type: 'PERÍCIA' | 'ATAQUE' | 'DANO' | 'RITUAL' | 'LIVRE';
  }>({
    name: 'Rolagem Geral de Dados',
    formula: '1d20',
    type: 'LIVRE',
  });

  // Initial Data Fetch
  useEffect(() => {
    async function loadData() {
      try {
        const [camps, chars, npcsList, beasts, sess] = await Promise.all([
          fetchCampaigns(currentUser),
          fetchCharacters(currentUser.campaignId, currentUser),
          fetchNPCs(currentUser.campaignId, currentUser),
          fetchCreatures(currentUser.campaignId, currentUser),
          fetchSessionData(currentUser.campaignId, currentUser),
        ]);

        if (camps && camps.length > 0) setCampaign(camps[0]);
        if (chars && chars.length > 0) {
          setCharacters(chars);
          setSelectedCharacterId((prev) => (chars.some((c) => c.id === prev) ? prev : chars[0].id));
        }
        if (npcsList && npcsList.length > 0) setNpcs(npcsList);
        if (beasts && beasts.length > 0) setCreatures(beasts);
        if (sess) setSessionData(sess);
      } catch (err) {
        console.warn('Backend loading in fallback mode, using local state.', err);
      }
    }

    loadData();
  }, [currentUser.id, currentUser.role, currentUser.campaignId]);

  // Realtime Events SSE Subscription
  useEffect(() => {
    const unsub = subscribeToCampaignEvents(
      currentUser.campaignId,
      (event) => {
        if (event.type === 'ALERT' && event.data) {
          const alertItem: NotificationAlert = {
            id: `notif-${Date.now()}`,
            title: event.data.title || 'COMUNICADO DA ILHA',
            message: event.data.message || '',
            type: event.data.type || 'SITUACAO',
            timestamp: new Date().toISOString(),
          };
          setNotifications((prev) => [alertItem, ...prev]);
        }

        if (event.type === 'THEME_CHANGE' && event.data?.theme) {
          setSessionData((prev) => ({ ...prev, theme: event.data.theme }));
        }

        if (event.type === 'CHARACTER_UPDATE' && event.data) {
          setCharacters((prev) =>
            prev.map((c) => (c.id === event.data.id ? { ...c, ...event.data } : c))
          );
        }
      },
      () => {
        // Silent recovery
      }
    );

    return () => {
      unsub();
    };
  }, [currentUser.campaignId]);

  // Apply Atmospheric Theme class to root container
  const themeClass = sessionData.theme && sessionData.theme !== 'padrao' ? `theme-${sessionData.theme}` : '';

  // Role toggle switcher
  const handleSwitchRole = (newRole: 'MESTRE' | 'PLAYER') => {
    if (newRole === 'MESTRE') {
      setCurrentUser(INITIAL_USERS[0]);
    } else {
      setCurrentUser(INITIAL_USERS[1]);
    }
  };

  // Character Wizard Creation Handler
  const handleSaveCreatedCharacter = async (newCharData: Partial<Character>) => {
    try {
      const created = await createCharacter(newCharData, currentUser);
      setCharacters((prev) => [created, ...prev]);
      setSelectedCharacterId(created.id);
      setIsWizardOpen(false);
      setCurrentView('CHARACTER_SHEET');
    } catch (err) {
      console.error('Erro ao registrar novo personagem', err);
    }
  };

  // Duplicate Character Handler
  const handleDuplicateCharacter = async (charId: string) => {
    try {
      const dup = await duplicateCharacter(charId, currentUser);
      setCharacters((prev) => [dup, ...prev]);
      setSelectedCharacterId(dup.id);
      setCurrentView('CHARACTER_SHEET');
    } catch (err) {
      console.error('Erro ao duplicar ficha', err);
    }
  };

  // Delete Character Execution
  const handleConfirmDeleteCharacter = async () => {
    if (!deletingCharacter) return;
    try {
      await deleteCharacter(deletingCharacter.id, currentUser);
      const remaining = characters.filter((c) => c.id !== deletingCharacter.id);
      setCharacters(remaining);
      if (selectedCharacterId === deletingCharacter.id) {
        setSelectedCharacterId(remaining[0]?.id || '');
        setCurrentView('DASHBOARD');
      }
      setDeletingCharacter(null);
    } catch (err) {
      console.error('Erro ao incinerar dossiê', err);
    }
  };

  // Grant CMS items/abilities/rituals to character
  const handleGrantAbilityToChar = async (charId: string, ability: Ability) => {
    const target = characters.find((c) => c.id === charId);
    if (!target) return;
    const newAb: Ability = {
      ...ability,
      id: `ab-${Date.now()}`,
    };
    const updated: Character = {
      ...target,
      abilities: [...(target.abilities || []), newAb],
    };
    await updateCharacter(target.id, updated, currentUser);
    setCharacters((prev) => prev.map((c) => (c.id === target.id ? updated : c)));
  };

  const handleGrantRitualToChar = async (charId: string, ritual: Ritual) => {
    const target = characters.find((c) => c.id === charId);
    if (!target) return;
    const newRit: Ritual = {
      ...ritual,
      id: `rit-${Date.now()}`,
    };
    const updated: Character = {
      ...target,
      rituals: [...(target.rituals || []), newRit],
    };
    await updateCharacter(target.id, updated, currentUser);
    setCharacters((prev) => prev.map((c) => (c.id === target.id ? updated : c)));
  };

  const selectedCharacter = characters.find((c) => c.id === selectedCharacterId) || characters[0];

  return (
    <div className={`min-h-screen bg-[#08090D] text-slate-100 flex flex-col selection:bg-rose-900 selection:text-white font-sans ${themeClass}`}>
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] z-0" />

      {/* Main Top Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        campaignName={campaign.name}
        onOpenRollModal={() => {
          setGlobalRollConfig({ name: 'Rolagem Rápida', formula: '1d20', type: 'LIVRE' });
          setIsGlobalRollOpen(true);
        }}
      />

      {/* Main Application Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 relative z-10">
        {/* VIEW 1: DASHBOARD (MESA DO DIRETOR) */}
        {currentView === 'DASHBOARD' && (
          <Dashboard
            campaign={campaign}
            characters={characters}
            npcs={npcs}
            creatures={creatures}
            currentUser={currentUser}
            onSelectCharacter={(id) => {
              setSelectedCharacterId(id);
              setCurrentView('CHARACTER_SHEET');
            }}
            onCreateCharacter={() => setIsWizardOpen(true)}
            onDuplicateCharacter={handleDuplicateCharacter}
            onDeleteCharacterRequest={(char) => setDeletingCharacter(char)}
            onOpenSessionView={() => setCurrentView('SESSION_LIVE')}
            onOpenCMSModal={() => setIsCMSModalOpen(true)}
            onOpenCreateNpc={() => setCurrentView('SESSION_LIVE')}
            onOpenCreateCreature={() => setCurrentView('SESSION_LIVE')}
            onToggleNpcReveal={(npcId) => {
              setNpcs((prev) =>
                prev.map((n) =>
                  n.id === npcId ? { ...n, revealedToPlayers: !n.revealedToPlayers } : n
                )
              );
            }}
            onSwitchRole={handleSwitchRole}
          />
        )}

        {/* VIEW 2: CHARACTER SHEET (DOSSIÊ CONFIDENCIAL DO AGENTE) */}
        {currentView === 'CHARACTER_SHEET' && selectedCharacter && (
          <CharacterSheetView
            key={selectedCharacter.id}
            initialCharacter={selectedCharacter}
            currentUser={currentUser}
            campaignId={campaign.id}
            onBack={() => setCurrentView('DASHBOARD')}
          />
        )}

        {/* VIEW 3: LIVE SESSION & MASTER TERMINAL */}
        {currentView === 'SESSION_LIVE' && (
          <SessionLiveView
            campaign={campaign}
            characters={characters}
            npcs={npcs}
            creatures={creatures}
            sessionData={sessionData}
            currentUser={currentUser}
            onBack={() => setCurrentView('DASHBOARD')}
            onSelectCharacter={(id) => {
              setSelectedCharacterId(id);
              setCurrentView('CHARACTER_SHEET');
            }}
            onUpdateSessionData={setSessionData}
            onUpdateNpc={(npc) => setNpcs((prev) => prev.map((n) => (n.id === npc.id ? npc : n)))}
            onDeleteNpc={(id) => setNpcs((prev) => prev.filter((n) => n.id !== id))}
            onCreateNpc={(partial) => {
              const newNpc: NPC = {
                id: `npc-${Date.now()}`,
                campaignId: campaign?.id || 'camp-conv-01',
                name: partial.name || 'Novo NPC',
                occupation: partial.occupation || 'Civil',
                location: partial.location || 'Ilha',
                status: partial.status || 'VIVO',
                dangerLevel: partial.dangerLevel || 'INOFENSIVO',
                attitude: partial.attitude || 'NEUTRO',
                publicDescription: partial.publicDescription || '',
                masterNotes: partial.masterNotes,
                knownSecrets: [],
                revealedToPlayers: false,
              };
              setNpcs((prev) => [newNpc, ...prev]);
            }}
            onUpdateCreature={(creature) => setCreatures((prev) => prev.map((c) => (c.id === creature.id ? creature : c)))}
            onDeleteCreature={(id) => setCreatures((prev) => prev.filter((c) => c.id !== id))}
            onCreateCreature={(partial) => {
              const newCreature: Creature = {
                id: `creature-${Date.now()}`,
                campaignId: campaign?.id || 'camp-conv-01',
                name: partial.name || 'NOVA AMEAÇA',
                concept: partial.concept || 'Aberração',
                threatLevel: partial.threatLevel || 'NÍVEL 2 (PERIGOSO)',
                pv: { current: 80, max: 80, temp: 0 },
                defense: 18,
                presenceElement: partial.presenceElement || 'Entona Carmesim',
                description: partial.description || '',
                immunities: partial.immunities || [],
                weaknesses: partial.weaknesses || [],
                attacks: [],
                abilities: [],
              };
              setCreatures((prev) => [newCreature, ...prev]);
            }}
            onOpenCombatMode={() => {
              if (selectedCharacter) {
                setCurrentView('CHARACTER_SHEET');
              }
            }}
            onThemeChange={(theme) => setSessionData((prev) => ({ ...prev, theme }))}
            onOpenRoll={(rollName, formula, type) => {
              setGlobalRollConfig({ name: rollName, formula, type });
              setIsGlobalRollOpen(true);
            }}
          />
        )}
      </main>

      {/* Character Creation Wizard Modal */}
      <CharacterCreationWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSave={handleSaveCreatedCharacter}
        campaignId={campaign.id}
        userId={currentUser.id}
      />

      {/* Delete Character Confirmation Modal */}
      {deletingCharacter && (
        <DeleteCharacterModal
          isOpen={!!deletingCharacter}
          onClose={() => setDeletingCharacter(null)}
          character={deletingCharacter}
          onConfirm={handleConfirmDeleteCharacter}
          onConfirmDelete={handleConfirmDeleteCharacter}
        />
      )}

      {/* Master CMS Catalog Modal */}
      <MasterCMSModal
        isOpen={isCMSModalOpen}
        onClose={() => setIsCMSModalOpen(false)}
        currentUser={currentUser}
        characters={characters}
        onGrantAbilityToCharacter={handleGrantAbilityToChar}
        onGrantRitualToCharacter={handleGrantRitualToChar}
      />

      {/* Global Quick Roll Modal */}
      <RollModal
        isOpen={isGlobalRollOpen}
        onClose={() => setIsGlobalRollOpen(false)}
        rollName={globalRollConfig.name}
        defaultFormula={globalRollConfig.formula}
        rollType={globalRollConfig.type}
        characterName={selectedCharacter?.name || 'Mesa'}
        campaignId={campaign.id}
        currentUser={currentUser}
      />

      {/* Realtime Notification Toasts */}
      <NotificationToast
        notifications={notifications}
        onDismiss={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
      />
    </div>
  );
}
