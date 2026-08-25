import {
  User,
  Campaign,
  Character,
  Creature,
  NPC,
  RollHistoryEntry,
  SessionEvent,
  ThemeEffect,
  CampaignSessionData,
  Race,
  Ability,
  Ritual,
  InventoryItem
} from '../types';

const API_BASE = '/api';

export function getAuthHeaders(user?: User | null): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(user ? { 'x-user-id': user.id } : {}),
  };
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/auth/users`);
  if (!res.ok) throw new Error('Falha ao obter lista de usuários');
  return res.json();
}

export async function loginUser(username: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erro no login');
  }
  return res.json();
}

export async function registerUser(data: { username: string; name: string; email?: string; role: 'MASTER' | 'PLAYER' }): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erro no registro');
  }
  return res.json();
}

export async function fetchCampaigns(currentUser: User): Promise<Campaign[]> {
  const res = await fetch(`${API_BASE}/campaigns`, {
    headers: getAuthHeaders(currentUser),
  });
  if (!res.ok) throw new Error('Falha ao carregar campanhas');
  return res.json();
}

export async function createCampaign(data: Partial<Campaign>, currentUser: User): Promise<Campaign> {
  const res = await fetch(`${API_BASE}/campaigns`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao criar campanha');
  return res.json();
}

export async function joinCampaignByCode(code: string, currentUser: User): Promise<{ campaign: Campaign; message: string }> {
  const res = await fetch(`${API_BASE}/campaigns/join`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Código inválido');
  }
  return res.json();
}

export async function updateCampaignTheme(campaignId: string, themeEffect: ThemeEffect, currentUser: User): Promise<Campaign> {
  const res = await fetch(`${API_BASE}/campaigns/${campaignId}/theme`, {
    method: 'PATCH',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify({ themeEffect }),
  });
  if (!res.ok) throw new Error('Falha ao alterar tema da sessão');
  return res.json();
}

export async function updateCampaignNotes(campaignId: string, sharedNotes: string, currentUser: User): Promise<Campaign> {
  const res = await fetch(`${API_BASE}/campaigns/${campaignId}/notes`, {
    method: 'PATCH',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify({ sharedNotes }),
  });
  if (!res.ok) throw new Error('Falha ao salvar anotações da campanha');
  return res.json();
}

// ==================== CHARACTERS ====================
export async function fetchCharacters(campaignId: string, currentUser: User): Promise<Character[]> {
  const res = await fetch(`${API_BASE}/characters?campaignId=${campaignId}`, {
    headers: getAuthHeaders(currentUser),
  });
  if (!res.ok) throw new Error('Falha ao obter personagens');
  return res.json();
}

export async function fetchCharacterById(id: string, currentUser: User): Promise<Character> {
  const res = await fetch(`${API_BASE}/characters/${id}`, {
    headers: getAuthHeaders(currentUser),
  });
  if (!res.ok) throw new Error('Falha ao obter ficha');
  return res.json();
}

export async function createCharacter(char: Partial<Character>, currentUser: User): Promise<Character> {
  const res = await fetch(`${API_BASE}/characters`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(char),
  });
  if (!res.ok) throw new Error('Falha ao criar personagem');
  return res.json();
}

export async function updateCharacter(id: string, char: Partial<Character>, currentUser: User): Promise<Character> {
  const res = await fetch(`${API_BASE}/characters/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(char),
  });
  if (!res.ok) throw new Error('Falha ao atualizar personagem');
  return res.json();
}

export async function saveCharacter(char: Character, currentUser: User): Promise<Character> {
  return updateCharacter(char.id, char, currentUser);
}

