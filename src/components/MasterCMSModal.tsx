import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Zap, 
  Package, 
  Shield, 
  Share2, 
  Check, 
  Folder,
  Flame,
  Search
} from 'lucide-react';
import { 
  User, 
  Race, 
  Ability, 
  Ritual, 
  InventoryItem, 
  Character 
} from '../types';
import {
  fetchRaces,
  createRace,
  updateRace,
  deleteRace,
  fetchAbilitiesCatalog,
  createAbilityCatalog,
  updateAbilityCatalog,
  deleteAbilityCatalog,
  fetchRitualsCatalog,
  createRitualCatalog,
  updateRitualCatalog,
  deleteRitualCatalog,
  fetchItemsCatalog,
  createItemCatalog,
  updateItemCatalog,
  deleteItemCatalog,
  grantItemToCharacter
} from '../lib/api';

interface MasterCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  characters: Character[];
  onGrantAbilityToCharacter?: (characterId: string, ability: Ability) => void;
  onGrantRitualToCharacter?: (characterId: string, ritual: Ritual) => void;
}

type CMSTab = 'RACES' | 'ABILITIES' | 'RITUALS' | 'ITEMS';

export const MasterCMSModal: React.FC<MasterCMSModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  characters,
  onGrantAbilityToCharacter,
  onGrantRitualToCharacter
}) => {
  const [activeTab, setActiveTab] = useState<CMSTab>('RACES');
  const [searchTerm, setSearchTerm] = useState('');

  // Data lists
  const [races, setRaces] = useState<Race[]>([]);
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);

  // Selection / Editing states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [grantTargetCharId, setGrantTargetCharId] = useState<string>(characters[0]?.id || '');
  const [grantSuccessMsg, setGrantSuccessMsg] = useState<string>('');

  const loadData = async () => {
    try {
      const [r, a, rit, it] = await Promise.all([
        fetchRaces(),
        fetchAbilitiesCatalog(),
        fetchRitualsCatalog(),
        fetchItemsCatalog(),
      ]);
      setRaces(r || []);
      setAbilities(a || []);
      setRituals(rit || []);
      setItems(it || []);
    } catch (err) {
      console.error('Falha ao carregar acervo do CMS', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Save
  const handleSaveRace = async (data: Partial<Race>) => {
    if (editingItem && editingItem.id) {
      const updated = await updateRace(editingItem.id, data, currentUser);
      setRaces(races.map((r) => (r.id === updated.id ? updated : r)));
    } else {
      const created = await createRace(data, currentUser);
      setRaces([...races, created]);
    }
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleSaveAbility = async (data: Partial<Ability>) => {
    if (editingItem && editingItem.id) {
      const updated = await updateAbilityCatalog(editingItem.id, data, currentUser);
      setAbilities(abilities.map((a) => (a.id === updated.id ? updated : a)));
    } else {
      const created = await createAbilityCatalog(data, currentUser);
      setAbilities([...abilities, created]);
    }
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleSaveRitual = async (data: Partial<Ritual>) => {
    if (editingItem && editingItem.id) {
      const updated = await updateRitualCatalog(editingItem.id, data, currentUser);
      setRituals(rituals.map((r) => (r.id === updated.id ? updated : r)));
    } else {
      const created = await createRitualCatalog(data, currentUser);
      setRituals([...rituals, created]);
    }
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleSaveItem = async (data: Partial<InventoryItem>) => {
    if (editingItem && editingItem.id) {
      const updated = await updateItemCatalog(editingItem.id, data, currentUser);
      setItems(items.map((i) => (i.id === updated.id ? updated : i)));
    } else {
      const created = await createItemCatalog(data, currentUser);
      setItems([...items, created]);
    }
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleGrantItem = async (item: InventoryItem) => {
    if (!grantTargetCharId) return;
    try {
      await grantItemToCharacter(grantTargetCharId, item, currentUser);
      const targetChar = characters.find((c) => c.id === grantTargetCharId);
      setGrantSuccessMsg(`Item "${item.name}" concedido a ${targetChar?.name || 'agente'}!`);
      setTimeout(() => setGrantSuccessMsg(''), 3500);
    } catch {
      alert('Erro ao entregar item');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[85vh] flex flex-col bg-[#0D0F14] border border-[#2A2E3D] rounded-xl shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#12151C] border-b border-[#232734]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-950/60 border border-rose-800/60 rounded-lg text-rose-400">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-title-paranormal text-lg font-bold tracking-wide text-slate-100 flex items-center gap-2">
                ARQUIVOS DA ILHA <span className="text-xs font-mono font-normal text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-900/40">CATÁLOGO DO MESTRE</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Criação e distribuição de Raças, Habilidades, Rituais e Itens
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grant Notification */}
        {grantSuccessMsg && (
          <div className="px-6 py-2 bg-emerald-950/80 border-b border-emerald-800/60 text-emerald-300 text-xs font-mono flex items-center justify-between animate-fadeIn">
            <span>✓ {grantSuccessMsg}</span>
            <button onClick={() => setGrantSuccessMsg('')} className="text-emerald-400 hover:text-emerald-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Navigation & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-[#090B0E] border-b border-[#1E222D]">
          <div className="flex items-center gap-1 font-mono text-xs">
            {[
              { id: 'RACES', label: 'Raças / Linhagens', icon: Sparkles },
              { id: 'HABILITIES', label: 'Habilidades', icon: Zap, tab: 'ABILITIES' },
              { id: 'RITUALS', label: 'Rituais', icon: Flame, tab: 'RITUALS' },
              { id: 'ITEMS', label: 'Itens & Relíquias', icon: Package, tab: 'ITEMS' },
            ].map((t) => {
              const Icon = t.icon;
              const tabId = (t.tab || t.id) as CMSTab;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(tabId);
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                    activeTab === tabId
                      ? 'bg-rose-950/70 text-rose-200 border border-rose-800/60 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar catálogo..."
                className="pl-8 pr-3 py-1 bg-[#12151C] border border-[#232734] rounded text-xs text-slate-200 focus:outline-none focus:border-rose-600"
              />
            </div>
            <button
              onClick={() => {
                setEditingItem({});
                setIsCreating(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-rose-900 hover:bg-rose-800 text-white rounded text-xs font-mono font-bold uppercase transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Criar Novo
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* RACES TAB */}
          {activeTab === 'RACES' && (
            <div className="space-y-4">
              {isCreating || editingItem ? (
                <RaceForm
                  initialData={editingItem}
                  onSave={handleSaveRace}
                  onCancel={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {races
                    .filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((race) => (
                      <div
                        key={race.id}
                        className="p-4 bg-[#12151C] border border-[#232734] hover:border-slate-600 rounded-lg flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <h3 className="font-title-paranormal text-base font-bold text-slate-100">
                              {race.name}
                            </h3>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingItem(race);
                                  setIsCreating(false);
                                }}
                                className="p-1 text-slate-400 hover:text-slate-200"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Excluir ${race.name}?`)) {
                                    await deleteRace(race.id, currentUser);
                                    setRaces(races.filter((r) => r.id !== race.id));
                                  }
                                }}
                                className="p-1 text-slate-400 hover:text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">{race.description}</p>
                          {race.passives && race.passives.length > 0 && (
                            <div className="mt-3 text-[11px] text-rose-300 font-mono space-y-1">
                              <span className="text-slate-500 block">Passivas da Linhagem:</span>
                              {race.passives.map((p, i) => (
                                <div key={i} className="pl-2 border-l border-rose-800/40">
                                  {p}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ABILITIES TAB */}
          {activeTab === 'ABILITIES' && (
            <div className="space-y-4">
              {isCreating || editingItem ? (
                <AbilityForm
                  initialData={editingItem}
                  onSave={handleSaveAbility}
                  onCancel={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {abilities
                    .filter((a) => a.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((ab) => (
                      <div
                        key={ab.id}
                        className="p-4 bg-[#12151C] border border-[#232734] rounded-lg flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-rose-300 border border-slate-700">
                                {ab.category}
                              </span>
                              <h3 className="font-bold text-sm text-slate-100 mt-1">{ab.name}</h3>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingItem(ab);
                                  setIsCreating(false);
                                }}
                                className="p-1 text-slate-400 hover:text-slate-200"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Excluir ${ab.name}?`)) {
                                    await deleteAbilityCatalog(ab.id, currentUser);
                                    setAbilities(abilities.filter((a) => a.id !== ab.id));
                                  }
                                }}
                                className="p-1 text-slate-400 hover:text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 mt-2">{ab.description}</p>
                          <div className="flex items-center gap-3 mt-3 text-[11px] font-mono text-slate-400">
                            {ab.prCost !== undefined && (
                              <span className="text-sky-400 font-bold">PR: {ab.prCost}</span>
                            )}
                            {ab.execution && <span>Execução: {ab.execution}</span>}
                            {ab.range && <span>Alcance: {ab.range}</span>}
                          </div>
                        </div>

                        {/* Grant to Character */}
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#1E222D]">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-500">Entregar:</span>
                            <select
                              value={grantTargetCharId}
                              onChange={(e) => setGrantTargetCharId(e.target.value)}
                              className="px-2 py-1 bg-[#090B0E] border border-[#232734] rounded text-[11px] font-mono text-slate-300 focus:outline-none"
                            >
                              {characters.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={() => {
                              if (onGrantAbilityToCharacter && grantTargetCharId) {
                                onGrantAbilityToCharacter(grantTargetCharId, ab);
                                const target = characters.find((c) => c.id === grantTargetCharId);
                                setGrantSuccessMsg(`Habilidade "${ab.name}" entregue a ${target?.name}!`);
                                setTimeout(() => setGrantSuccessMsg(''), 3500);
                              }
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 rounded text-[11px] font-mono font-bold"
                          >
                            <Share2 className="w-3 h-3" /> Conceder
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* RITUALS TAB */}
          {activeTab === 'RITUALS' && (
            <div className="space-y-4">
              {isCreating || editingItem ? (
                <RitualForm
                  initialData={editingItem}
                  onSave={handleSaveRitual}
                  onCancel={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rituals
                    .filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((rit) => (
                      <div
                        key={rit.id}
                        className="p-4 bg-[#12151C] border border-[#232734] rounded-lg flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40">
                                {rit.type || 'Ritual'}
                              </span>
                              <h3 className="font-title-paranormal text-sm font-bold text-purple-200 mt-1">
                                {rit.name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingItem(rit);
                                  setIsCreating(false);
                                }}
                                className="p-1 text-slate-400 hover:text-slate-200"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Excluir ${rit.name}?`)) {
                                    await deleteRitualCatalog(rit.id, currentUser);
                                    setRituals(rituals.filter((r) => r.id !== rit.id));
                                  }
                                }}
                                className="p-1 text-slate-400 hover:text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 mt-2">{rit.description}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] font-mono text-slate-400">
                            <span className="text-sky-400 font-bold">Gasto PR: {rit.prCost}</span>
                            {rit.troca && <span className="text-rose-400">Troca: {rit.troca}</span>}
                            {rit.damageFormula && <span className="text-amber-400">Dano: {rit.damageFormula}</span>}
                          </div>
                        </div>

                        {/* Grant to Character */}
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#1E222D]">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-500">Ensinar:</span>
                            <select
                              value={grantTargetCharId}
                              onChange={(e) => setGrantTargetCharId(e.target.value)}
                              className="px-2 py-1 bg-[#090B0E] border border-[#232734] rounded text-[11px] font-mono text-slate-300 focus:outline-none"
                            >
                              {characters.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={() => {
                              if (onGrantRitualToCharacter && grantTargetCharId) {
                                onGrantRitualToCharacter(grantTargetCharId, rit);
                                const target = characters.find((c) => c.id === grantTargetCharId);
                                setGrantSuccessMsg(`Ritual "${rit.name}" ensinado a ${target?.name}!`);
                                setTimeout(() => setGrantSuccessMsg(''), 3500);
                              }
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700/50 rounded text-[11px] font-mono font-bold"
                          >
                            <Share2 className="w-3 h-3" /> Transmitir
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ITEMS TAB */}
          {activeTab === 'ITEMS' && (
            <div className="space-y-4">
              {isCreating || editingItem ? (
                <ItemForm
                  initialData={editingItem}
                  onSave={handleSaveItem}
                  onCancel={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items
                    .filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-[#12151C] border border-[#232734] rounded-lg flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                                {item.category} • {item.rarity || 'Comum'}
                              </span>
                              <h3 className="font-bold text-sm text-slate-100 mt-1">{item.name}</h3>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingItem(item);
                                  setIsCreating(false);
                                }}
                                className="p-1 text-slate-400 hover:text-slate-200"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Excluir ${item.name}?`)) {
                                    await deleteItemCatalog(item.id, currentUser);
                                    setItems(items.filter((i) => i.id !== item.id));
                                  }
                                }}
                                className="p-1 text-slate-400 hover:text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 mt-2">{item.playerDescription}</p>
                          {item.effect && (
                            <p className="text-xs text-emerald-400 mt-1 font-mono">Efeito: {item.effect}</p>
                          )}
                          {item.masterSecretDescription && (
                            <div className="mt-2 p-2 bg-red-950/40 border border-red-900/40 rounded text-[11px] text-red-300 font-mono">
                              <span className="font-bold text-red-400 block">Segredo Oculto do Mestre:</span>
                              {item.masterSecretDescription}
                            </div>
                          )}
                        </div>

                        {/* Grant to Character */}
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#1E222D]">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-500">Entregar:</span>
                            <select
                              value={grantTargetCharId}
                              onChange={(e) => setGrantTargetCharId(e.target.value)}
                              className="px-2 py-1 bg-[#090B0E] border border-[#232734] rounded text-[11px] font-mono text-slate-300 focus:outline-none"
                            >
                              {characters.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={() => handleGrantItem(item)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-700/50 rounded text-[11px] font-mono font-bold"
                          >
                            <Share2 className="w-3 h-3" /> Colocar na Mochila
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-forms for creating / editing entries

const RaceForm: React.FC<{ initialData: any; onSave: (d: any) => void; onCancel: () => void }> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [passives, setPassives] = useState(initialData?.passives?.join('\n') || '');

  return (
    <div className="p-4 bg-[#12151C] border border-[#232734] rounded-lg space-y-3">
      <h3 className="font-title-paranormal text-sm font-bold text-slate-200">
        {initialData?.id ? 'EDITAR RAÇA' : 'NOVA RAÇA / LINHAGEM'}
      </h3>
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">Nome da Linhagem</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs text-slate-100"
          placeholder="Ex: Pseudo Celestial"
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">Descrição</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs text-slate-100"
          placeholder="Origem biológica ou anomalia..."
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">Habilidades Passivas (1 por linha)</label>
        <textarea
          rows={2}
          value={passives}
          onChange={(e) => setPassives(e.target.value)}
          className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs text-slate-100 font-mono"
          placeholder="Ex: Visão do Véu: Discernimento..."
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200">
          Cancelar
        </button>
        <button
          onClick={() =>
            onSave({
              name,
              description,
              passives: passives.split('\n').filter((p: string) => p.trim()),
            })
          }
          className="px-4 py-1 bg-rose-900 hover:bg-rose-800 text-white rounded text-xs font-mono font-bold"
        >
          Salvar Raça
        </button>
      </div>
    </div>
  );
};

const AbilityForm: React.FC<{ initialData: any; onSave: (d: any) => void; onCancel: () => void }> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || 'Paranormal');
  const [description, setDescription] = useState(initialData?.description || '');
  const [execution, setExecution] = useState(initialData?.execution || 'Ação Padrão');
  const [range, setRange] = useState(initialData?.range || 'Pessoal');
  const [prCost, setPrCost] = useState(initialData?.prCost || 0);
  const [effect, setEffect] = useState(initialData?.effect || '');

  return (
    <div className="p-4 bg-[#12151C] border border-[#232734] rounded-lg space-y-3">
      <h3 className="font-title-paranormal text-sm font-bold text-slate-200">
        {initialData?.id ? 'EDITAR HABILIDADE' : 'CRIAR HABILIDADE'}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs font-mono text-slate-100"
          >
            <option value="Racial">Racial</option>
            <option value="Classe">Classe</option>
            <option value="Presença">Presença</option>
            <option value="Combate">Combate</option>
            <option value="Paranormal">Paranormal</option>
            <option value="Individualidade">Individualidade</option>
            <option value="Marca">Marca</option>
            <option value="Especial">Especial</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">Descrição</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs text-slate-100"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Gasto de PR</label>
          <input
            type="number"
            value={prCost}
            onChange={(e) => setPrCost(Number(e.target.value))}
            className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Execução</label>
          <input
            type="text"
            value={execution}
            onChange={(e) => setExecution(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Alcance</label>
          <input
            type="text"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs text-slate-100"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200">
          Cancelar
        </button>
        <button
          onClick={() =>
            onSave({
              name,
              category,
              description,
              execution,
              range,
              prCost,
              effect,
            })
          }
          className="px-4 py-1 bg-rose-900 hover:bg-rose-800 text-white rounded text-xs font-mono font-bold"
        >
          Salvar Habilidade
        </button>
      </div>
    </div>
  );
};

const RitualForm: React.FC<{ initialData: any; onSave: (d: any) => void; onCancel: () => void }> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [prCost, setPrCost] = useState(initialData?.prCost || 15);
  const [troca, setTroca] = useState(initialData?.troca || '20%');
  const [execution, setExecution] = useState(initialData?.execution || 'Ação Padrão');
  const [range, setRange] = useState(initialData?.range || 'Médio');
  const [damageFormula, setDamageFormula] = useState(initialData?.damageFormula || '');
  const [damageType, setDamageType] = useState(initialData?.damageType || 'Paranormal');

  return (
    <div className="p-4 bg-[#12151C] border border-[#232734] rounded-lg space-y-3">
      <h3 className="font-title-paranormal text-sm font-bold text-purple-200">
        {initialData?.id ? 'EDITAR RITUAL' : 'CRIAR NOVO RITUAL'}
      </h3>
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">Nome do Ritual</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs text-purple-100 font-bold"
          placeholder="Ex: CHAMA DA ENTONA"
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">Descrição & Efeitos</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs text-slate-100"
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Gasto PR</label>
          <input
            type="number"
            value={prCost}
            onChange={(e) => setPrCost(Number(e.target.value))}
            className="w-full px-2 py-1 bg-[#090B0E] border border-[#232734] rounded text-xs text-sky-400"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Troca %</label>
          <input
            type="text"
            value={troca}
            onChange={(e) => setTroca(e.target.value)}
            className="w-full px-2 py-1 bg-[#090B0E] border border-[#232734] rounded text-xs text-rose-400"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Dano / Fórmula</label>
          <input
            type="text"
            value={damageFormula}
            onChange={(e) => setDamageFormula(e.target.value)}
            className="w-full px-2 py-1 bg-[#090B0E] border border-[#232734] rounded text-xs text-amber-400"
            placeholder="Ex: 4d12"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Tipo de Dano</label>
          <input
            type="text"
            value={damageType}
            onChange={(e) => setDamageType(e.target.value)}
            className="w-full px-2 py-1 bg-[#090B0E] border border-[#232734] rounded text-xs text-slate-200"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200">
          Cancelar
        </button>
        <button
          onClick={() =>
            onSave({
              name,
              description,
              prCost,
              troca,
              execution,
              range,
              damageFormula,
              damageType,
            })
          }
          className="px-4 py-1 bg-purple-900 hover:bg-purple-800 text-white rounded text-xs font-mono font-bold"
        >
          Salvar Ritual
        </button>
      </div>
    </div>
  );
};

const ItemForm: React.FC<{ initialData: any; onSave: (d: any) => void; onCancel: () => void }> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || 'Itens Paranormais');
  const [rarity, setRarity] = useState(initialData?.rarity || 'Incomum');
  const [playerDescription, setPlayerDescription] = useState(initialData?.playerDescription || '');
  const [masterSecretDescription, setMasterSecretDescription] = useState(initialData?.masterSecretDescription || '');
  const [effect, setEffect] = useState(initialData?.effect || '');

  return (
    <div className="p-4 bg-[#12151C] border border-[#232734] rounded-lg space-y-3">
      <h3 className="font-title-paranormal text-sm font-bold text-amber-200">
        {initialData?.id ? 'EDITAR ITEM' : 'CRIAR ITEM OU RELÍQUIA'}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-mono text-slate-400 mb-1">Nome do Objeto</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs font-mono text-slate-100"
          >
            <option value="Armas">Armas</option>
            <option value="Equipamentos">Equipamentos</option>
            <option value="Consumíveis">Consumíveis</option>
            <option value="Itens Paranormais">Itens Paranormais</option>
            <option value="Itens Amaldiçoados">Itens Amaldiçoados</option>
            <option value="Itens Endiabrados">Itens Endiabrados</option>
            <option value="Documentos">Documentos</option>
            <option value="Objetos de Missão">Objetos de Missão</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">Descrição Pública (Visível ao Jogador)</label>
        <textarea
          rows={2}
          value={playerDescription}
          onChange={(e) => setPlayerDescription(e.target.value)}
          className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs text-slate-100"
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-red-400 mb-1">Segredo Oculto do Mestre (Restrito)</label>
        <textarea
          rows={2}
          value={masterSecretDescription}
          onChange={(e) => setMasterSecretDescription(e.target.value)}
          className="w-full px-3 py-1.5 bg-[#090B0E] border border-red-900/50 rounded text-xs text-red-200"
          placeholder="Verdade oculta, maldições latentes..."
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">Efeito Mecânico</label>
        <input
          type="text"
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs text-emerald-300"
          placeholder="Ex: Concede +2 em Percepção..."
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200">
          Cancelar
        </button>
        <button
          onClick={() =>
            onSave({
              name,
              category,
              rarity,
              playerDescription,
              masterSecretDescription,
              effect,
            })
          }
          className="px-4 py-1 bg-amber-900 hover:bg-amber-800 text-white rounded text-xs font-mono font-bold"
        >
          Salvar Item
        </button>
      </div>
    </div>
  );
};
