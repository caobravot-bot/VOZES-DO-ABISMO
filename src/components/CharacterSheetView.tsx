import React, { useState, useEffect, useRef } from 'react';
import { 
  Character, 
  User, 
  AttributeKey, 
  CharacterSkill, 
  Weapon, 
  Ability, 
  Ritual, 
  InventoryItem, 
  MasterSecrets, 
  RollHistoryEntry 
} from '../types';
import { CharacterHeader } from './CharacterHeader';
import { ResourceCard } from './ResourceCard';
import { AttributePanel } from './AttributePanel';
import { SkillList } from './SkillList';
import { CombatTab } from './CombatTab';
import { AbilitiesTab } from './AbilitiesTab';
import { RitualsTab } from './RitualsTab';
import { InventoryTab } from './InventoryTab';
import { IndividualityTab } from './IndividualityTab';
import { MarksTab } from './MarksTab';
import { HistoryTab } from './HistoryTab';
import { MasterSecretsTab } from './MasterSecretsTab';
import { NotesTab } from './NotesTab';
import { CombatModeOverlay } from './CombatModeOverlay';
import { RollModal } from './RollModal';
import { EditCharacterModal } from './EditCharacterModal';
import { RollHistoryDrawer } from './RollHistoryDrawer';
import { updateCharacter, rollDice } from '../lib/api';
import { 
  Swords, 
  Zap, 
  Sparkles, 
  Package, 
  Fingerprint, 
  Sun, 
  BookOpen, 
  ShieldAlert, 
  FileText, 
  Dices,
  History,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';

interface CharacterSheetViewProps {
  initialCharacter: Character;
  currentUser: User;
  onBack: () => void;
  campaignId: string;
}

export type SheetTab = 
  | 'PERICIAS'
  | 'COMBATE'
  | 'HABILIDADES'
  | 'RITUAIS'
  | 'INVENTARIO'
  | 'INDIVIDUALIDADE'
  | 'MARCAS'
  | 'HISTORICO'
  | 'NOTAS'
  | 'SEGREDOS';

export const CharacterSheetView: React.FC<CharacterSheetViewProps> = ({
  initialCharacter,
  currentUser,
  onBack,
  campaignId,
}) => {
  const [character, setCharacter] = useState<Character>(initialCharacter);
  const [activeTab, setActiveTab] = useState<SheetTab>('PERICIAS');
  const [selectedAttrFilter, setSelectedAttrFilter] = useState<AttributeKey | 'ALL'>('ALL');

  // Modals & Overlays
  const [isCombatModeOpen, setIsCombatModeOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isRollModalOpen, setIsRollModalOpen] = useState(false);

  // Active Roll state
  const [activeRoll, setActiveRoll] = useState<{
    name: string;
    formula: string;
    type: 'PERÍCIA' | 'ATAQUE' | 'DANO' | 'RITUAL' | 'LIVRE';
  }>({
    name: 'Teste Rápido',
    formula: '1d20',
    type: 'LIVRE',
  });

  // Roll history entries
  const [rollHistory, setRollHistory] = useState<RollHistoryEntry[]>([]);

  // Autosave tracking
  const [autosaveStatus, setAutosaveStatus] = useState<'IDLE' | 'SAVING' | 'SAVED' | 'ERROR'>('IDLE');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isMaster = currentUser.role === 'MESTRE';

  // Sync state changes with backend via autosave
  const triggerAutoSave = (updated: Character) => {
    setCharacter(updated);
    setAutosaveStatus('SAVING');

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateCharacter(updated.id, updated, currentUser);
        setAutosaveStatus('SAVED');
        setTimeout(() => setAutosaveStatus('IDLE'), 2000);
      } catch (err) {
        console.error(err);
        setAutosaveStatus('ERROR');
      }
    }, 600);
  };

  // Roll trigger helper
  const handleOpenRoll = (
    rollName: string,
    formula: string,
    rollType: 'PERÍCIA' | 'ATAQUE' | 'DANO' | 'RITUAL' | 'LIVRE' = 'PERÍCIA'
  ) => {
    setActiveRoll({ name: rollName, formula, type: rollType });
    setIsRollModalOpen(true);
  };

  // Resources Update Handlers
  const handleUpdatePv = (current: number, temp?: number) => {
    const updated: Character = {
      ...character,
      resources: {
        ...character.resources,
        pv: { ...character.resources.pv, current, temp: temp !== undefined ? temp : character.resources.pv.temp },
      },
    };
    triggerAutoSave(updated);
  };

  const handleUpdatePr = (current: number, temp?: number) => {
    const updated: Character = {
      ...character,
      resources: {
        ...character.resources,
        pr: { ...character.resources.pr, current, temp: temp !== undefined ? temp : character.resources.pr.temp },
      },
    };
    triggerAutoSave(updated);
  };

  const handleUpdateDefense = (defense: number, bonus: number) => {
    const updated: Character = {
      ...character,
      resources: {
        ...character.resources,
        defense,
        defenseBonus: bonus,
      },
    };
    triggerAutoSave(updated);
  };

  // Combat Fast Modifiers
  const handleCombatResourcesDelta = (pvDelta: number, prDelta: number) => {
    const newPv = Math.min(character.resources.pv.max, Math.max(0, character.resources.pv.current + pvDelta));
    const newPr = Math.min(character.resources.pr.max, Math.max(0, character.resources.pr.current + prDelta));
    const updated: Character = {
      ...character,
      resources: {
        ...character.resources,
        pv: { ...character.resources.pv, current: newPv },
        pr: { ...character.resources.pr, current: newPr },
      },
    };
    triggerAutoSave(updated);
  };

  // Weapon Handlers
  const handleReloadWeapon = (weaponId: string) => {
    const updatedWeapons = (character.weapons || []).map((w) =>
      w.id === weaponId ? { ...w, currentAmmo: w.maxAmmo } : w
    );
    triggerAutoSave({ ...character, weapons: updatedWeapons });
  };

  const handleFireWeapon = (weaponId: string) => {
    const updatedWeapons = (character.weapons || []).map((w) =>
      w.id === weaponId ? { ...w, currentAmmo: Math.max(0, w.currentAmmo - 1) } : w
    );
    triggerAutoSave({ ...character, weapons: updatedWeapons });
  };

  // Ritual Casting Handler
  const handleCastRitual = (ritual: Ritual) => {
    if (character.resources.pr.current < ritual.prCost) return;
    const newPr = character.resources.pr.current - ritual.prCost;
    handleUpdatePr(newPr);

    if (ritual.damageFormula) {
      handleOpenRoll(`Ritual: ${ritual.name}`, ritual.damageFormula, 'RITUAL');
    }
  };

  // Ability Use Handler
  const handleUseAbility = (ability: Ability) => {
    if (ability.prCost > 0) {
      if (character.resources.pr.current < ability.prCost) return;
      handleUpdatePr(character.resources.pr.current - ability.prCost);
    }
  };

  // Tab configurations
  const tabsList: Array<{ key: SheetTab; label: string; icon: React.ReactNode; secret?: boolean }> = [
    { key: 'PERICIAS', label: 'Perícias & Atributos', icon: <Dices className="w-3.5 h-3.5" /> },
    { key: 'COMBATE', label: 'Arsenal & Combate', icon: <Swords className="w-3.5 h-3.5" /> },
    { key: 'HABILIDADES', label: 'Habilidades', icon: <Zap className="w-3.5 h-3.5" /> },
    { key: 'RITUAIS', label: 'Rituais', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: 'INVENTARIO', label: 'Inventário', icon: <Package className="w-3.5 h-3.5" /> },
    { key: 'INDIVIDUALIDADE', label: 'Individualidade', icon: <Fingerprint className="w-3.5 h-3.5" /> },
    { key: 'MARCAS', label: 'Marcas', icon: <Sun className="w-3.5 h-3.5" /> },
    { key: 'HISTORICO', label: 'Histórico & Lore', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { key: 'NOTAS', label: 'Diário de Campo', icon: <FileText className="w-3.5 h-3.5" /> },
    ...(isMaster ? [{ key: 'SEGREDOS' as SheetTab, label: 'Segredos do Mestre', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />, secret: true }] : []),
  ];

  const presenceHex = character.presence?.hexColor || '#F8FAFC';

  return (
    <div className="space-y-5 pb-12">
      
      {/* Top Action Ribbon */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14161d] hover:bg-[#1e2230] border border-[#222634] rounded-lg text-xs font-mono text-slate-300 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-red-500" />
          <span>Voltar ao Dossiê Geral</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Quick Roll Trigger */}
          <button
            onClick={() => handleOpenRoll('Rolagem Rápida 1d20', '1d20', 'LIVRE')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1d26] hover:bg-[#252a3a] border border-[#2e3344] text-slate-200 rounded-lg text-xs font-mono transition-colors"
          >
            <Dices className="w-3.5 h-3.5 text-amber-400" />
            <span>Rolar Dados</span>
          </button>

          {/* Roll History Drawer Trigger */}
          <button
            onClick={() => setIsHistoryDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1d26] hover:bg-[#252a3a] border border-[#2e3344] text-slate-200 rounded-lg text-xs font-mono transition-colors"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Histórico</span>
          </button>

          {/* Combat Mode Trigger */}
          <button
            onClick={() => setIsCombatModeOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs rounded-lg shadow-md shadow-red-950/60 transition-all hover:scale-102"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>MODO COMBATE</span>
          </button>
        </div>
      </div>

      {/* 1. Dossier Header (Dynamic Presence Accenting & Biometrics) */}
      <CharacterHeader
        character={character}
        currentUser={currentUser}
        onOpenEditModal={() => setIsEditModalOpen(true)}
        autosaveStatus={autosaveStatus}
      />

      {/* 2. Core Resource Cards (PV / PR / Defesa) */}
      <ResourceCard
        pv={character.resources.pv}
        pr={character.resources.pr}
        defense={character.resources.defense}
        defenseBonus={character.resources.defenseBonus || 0}
        customResources={character.resources.customResources}
        presenceColor={presenceHex}
        onUpdatePv={handleUpdatePv}
        onUpdatePr={handleUpdatePr}
        onUpdateDefense={handleUpdateDefense}
      />

      {/* 3. Navigation Tabs Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#222634]">
        {tabsList.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg text-xs font-mono whitespace-nowrap transition-all border-t border-x ${
                isActive
                  ? 'bg-[#14161d] text-white border-[#2e3344] font-bold border-b-2 border-b-red-500 shadow-md'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:bg-[#11131a]'
              } ${t.secret ? 'text-rose-400 hover:text-rose-300' : ''}`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content Area */}
      <div className="pt-2">
        {activeTab === 'PERICIAS' && (
          <div className="space-y-4">
            <AttributePanel
              attributes={character.attributes}
              skills={character.skills}
              selectedAttr={selectedAttrFilter}
              onSelectAttr={setSelectedAttrFilter}
              onRollAttribute={(attrKey, attrName, val) =>
                handleOpenRoll(attrName, `1d20 + ${val}`, 'PERÍCIA')
              }
              onUpdateAttribute={(attrKey, newVal) => {
                const updated = {
                  ...character,
                  attributes: {
                    ...character.attributes,
                    [attrKey]: { ...character.attributes[attrKey], value: newVal },
                  },
                };
                triggerAutoSave(updated);
              }}
              isEditMode={isMaster}
            />

            <SkillList
              skills={character.skills}
              attributes={character.attributes}
              filterAttr={selectedAttrFilter}
              onRollSkill={(skill, formula) => {
                handleOpenRoll(`Teste de ${skill.name}`, formula, 'PERÍCIA');
              }}
              onUpdateSkill={(updatedSkill) => {
                const updatedSkills = (character.skills || []).map((s) =>
                  s.id === updatedSkill.id ? updatedSkill : s
                );
                triggerAutoSave({ ...character, skills: updatedSkills });
              }}
              onDeleteSkill={(skillId) => {
                const updatedSkills = (character.skills || []).filter((s) => s.id !== skillId);
                triggerAutoSave({ ...character, skills: updatedSkills });
              }}
              onCreateSkill={(partialSkill) => {
                const newSkill: CharacterSkill = {
                  id: `sk-${Date.now()}`,
                  name: partialSkill.name || 'Nova Perícia',
                  baseAttr: partialSkill.baseAttr || 'int',
                  currentAttr: partialSkill.currentAttr || partialSkill.baseAttr || 'int',
                  training: partialSkill.training || 'Treinado',
                  bonus: partialSkill.bonus || 0,
                  penalties: 0,
                  tempMod: 0,
                };
                triggerAutoSave({ ...character, skills: [...(character.skills || []), newSkill] });
              }}
              isMaster={isMaster}
            />
          </div>
        )}

        {activeTab === 'COMBATE' && (
          <CombatTab
            weapons={character.weapons || []}
            skills={character.skills || []}
            onOpenRoll={handleOpenRoll}
            onUpdateWeapon={(updatedWep) => {
              const updated = (character.weapons || []).map((w) => (w.id === updatedWep.id ? updatedWep : w));
              triggerAutoSave({ ...character, weapons: updated });
            }}
            onDeleteWeapon={(weaponId) => {
              const updated = (character.weapons || []).filter((w) => w.id !== weaponId);
              triggerAutoSave({ ...character, weapons: updated });
            }}
            onCreateWeapon={(partialWep) => {
              const newWeapon: Weapon = {
                id: `wep-${Date.now()}`,
                name: partialWep.name || 'Nova Arma',
                type: partialWep.type || 'Arma de Fogo',
                category: partialWep.category || 'Distância',
                skillUsed: partialWep.skillUsed || 'Pontaria',
                attrUsed: partialWep.attrUsed || 'des',
                damageFormula: partialWep.damageFormula || '2d10',
                damageType: partialWep.damageType || 'Balístico',
                critical: partialWep.critical || '20 / x2',
                range: partialWep.range || 'Médio (30m)',
                currentAmmo: partialWep.currentAmmo || 6,
                maxAmmo: partialWep.maxAmmo || 6,
                equipped: true,
                description: partialWep.description,
                specialEffects: partialWep.specialEffects,
              };
              triggerAutoSave({ ...character, weapons: [...(character.weapons || []), newWeapon] });
            }}
            onToggleEquip={(weaponId) => {
              const updated = (character.weapons || []).map((w) =>
                w.id === weaponId ? { ...w, equipped: !w.equipped } : w
              );
              triggerAutoSave({ ...character, weapons: updated });
            }}
            onReload={handleReloadWeapon}
            onFire={handleFireWeapon}
          />
        )}

        {activeTab === 'HABILIDADES' && (
          <AbilitiesTab
            abilities={character.abilities || []}
            currentPr={character.resources.pr.current}
            onUseAbility={handleUseAbility}
            onUpdateAbility={(updatedAb) => {
              const updated = (character.abilities || []).map((a) => (a.id === updatedAb.id ? updatedAb : a));
              triggerAutoSave({ ...character, abilities: updated });
            }}
            onDeleteAbility={(abilityId) => {
              const updated = (character.abilities || []).filter((a) => a.id !== abilityId);
              triggerAutoSave({ ...character, abilities: updated });
            }}
            onCreateAbility={(partialAb) => {
              const newAb: Ability = {
                id: `ab-${Date.now()}`,
                name: partialAb.name || 'Nova Habilidade',
                category: partialAb.category || 'Paranormal',
                description: partialAb.description || '',
                execution: partialAb.execution || 'Ação Padrão',
                range: partialAb.range || 'Pessoal',
                duration: partialAb.duration || 'Instantânea',
                prCost: partialAb.prCost || 0,
                status: partialAb.status || 'DESBLOQUEADA',
                favorite: false,
              };
              triggerAutoSave({ ...character, abilities: [...(character.abilities || []), newAb] });
            }}
            isMaster={isMaster}
          />
        )}

        {activeTab === 'RITUAIS' && (
          <RitualsTab
            rituals={character.rituals || []}
            currentPr={character.resources.pr.current}
            onCastRitual={handleCastRitual}
            onUpdateRitual={(updatedRit) => {
              const updated = (character.rituals || []).map((r) => (r.id === updatedRit.id ? updatedRit : r));
              triggerAutoSave({ ...character, rituals: updated });
            }}
            onDeleteRitual={(ritualId) => {
              const updated = (character.rituals || []).filter((r) => r.id !== ritualId);
              triggerAutoSave({ ...character, rituals: updated });
            }}
            onCreateRitual={(partialRit) => {
              const newRit: Ritual = {
                id: `rit-${Date.now()}`,
                name: partialRit.name || 'NOVO RITUAL',
                description: partialRit.description || '',
                troca: partialRit.troca || '30%',
                execution: partialRit.execution || 'Ação Padrão',
                range: partialRit.range || 'Médio (15m)',
                duration: partialRit.duration || 'Instantânea',
                prCost: partialRit.prCost || 20,
                damageFormula: partialRit.damageFormula,
                damageType: partialRit.damageType,
                effect: partialRit.effect,
                prerequisites: partialRit.prerequisites,
                favorite: true,
              };
              triggerAutoSave({ ...character, rituals: [...(character.rituals || []), newRit] });
            }}
            isMaster={isMaster}
          />
        )}

        {activeTab === 'INVENTARIO' && (
          <InventoryTab
            inventory={character.inventory || []}
            onUpdateItem={(updatedItem) => {
              const updated = (character.inventory || []).map((i) => (i.id === updatedItem.id ? updatedItem : i));
              triggerAutoSave({ ...character, inventory: updated });
            }}
            onDeleteItem={(itemId) => {
              const updated = (character.inventory || []).filter((i) => i.id !== itemId);
              triggerAutoSave({ ...character, inventory: updated });
            }}
            onCreateItem={(partialItem) => {
              const newItem: InventoryItem = {
                id: `item-${Date.now()}`,
                name: partialItem.name || 'Novo Item',
                category: partialItem.category || 'Equipamento',
                quantity: partialItem.quantity || 1,
                weight: partialItem.weight || 0.5,
                rarity: partialItem.rarity || 'Comum',
                playerDescription: partialItem.playerDescription || '',
                masterSecretDescription: partialItem.masterSecretDescription,
                isSecretRevealed: false,
                effect: partialItem.effect,
                origin: partialItem.origin,
                tags: partialItem.tags || ['Geral'],
                equipped: false,
              };
              triggerAutoSave({ ...character, inventory: [...(character.inventory || []), newItem] });
            }}
            onToggleEquip={(itemId) => {
              const updated = (character.inventory || []).map((i) =>
                i.id === itemId ? { ...i, equipped: !i.equipped } : i
              );
              triggerAutoSave({ ...character, inventory: updated });
            }}
            onToggleRevealSecret={(itemId) => {
              const updated = (character.inventory || []).map((i) =>
                i.id === itemId ? { ...i, isSecretRevealed: !i.isSecretRevealed } : i
              );
              triggerAutoSave({ ...character, inventory: updated });
            }}
            isMaster={isMaster}
          />
        )}

        {activeTab === 'INDIVIDUALIDADE' && (
          <IndividualityTab
            individuality={character.individuality}
            onUpdateLevel={(levelIdx, lvl) => {
              if (!character.individuality) return;
              const newLevels = [...character.individuality.levels];
              newLevels[levelIdx] = lvl;
              triggerAutoSave({
                ...character,
                individuality: { ...character.individuality, levels: newLevels },
              });
            }}
            onToggleUnlock={(levelIdx) => {
              if (!character.individuality) return;
              const newLevels = [...character.individuality.levels];
              newLevels[levelIdx] = {
                ...newLevels[levelIdx],
                unlocked: !newLevels[levelIdx].unlocked,
              };
              const countUnlocked = newLevels.filter((l) => l.unlocked).length;
              triggerAutoSave({
                ...character,
                individuality: {
                  ...character.individuality,
                  levels: newLevels,
                  currentLevel: countUnlocked,
                },
              });
            }}
            onUpdateNotes={(notes) => {
              if (!character.individuality) return;
              triggerAutoSave({
                ...character,
                individuality: { ...character.individuality, notes },
              });
            }}
            isMaster={isMaster}
          />
        )}

        {activeTab === 'MARCAS' && (
          <MarksTab
            mark={character.mark}
            onUpdateMark={(partialMark) => {
              if (!character.mark) return;
              triggerAutoSave({
                ...character,
                mark: { ...character.mark, ...partialMark },
              });
            }}
            onToggleReveal={() => {
              if (!character.mark) return;
              triggerAutoSave({
                ...character,
                mark: { ...character.mark, revealed: !character.mark.revealed },
              });
            }}
            isMaster={isMaster}
          />
        )}

        {activeTab === 'HISTORICO' && (
          <HistoryTab
            bio={character.bio || character.history}
            onUpdateBio={(updatedBio) => {
              const mergedBio = { ...(character.bio || character.history || {}), ...updatedBio };
              triggerAutoSave({
                ...character,
                bio: mergedBio,
                history: mergedBio,
              });
            }}
            isMaster={isMaster}
          />
        )}

        {activeTab === 'NOTAS' && (
          <NotesTab
            initialNotes={character.notes}
            onSaveNotes={(notes) => triggerAutoSave({ ...character, notes })}
          />
        )}

        {activeTab === 'SEGREDOS' && (
          <MasterSecretsTab
            secrets={character.masterSecrets}
            onUpdateSecrets={(updatedSecrets) => {
              triggerAutoSave({
                ...character,
                masterSecrets: { ...character.masterSecrets, ...updatedSecrets },
              });
            }}
            isMaster={isMaster}
          />
        )}
      </div>

      {/* Combat Mode Tactical Full-Screen Overlay */}
      <CombatModeOverlay
        isOpen={isCombatModeOpen}
        onClose={() => setIsCombatModeOpen(false)}
        character={character}
        onUpdateResources={handleCombatResourcesDelta}
        onOpenRoll={handleOpenRoll}
        onReloadWeapon={handleReloadWeapon}
        onFireWeapon={handleFireWeapon}
        onCastRitual={handleCastRitual}
        onUseAbility={handleUseAbility}
      />

      {/* Roll Modal */}
      <RollModal
        isOpen={isRollModalOpen}
        onClose={() => setIsRollModalOpen(false)}
        rollName={activeRoll.name}
        defaultFormula={activeRoll.formula}
        rollType={activeRoll.type}
        characterName={character.name}
        campaignId={campaignId}
        currentUser={currentUser}
        onRollComplete={(entry) => setRollHistory((prev) => [entry, ...prev])}
      />

      {/* Edit Character Modal */}
      <EditCharacterModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        character={character}
        onSave={(updated) => triggerAutoSave({ ...character, ...updated })}
      />

      {/* Roll History Drawer */}
      <RollHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        rolls={rollHistory}
      />

    </div>
  );
};