export async function deleteCharacter(id: string, currentUser: User): Promise<{ message: string; id: string }> {
  const res = await fetch(`${API_BASE}/characters/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(currentUser),
  });
  if (!res.ok) throw new Error('Falha ao excluir personagem');
  return res.json();
}

export async function duplicateCharacter(id: string, currentUser: User): Promise<Character> {
  const res = await fetch(`${API_BASE}/characters/${id}/duplicate`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
  });
  if (!res.ok) throw new Error('Falha ao duplicar personagem');
  return res.json();
}

export async function patchCharacterResources(
  charId: string,
  resources: Partial<Character['resources']>,
  currentUser: User
): Promise<{ success: boolean; resources: Character['resources'] }> {
  const res = await fetch(`${API_BASE}/characters/${charId}/resources`, {
    method: 'PATCH',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(resources),
  });
  if (!res.ok) throw new Error('Falha ao atualizar recursos');
  return res.json();
}

// ==================== RACES CRUD ====================
export async function fetchRaces(): Promise<Race[]> {
  const res = await fetch(`${API_BASE}/races`);
  if (!res.ok) throw new Error('Falha ao carregar raças');
  return res.json();
}

export async function createRace(data: Partial<Race>, currentUser: User): Promise<Race> {
  const res = await fetch(`${API_BASE}/races`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao criar raça');
  return res.json();
}

export async function updateRace(id: string, data: Partial<Race>, currentUser: User): Promise<Race> {
  const res = await fetch(`${API_BASE}/races/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao atualizar raça');
  return res.json();
}

export async function deleteRace(id: string, currentUser: User): Promise<void> {
  await fetch(`${API_BASE}/races/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(currentUser),
  });
}

// ==================== ABILITIES CATALOG ====================
export async function fetchAbilitiesCatalog(): Promise<Ability[]> {
  const res = await fetch(`${API_BASE}/abilities`);
  if (!res.ok) throw new Error('Falha ao carregar habilidades');
  return res.json();
}

export async function createAbilityCatalog(data: Partial<Ability>, currentUser: User): Promise<Ability> {
  const res = await fetch(`${API_BASE}/abilities`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao cadastrar habilidade');
  return res.json();
}

export async function updateAbilityCatalog(id: string, data: Partial<Ability>, currentUser: User): Promise<Ability> {
  const res = await fetch(`${API_BASE}/abilities/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao atualizar habilidade');
  return res.json();
}

export async function deleteAbilityCatalog(id: string, currentUser: User): Promise<void> {
  await fetch(`${API_BASE}/abilities/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(currentUser),
  });
}

// ==================== RITUALS CATALOG ====================
export async function fetchRitualsCatalog(): Promise<Ritual[]> {
  const res = await fetch(`${API_BASE}/rituals`);
  if (!res.ok) throw new Error('Falha ao carregar rituais');
  return res.json();
}

export async function createRitualCatalog(data: Partial<Ritual>, currentUser: User): Promise<Ritual> {
  const res = await fetch(`${API_BASE}/rituals`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao cadastrar ritual');
  return res.json();
}

export async function updateRitualCatalog(id: string, data: Partial<Ritual>, currentUser: User): Promise<Ritual> {
  const res = await fetch(`${API_BASE}/rituals/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao atualizar ritual');
  return res.json();
}

export async function deleteRitualCatalog(id: string, currentUser: User): Promise<void> {
  await fetch(`${API_BASE}/rituals/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(currentUser),
  });
}

// ==================== ITEMS CATALOG ====================
export async function fetchItemsCatalog(): Promise<InventoryItem[]> {
  const res = await fetch(`${API_BASE}/items`);
  if (!res.ok) throw new Error('Falha ao carregar itens');
  return res.json();
}

export async function createItemCatalog(data: Partial<InventoryItem>, currentUser: User): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao cadastrar item');
  return res.json();
}

export async function updateItemCatalog(id: string, data: Partial<InventoryItem>, currentUser: User): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao atualizar item');
  return res.json();
}

export async function deleteItemCatalog(id: string, currentUser: User): Promise<void> {
  await fetch(`${API_BASE}/items/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(currentUser),
  });
}

// ==================== ROLLS & COMBAT ====================
export async function rollDice(
  data: {
    campaignId: string;
    characterName: string;
    rollType: 'PERÍCIA' | 'ATAQUE' | 'DANO' | 'RITUAL' | 'LIVRE';
    rollName: string;
    formula: string;
    circumstanceMod?: number;
  },
  currentUser: User
): Promise<RollHistoryEntry> {
  const res = await fetch(`${API_BASE}/rolls`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao registrar rolagem');
  return res.json();
}

export async function fetchRollHistory(campaignId: string, currentUser: User): Promise<RollHistoryEntry[]> {
  const res = await fetch(`${API_BASE}/rolls?campaignId=${campaignId}`, {
    headers: getAuthHeaders(currentUser),
  });
  if (!res.ok) throw new Error('Falha ao obter histórico de rolagens');
  return res.json();
}

export async function sendBroadcast(campaignId: string, message: string, title?: string, currentUser?: User): Promise<void> {
  await fetch(`${API_BASE}/session/broadcast`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify({ campaignId, message, title }),
  });
}

export async function sendWhisper(campaignId: string, targetUserId: string, message: string, currentUser?: User): Promise<void> {
  await fetch(`${API_BASE}/session/whisper`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify({ campaignId, targetUserId, message }),
  });
}

export async function grantItemToCharacter(characterId: string, item: any, currentUser?: User): Promise<void> {
  await fetch(`${API_BASE}/session/grant-item`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify({ characterId, item }),
  });
}

export async function fetchNpcs(campaignId: string, currentUser: User): Promise<NPC[]> {
  const res = await fetch(`${API_BASE}/campaigns/${campaignId}/npcs`, {
    headers: getAuthHeaders(currentUser),
  });
  if (!res.ok) throw new Error('Falha ao obter NPCs');
  return res.json();
}
export const fetchNPCs = fetchNpcs;

export async function createNpc(campaignId: string, data: Partial<NPC>, currentUser: User): Promise<NPC> {
  const res = await fetch(`${API_BASE}/campaigns/${campaignId}/npcs`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao criar NPC');
  return res.json();
}

export async function deleteNpc(npcId: string, currentUser: User): Promise<void> {
  await fetch(`${API_BASE}/npcs/${npcId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(currentUser),
  });
}

export async function toggleNpcReveal(npcId: string, currentUser: User): Promise<NPC> {
  const res = await fetch(`${API_BASE}/npcs/${npcId}/reveal`, {
    method: 'PATCH',
    headers: getAuthHeaders(currentUser),
  });
  if (!res.ok) throw new Error('Falha ao alterar visibilidade do NPC');
  return res.json();
}

export async function fetchCreatures(campaignId: string, currentUser: User): Promise<Creature[]> {
  const res = await fetch(`${API_BASE}/campaigns/${campaignId}/creatures`, {
    headers: getAuthHeaders(currentUser),
  });
  if (!res.ok) throw new Error('Falha ao carregar bestiário');
  return res.json();
}

export async function createCreature(campaignId: string, data: Partial<Creature>, currentUser: User): Promise<Creature> {
  const res = await fetch(`${API_BASE}/campaigns/${campaignId}/creatures`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao cadastrar entidade');
  return res.json();
}

export async function deleteCreature(creatureId: string, currentUser: User): Promise<void> {
  await fetch(`${API_BASE}/creatures/${creatureId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(currentUser),
  });
}

export async function cloneCreature(creatureId: string, currentUser: User): Promise<Creature> {
  const res = await fetch(`${API_BASE}/creatures/${creatureId}/clone`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
  });
  if (!res.ok) throw new Error('Falha ao duplicar entidade para combate');
  return res.json();
}

export async function fetchSessionData(campaignId: string, currentUser: User): Promise<CampaignSessionData> {
  const res = await fetch(`${API_BASE}/campaigns/${campaignId}/session`, {
    headers: getAuthHeaders(currentUser),
  });
  if (!res.ok) {
    return {
      activeScene: 'Investigação em Campo',
      theme: 'padrao',
      round: 1,
    };
  }
  return res.json();
}

export async function triggerSessionTheme(campaignId: string, theme: string, currentUser: User): Promise<void> {
  await fetch(`${API_BASE}/campaigns/${campaignId}/theme`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify({ theme }),
  });
}

export async function broadcastAlert(
  campaignId: string,
  alert: { title: string; message: string; type: string },
  currentUser: User
): Promise<void> {
  await fetch(`${API_BASE}/campaigns/${campaignId}/broadcast`, {
    method: 'POST',
    headers: getAuthHeaders(currentUser),
    body: JSON.stringify(alert),
  });
}

export function subscribeToCampaignEvents(
  campaignId: string,
  onEvent: (event: SessionEvent) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const eventSource = new EventSource(`${API_BASE}/campaigns/${campaignId}/events`);
    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        onEvent(parsed);
      } catch (err) {
        console.error('Error parsing SSE event', err);
      }
    };
    eventSource.onerror = (err) => {
      if (onError) onError(err);
    };
    return () => {
      eventSource.close();
    };
  } catch (err) {
    return () => {};
  }
}
