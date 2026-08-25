import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_USERS,
  INITIAL_CAMPAIGNS,
  INITIAL_CHARACTERS,
  INITIAL_CREATURES,
  INITIAL_NPCS,
  INITIAL_ROLLS,
  INITIAL_RACES,
  INITIAL_ABILITIES_CATALOG,
  INITIAL_RITUALS_CATALOG,
  INITIAL_ITEMS_CATALOG,
} from './src/data/mockData.ts';
import {
  User,
  Campaign,
  Character,
  Creature,
  NPC,
  RollHistoryEntry,
  SessionEvent,
  ThemeEffect,
  Race,
  Ability,
  Ritual,
  InventoryItem
} from './src/types.ts';

// In-Memory Database with Relational Collections
const db = {
  users: [...INITIAL_USERS],
  campaigns: [...INITIAL_CAMPAIGNS],
  characters: JSON.parse(JSON.stringify(INITIAL_CHARACTERS)) as Character[],
  creatures: JSON.parse(JSON.stringify(INITIAL_CREATURES)) as Creature[],
  npcs: JSON.parse(JSON.stringify(INITIAL_NPCS)) as NPC[],
  rolls: JSON.parse(JSON.stringify(INITIAL_ROLLS)) as RollHistoryEntry[],
  races: JSON.parse(JSON.stringify(INITIAL_RACES)) as Race[],
  abilitiesCatalog: JSON.parse(JSON.stringify(INITIAL_ABILITIES_CATALOG)) as Ability[],
  ritualsCatalog: JSON.parse(JSON.stringify(INITIAL_RITUALS_CATALOG)) as Ritual[],
  itemsCatalog: JSON.parse(JSON.stringify(INITIAL_ITEMS_CATALOG)) as InventoryItem[],
  sessionEvents: [] as SessionEvent[],
  sessions: {
    'camp-conv-01': {
      activeScene: 'Farol das Lamentações - Investigação Noturna',
      theme: 'padrao',
      round: 1,
      currentTurnIndex: 0,
    },
  } as Record<string, any>,
};

// SSE active clients
interface SSEClient {
  id: string;
  userId: string;
  campaignId: string;
  res: Response;
}
let sseClients: SSEClient[] = [];

function broadcastToCampaign(campaignId: string, event: SessionEvent) {
  db.sessionEvents.unshift(event);
  if (db.sessionEvents.length > 100) {
    db.sessionEvents.pop();
  }

  const payload = `data: ${JSON.stringify(event)}\n\n`;
  sseClients.forEach((client) => {
    if (client.campaignId === campaignId) {
      if (!event.targetUserId || event.targetUserId === client.userId || client.userId === 'usr-master-01') {
        try {
          client.res.write(payload);
        } catch {
          // handled on close
        }
      }
    }
  });
}

// Security sanitization for players
function isMasterUser(user: User, campaign?: Campaign): boolean {
  return user.role === 'MASTER' || user.role === 'MESTRE' || (campaign ? campaign.masterId === user.id : false);
}

function sanitizeCharacterForUser(character: Character, user: User, campaign?: Campaign): Character {
  if (!character) return character;
  // Deep clone to safely mutate
  const sanitized: Character = JSON.parse(JSON.stringify(character));

  // Ensure all array fields are defined as arrays
  sanitized.skills = sanitized.skills || [];
  sanitized.weapons = sanitized.weapons || [];
  sanitized.abilities = sanitized.abilities || [];
  sanitized.rituals = sanitized.rituals || [];
  sanitized.inventory = (sanitized.inventory || []).map((item) => ({
    ...item,
    tags: item.tags || ['Geral'],
  }));
  sanitized.conditions = sanitized.conditions || [];
  sanitized.notes = sanitized.notes || '';

  const isMaster = isMasterUser(user, campaign);
  if (isMaster) {
    return sanitized;
  }

  // 1. Completely delete master secrets
  delete sanitized.masterSecrets;

  // 2. Filter inventory secret descriptions
  if (sanitized.inventory) {
    sanitized.inventory = sanitized.inventory.map((item) => {
      if (!item.isSecretRevealed) {
        delete item.masterSecretDescription;
      }
      return item;
    });
  }

  // 3. Filter individuality secret lore if locked
  if (sanitized.individuality && sanitized.individuality.levels) {
    sanitized.individuality.levels = sanitized.individuality.levels.map((lvl) => {
      if (!lvl.unlocked) {
        delete lvl.secretLore;
      }
      return lvl;
    });
  }

  // 4. Filter Mark secret notes if unrevealed
  if (sanitized.mark && !sanitized.mark.revealed) {
    delete sanitized.mark.secretNotes;
  }

  return sanitized;
}

// Current logged in simulation or header auth
function getRequester(req: Request): User {
  const userIdHeader = req.headers['x-user-id'] as string;
  if (userIdHeader) {
    const found = db.users.find((u) => u.id === userIdHeader);
    if (found) return found;
  }
  // Default to master or first user
  return db.users[0];
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==================== AUTH & USERS ====================
  app.get('/api/auth/users', (req, res) => {
    res.json(db.users);
  });

  app.get('/api/auth/me', (req, res) => {
    const user = getRequester(req);
    res.json(user);
  });

  app.post('/api/auth/login', (req, res) => {
    const { username } = req.body;
    const user = db.users.find((u) => u.username.toLowerCase() === (username || '').toLowerCase());
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado no arquivo.' });
    }
    res.json(user);
  });

  app.post('/api/auth/register', (req, res) => {
    const { username, name, email, role } = req.body;
    if (!username || !name) {
      return res.status(400).json({ error: 'Dados incompletos para registro.' });
    }
    const exists = db.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      return res.status(409).json({ error: 'Nome de usuário já registrado nos arquivos.' });
    }
    const newUser: User = {
      id: `usr-${Date.now()}`,
      username,
      name,
      email: email || `${username}@misteriodailha.org`,
      role: role === 'MASTER' ? 'MASTER' : 'PLAYER',
    };
    db.users.push(newUser);
    res.status(201).json(newUser);
  });

  // ==================== CAMPAIGNS ====================
  app.get('/api/campaigns', (req, res) => {
    const user = getRequester(req);
    if (isMasterUser(user)) {
      return res.json(db.campaigns);
    }
    // Player sees campaigns where they have characters
    const userChars = db.characters.filter((c) => c.userId === user.id);
    const campaignIds = new Set(userChars.map((c) => c.campaignId));
    const accessible = db.campaigns.filter((c) => campaignIds.has(c.id) || c.masterId === user.id);
    res.json(accessible.length ? accessible : db.campaigns);
  });

  app.get('/api/campaigns/:id', (req, res) => {
    const user = getRequester(req);
    const campaign = db.campaigns.find((c) => c.id === req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campanha não encontrada.' });
    }
    res.json(campaign);
  });

  app.get('/api/campaigns/:id/session', (req, res) => {
    const session = db.sessions[req.params.id] || {
      activeScene: 'Farol das Lamentações - Investigação Noturna',
      theme: 'padrao',
      round: 1,
      currentTurnIndex: 0,
    };
    res.json(session);
  });

  app.patch('/api/campaigns/:id/session', (req, res) => {
    const campaignId = req.params.id;
    if (!db.sessions[campaignId]) {
      db.sessions[campaignId] = {
        activeScene: 'Investigação em Campo',
        theme: 'padrao',
        round: 1,
      };
    }
    db.sessions[campaignId] = { ...db.sessions[campaignId], ...req.body };
    res.json(db.sessions[campaignId]);
  });

  app.post('/api/campaigns', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) {
      return res.status(403).json({ error: 'Apenas Mestres podem criar novos dossiês de campanha.' });
    }
    const { name, description, banner } = req.body;
    const code = `ILHA-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name: name || 'NOVA INVESTIGAÇÃO',
      code,
      description: description || 'Arquivo confidencial de investigação paranormal.',
      banner: banner || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
      masterId: user.id,
      masterName: user.name,
      themeEffect: 'NORMAL',
      sharedNotes: '',
      createdAt: new Date().toISOString(),
    };
    db.campaigns.push(newCamp);
    res.status(201).json(newCamp);
  });

  app.post('/api/campaigns/join', (req, res) => {
    const { code } = req.body;
    const campaign = db.campaigns.find((c) => c.code.toUpperCase() === (code || '').trim().toUpperCase());
    if (!campaign) {
      return res.status(404).json({ error: 'Código de campanha inválido ou não autorizado.' });
    }
    res.json({ message: 'Acesso autorizado ao dossiê de campanha.', campaign });
  });

  app.patch('/api/campaigns/:id/theme', (req, res) => {
    const user = getRequester(req);
    const campaign = db.campaigns.find((c) => c.id === req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada.' });
    if (!isMasterUser(user, campaign)) {
      return res.status(403).json({ error: 'Apenas o Mestre pode alterar temas e anomalias de sessão.' });
    }
    const { themeEffect } = req.body as { themeEffect: ThemeEffect };
    campaign.themeEffect = themeEffect;

    broadcastToCampaign(campaign.id, {
      id: `evt-${Date.now()}`,
      campaignId: campaign.id,
      type: 'THEME_TRIGGER',
      senderName: user.name,
      title: 'ANOMALIA AMBIENTAL DETECTADA',
      message: `A atmosfera da Ilha mudou para o estado: [${themeEffect}]`,
      payload: { themeEffect },
      timestamp: new Date().toISOString(),
    });

    res.json(campaign);
  });

  app.patch('/api/campaigns/:id/notes', (req, res) => {
    const campaign = db.campaigns.find((c) => c.id === req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada.' });
    campaign.sharedNotes = req.body.sharedNotes || '';
    res.json(campaign);
  });

  // ==================== CHARACTERS CRUD ====================
  app.get('/api/characters', (req, res) => {
    const user = getRequester(req);
    const campaignId = req.query.campaignId as string;
    let list = db.characters;
    if (campaignId) {
      list = list.filter((c) => c.campaignId === campaignId);
    }
    const campaign = campaignId ? db.campaigns.find((cp) => cp.id === campaignId) : undefined;
    const sanitized = list.map((c) => sanitizeCharacterForUser(c, user, campaign));
    res.json(sanitized);
  });

  app.get('/api/characters/:id', (req, res) => {
    const user = getRequester(req);
    const char = db.characters.find((c) => c.id === req.params.id);
    if (!char) return res.status(404).json({ error: 'Ficha de personagem não encontrada no arquivo.' });
    const campaign = db.campaigns.find((cp) => cp.id === char.campaignId);
    res.json(sanitizeCharacterForUser(char, user, campaign));
  });

  app.post('/api/characters', (req, res) => {
    const user = getRequester(req);
    const data = req.body as Partial<Character>;
    const newChar: Character = {
      id: `char-${Date.now()}`,
      campaignId: data.campaignId || db.campaigns[0]?.id || 'camp-conv-01',
      userId: data.userId || user.id,
      name: (data.name || 'NOVO AGENTE').toUpperCase(),
      archiveCode: `ARQ-${Math.floor(1000 + Math.random() * 9000)}-${(data.name || 'AGT').substring(0, 3).toUpperCase()}`,
      classification: data.classification || 'CONFIDENCIAL // GRAU I',
      nickname: data.nickname || '',
      age: data.age || 20,
      height: data.height || '1.75m',
      gender: data.gender || 'Indefinido',
      orientation: data.orientation || 'Agente de Campo',
      race: data.race || 'Humano',
      level: data.level || 1,
      statusPhrase: data.statusPhrase || 'Sob investigação ativa.',
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      presence: data.presence || {
        aspect: 'ENTONA',
        colorName: 'Branca',
        hexColor: '#F8FAFC',
        level: 1,
        stage: 'Estágio I - Desperto',
        description: 'Vibração silenciosa da presença.',
        effects: 'Nenhum efeito registrado.',
        specialProperties: 'Nenhuma propriedade anômala registrada.',
      },
      mark: data.mark || {
        type: 'SOL',
        symbol: '☀',
        concept: 'MATÉRIA',
        stage: 'Grau I',
        revealed: true,
        description: 'Marca gravada sob a pele.',
        powers: [],
        revealedNotes: '',
      },
      resources: data.resources || {
        pv: { current: 100, max: 100, temp: 0 },
        pr: { current: 80, max: 80, temp: 0 },
        defense: 14,
        defenseBonus: 0,
        customResources: [],
      },
      attributes: data.attributes || {
        for: { value: 2, description: 'Força física direta' },
        des: { value: 2, description: 'Destreza e agilidade' },
        con: { value: 2, description: 'Constituição e vigor' },
        int: { value: 2, description: 'Inteligência e análise' },
        sab: { value: 2, description: 'Sabedoria e intuição' },
        car: { value: 2, description: 'Carisma e presença' },
      },
      skills: data.skills || [
        { id: `sk-${Date.now()}-1`, name: 'Pontaria', baseAttr: 'des', value: 5, training: 'Treinado', bonus: 0 },
        { id: `sk-${Date.now()}-2`, name: 'Luta', baseAttr: 'for', value: 5, training: 'Treinado', bonus: 0 },
        { id: `sk-${Date.now()}-3`, name: 'Investigação', baseAttr: 'int', value: 5, training: 'Treinado', bonus: 0 },
        { id: `sk-${Date.now()}-4`, name: 'Ocultismo / Paranormal', baseAttr: 'int', value: 5, training: 'Treinado', bonus: 0 },
        { id: `sk-${Date.now()}-5`, name: 'Percepção', baseAttr: 'sab', value: 5, training: 'Treinado', bonus: 0 },
      ],
      weapons: data.weapons || [],
      abilities: data.abilities || [],
      rituals: data.rituals || [],
      inventory: data.inventory || [],
      individuality: data.individuality || {
        name: 'INDIVIDUALIDADE LATENTE',
        concept: 'Em processo de maturação paranormal.',
        description: 'Anomalia biológica sob observação.',
        levels: [
          { level: 1, title: 'DESPERTAR DO VÉU', unlocked: true, status: 'DOMINADO', description: 'Primeiros sinais da singularidade.', requirements: 'Contato com a Ilha.' },
          { level: 2, title: '████ BLOQUEADO ████', unlocked: false, status: 'BLOQUEADO', description: 'Grau II sob sigilo.', requirements: 'Autorização do Mestre.' },
          { level: 3, title: '████ BLOQUEADO ████', unlocked: false, status: 'BLOQUEADO', description: 'Grau III sob sigilo.', requirements: 'Autorização do Mestre.' },
          { level: 4, title: '████ BLOQUEADO ████', unlocked: false, status: 'BLOQUEADO', description: 'Grau IV sob sigilo.', requirements: 'Autorização do Mestre.' },
          { level: 5, title: '████ BLOQUEADO ████', unlocked: false, status: 'DESCONHECIDO', description: 'Grau V sob sigilo.', requirements: 'Autorização do Mestre.' },
        ],
      },
      conditions: data.conditions || [],
      history: data.history || data.bio || {
        history: 'Dossiê em construção pelo setor de recrutamento.',
        lore: 'Dossiê em construção pelo setor de recrutamento.',
        appearance: '',
        personality: '',
        goals: '',
        fears: '',
        relationships: '',
        allies: '',
        enemies: '',
        family: '',
        keyMoments: '',
        notes: '',
      },
      bio: data.bio || data.history || {
        history: 'Dossiê em construção pelo setor de recrutamento.',
        lore: 'Dossiê em construção pelo setor de recrutamento.',
        appearance: '',
        personality: '',
        goals: '',
        fears: '',
        relationships: '',
        allies: '',
        enemies: '',
        family: '',
        keyMoments: '',
        notes: '',
      },
      updatedAt: new Date().toISOString(),
    };
    db.characters.push(newChar);
    res.status(201).json(newChar);
  });

  app.put('/api/characters/:id', (req, res) => {
    const user = getRequester(req);
    const index = db.characters.findIndex((c) => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Personagem não encontrado.' });

    const existing = db.characters[index];
    const isMaster = user.role === 'MASTER' || user.role === 'MESTRE';
    if (!isMaster && existing.userId !== user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para alterar este personagem.' });
    }

    const updated: Character = {
      ...existing,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    // If player tried to overwrite masterSecrets, preserve original
    if (!isMaster && existing.masterSecrets) {
      updated.masterSecrets = existing.masterSecrets;
    }

    db.characters[index] = updated;

    res.json(sanitizeCharacterForUser(updated, user));
  });

  app.delete('/api/characters/:id', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) {
      return res.status(403).json({ error: 'Apenas o Mestre pode excluir permanentemente um dossiê.' });
    }
    const index = db.characters.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Dossiê não encontrado para remoção.' });
    }
    const removed = db.characters.splice(index, 1)[0];
    res.json({ message: `Dossiê de ${removed.name} foi arquivado e destruído permanentemente.`, id: removed.id });
  });

  app.post('/api/characters/:id/duplicate', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) {
      return res.status(403).json({ error: 'Apenas o Mestre pode duplicar dossiês.' });
    }
    const original = db.characters.find((c) => c.id === req.params.id);
    if (!original) return res.status(404).json({ error: 'Personagem não encontrado.' });

    const duplicated: Character = {
      ...JSON.parse(JSON.stringify(original)),
      id: `char-${Date.now()}`,
      name: `${original.name} (CÓPIA)`,
      archiveCode: `ARQ-${Math.floor(1000 + Math.random() * 9000)}-CPY`,
      updatedAt: new Date().toISOString(),
    };
    db.characters.push(duplicated);
    res.status(201).json(duplicated);
  });

  app.patch('/api/characters/:id/resources', (req, res) => {
    const char = db.characters.find((c) => c.id === req.params.id);
    if (!char) return res.status(404).json({ error: 'Personagem não encontrado.' });

    const { pv, pr, defense, defenseBonus, customResources } = req.body;
    if (pv !== undefined) char.resources.pv = pv;
    if (pr !== undefined) char.resources.pr = pr;
    if (defense !== undefined) char.resources.defense = defense;
    if (defenseBonus !== undefined) char.resources.defenseBonus = defenseBonus;
    if (customResources !== undefined) char.resources.customResources = customResources;
    char.updatedAt = new Date().toISOString();

    res.json({ success: true, resources: char.resources });
  });

  // ==================== RACES CRUD ====================
  app.get('/api/races', (req, res) => {
    res.json(db.races);
  });

  app.post('/api/races', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas o Mestre.' });
    const newRace: Race = {
      id: `race-${Date.now()}`,
      name: req.body.name || 'Nova Raça',
      description: req.body.description || '',
      passives: req.body.passives || [],
      abilities: req.body.abilities || [],
      progression: req.body.progression || '',
      secretLore: req.body.secretLore || '',
      imageUrl: req.body.imageUrl || '',
    };
    db.races.push(newRace);
    res.status(201).json(newRace);
  });

  app.put('/api/races/:id', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas o Mestre.' });
    const idx = db.races.findIndex((r) => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Raça não encontrada.' });
    db.races[idx] = { ...db.races[idx], ...req.body };
    res.json(db.races[idx]);
  });

  app.delete('/api/races/:id', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas o Mestre.' });
    db.races = db.races.filter((r) => r.id !== req.params.id);
    res.json({ success: true });
  });

  // ==================== ABILITIES CATALOG CRUD ====================
  app.get('/api/abilities', (req, res) => {
    res.json(db.abilitiesCatalog);
  });

  app.post('/api/abilities', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas o Mestre.' });
    const newAb: Ability = {
      id: `ab-cat-${Date.now()}`,
      name: req.body.name || 'Nova Habilidade',
      category: req.body.category || 'Paranormal',
      description: req.body.description || '',
      execution: req.body.execution || 'Ação Padrão',
      range: req.body.range || 'Pessoal',
      duration: req.body.duration || 'Instantânea',
      prCost: Number(req.body.prCost || 0),
      effect: req.body.effect || '',
      prerequisites: req.body.prerequisites || '',
      status: req.body.status || 'PÚBLICA',
    };
    db.abilitiesCatalog.push(newAb);
    res.status(201).json(newAb);
  });

  app.put('/api/abilities/:id', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas o Mestre.' });
    const idx = db.abilitiesCatalog.findIndex((a) => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Habilidade não encontrada.' });
    db.abilitiesCatalog[idx] = { ...db.abilitiesCatalog[idx], ...req.body };
    res.json(db.abilitiesCatalog[idx]);
  });

  app.delete('/api/abilities/:id', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas o Mestre.' });
    db.abilitiesCatalog = db.abilitiesCatalog.filter((a) => a.id !== req.params.id);
    res.json({ success: true });
  });

  // ==================== RITUALS CATALOG CRUD ====================
  app.get('/api/rituals', (req, res) => {
    res.json(db.ritualsCatalog);
  });

  app.post('/api/rituals', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas o Mestre.' });
    const newRit: Ritual = {
      id: `rit-cat-${Date.now()}`,
      name: (req.body.name || 'NOVO RITUAL').toUpperCase(),
      description: req.body.description || '',
      troca: req.body.troca || '20%',
      execution: req.body.execution || 'Ação Padrão',
      range: req.body.range || 'Médio',
      duration: req.body.duration || 'Instantânea',
      prCost: Number(req.body.prCost || 10),
      damageFormula: req.body.damageFormula || '',
      damageType: req.body.damageType || '',
      type: req.body.type || 'Geral',
      effect: req.body.effect || '',
      prerequisites: req.body.prerequisites || '',
    };
    db.ritualsCatalog.push(newRit);
    res.status(201).json(newRit);
  });

  app.put('/api/rituals/:id', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas o Mestre.' });
    const idx = db.ritualsCatalog.findIndex((r) => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Ritual não encontrado.' });
    db.ritualsCatalog[idx] = { ...db.ritualsCatalog[idx], ...req.body };
    res.json(db.ritualsCatalog[idx]);
  });

  app.delete('/api/rituals/:id', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas o Mestre.' });
    db.ritualsCatalog = db.ritualsCatalog.filter((r) => r.id !== req.params.id);
    res.json({ success: true });
  });

  // ==================== ITEMS CATALOG CRUD ====================
  app.get('/api/items', (req, res) => {
    res.json(db.itemsCatalog);
  });

  app.post('/api/items', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas o Mestre.' });
    const newItem: InventoryItem = {
      id: `itm-cat-${Date.now()}`,
      name: req.body.name || 'Novo Item',
      category: req.body.category || 'Equipamento',
      quantity: Number(req.body.quantity || 1),
      weight: Number(req.body.weight || 0.1),
      playerDescription: req.body.playerDescription || '',
      masterSecretDescription: req.body.masterSecretDescription || '',
      isSecretRevealed: false,
      effect: req.body.effect || '',
      charges: req.body.charges,
      maxCharges: req.body.maxCharges,
      equipped: false,
      rarity: req.body.rarity || 'Comum',
      origin: req.body.origin || 'Ilha',
      tags: req.body.tags || ['Catalogado'],
    };
    db.itemsCatalog.push(newItem);
    res.status(201).json(newItem);
  });

  app.put('/api/items/:id', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas o Mestre.' });
    const idx = db.itemsCatalog.findIndex((i) => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Item não encontrado.' });
    db.itemsCatalog[idx] = { ...db.itemsCatalog[idx], ...req.body };
    res.json(db.itemsCatalog[idx]);
  });

  app.delete('/api/items/:id', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas o Mestre.' });
    db.itemsCatalog = db.itemsCatalog.filter((i) => i.id !== req.params.id);
    res.json({ success: true });
  });

  // ==================== ROLLS & COMBAT ====================
  app.get('/api/rolls', (req, res) => {
    const campaignId = req.query.campaignId as string;
    let list = db.rolls;
    if (campaignId) {
      list = list.filter((r) => r.campaignId === campaignId);
    }
    res.json(list.slice(0, 50));
  });

  app.post('/api/rolls', (req, res) => {
    const user = getRequester(req);
    const { campaignId, characterName, rollType, rollName, formula, circumstanceMod } = req.body;

    let total = 0;
    let breakdownParts: string[] = [];
    const mod = Number(circumstanceMod || 0);

    const diceMatch = (formula || '1d20').match(/(\d+)d(\d+)/i);
    let isCrit = false;
    let isFumble = false;

    if (diceMatch) {
      const count = parseInt(diceMatch[1], 10);
      const sides = parseInt(diceMatch[2], 10);
      const rolls: number[] = [];
      for (let i = 0; i < count; i++) {
        const val = Math.floor(Math.random() * sides) + 1;
        rolls.push(val);
        total += val;
      }
      if (sides === 20 && count === 1) {
        if (rolls[0] === 20) isCrit = true;
        if (rolls[0] === 1) isFumble = true;
      }
      breakdownParts.push(`${count}d${sides} [${rolls.join(', ')}]`);
    } else {
      total = 10;
      breakdownParts.push(`Base [10]`);
    }

    // Extract static bonus from formula
    const staticModMatch = (formula || '').match(/[+-]\s*(\d+)(?!d)/);
    let staticBonus = 0;
    if (staticModMatch) {
      staticBonus = parseInt(staticModMatch[1], 10);
      if (formula.includes(`- ${staticBonus}`) || formula.includes(`-${staticBonus}`)) {
        staticBonus = -staticBonus;
      }
      total += staticBonus;
      breakdownParts.push(`Bônus [${staticBonus > 0 ? '+' : ''}${staticBonus}]`);
    }

    if (mod !== 0) {
      total += mod;
      breakdownParts.push(`Circunstancial [${mod > 0 ? '+' : ''}${mod}]`);
    }

    const rollEntry: RollHistoryEntry = {
      id: `roll-${Date.now()}`,
      campaignId: campaignId || db.campaigns[0].id,
      characterName: characterName || user.name,
      rollType: rollType || 'LIVRE',
      rollName: rollName || 'Rolagem Paranormal',
      formula: formula || '1d20',
      result: total,
      diceBreakdown: breakdownParts.join(' + '),
      circumstanceMod: mod,
      isCrit,
      isFumble,
      timestamp: new Date().toISOString(),
    };

    db.rolls.unshift(rollEntry);
    if (db.rolls.length > 100) db.rolls.pop();

    broadcastToCampaign(rollEntry.campaignId, {
      id: `evt-${Date.now()}`,
      campaignId: rollEntry.campaignId,
      type: 'ROLL',
      senderName: user.name,
      title: `ROLAGEM: ${rollEntry.rollName}`,
      message: `${rollEntry.characterName} obteve resultado [ ${rollEntry.result} ] (${rollEntry.diceBreakdown})`,
      payload: rollEntry,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json(rollEntry);
  });

  // ==================== MASTER ACTIONS & SESSION CONTROLS ====================
  app.post('/api/session/broadcast', (req, res) => {
    const user = getRequester(req);
    const { campaignId, message, title, type } = req.body;
    if (!isMasterUser(user)) {
      return res.status(403).json({ error: 'Apenas o Mestre pode emitir avisos paranormais globais.' });
    }

    const event: SessionEvent = {
      id: `evt-${Date.now()}`,
      campaignId: campaignId || db.campaigns[0].id,
      type: type || 'GLOBAL_ALERT',
      senderName: user.name,
      title: title || 'TRANSMISSÃO DA DIREÇÃO',
      message: message || 'A Presença ao redor de vocês mudou.',
      timestamp: new Date().toISOString(),
    };

    broadcastToCampaign(event.campaignId, event);
    res.json({ success: true, event });
  });

  app.post('/api/session/whisper', (req, res) => {
    const user = getRequester(req);
    const { campaignId, targetUserId, message } = req.body;
    if (!isMasterUser(user)) {
      return res.status(403).json({ error: 'Apenas o Mestre pode enviar sussurros psíquicos.' });
    }

    const targetUser = db.users.find((u) => u.id === targetUserId);
    const event: SessionEvent = {
      id: `evt-${Date.now()}`,
      campaignId: campaignId || db.campaigns[0].id,
      type: 'WHISPER',
      targetUserId,
      targetCharacterName: targetUser?.name,
      senderName: 'Sussurro do Mestre',
      title: 'SUSSURRO PARANORMAL',
      message: message || 'Você sente uma presença gélida atrás de você...',
      timestamp: new Date().toISOString(),
    };

    broadcastToCampaign(event.campaignId, event);
    res.json({ success: true, event });
  });

  app.post('/api/session/grant-item', (req, res) => {
    const user = getRequester(req);
    const { characterId, item } = req.body;
    if (!isMasterUser(user)) {
      return res.status(403).json({ error: 'Apenas o Mestre pode entregar itens.' });
    }

    const char = db.characters.find((c) => c.id === characterId);
    if (!char) return res.status(404).json({ error: 'Personagem não encontrado.' });

    const newItem = {
      id: `itm-${Date.now()}`,
      quantity: 1,
      equipped: false,
      rarity: 'Incomum',
      tags: ['Entregue pelo Mestre'],
      ...item,
    };

    char.inventory.push(newItem);
    char.updatedAt = new Date().toISOString();

    broadcastToCampaign(char.campaignId, {
      id: `evt-${Date.now()}`,
      campaignId: char.campaignId,
      type: 'ITEM_GRANTED',
      targetUserId: char.userId,
      targetCharacterName: char.name,
      senderName: user.name,
      title: 'NOVO ITEM ADQUIRIDO',
      message: `Você recebeu: [ ${newItem.name} ] - ${newItem.playerDescription || newItem.effect}`,
      payload: newItem,
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, item: newItem });
  });

  // ==================== NPCS & CREATURES ====================
  app.get('/api/campaigns/:id/npcs', (req, res) => {
    const user = getRequester(req);
    const isMaster = isMasterUser(user);
    let npcs = db.npcs.filter((n) => n.campaignId === req.params.id);
    if (!isMaster) {
      npcs = npcs.filter((n) => n.revealedToPlayers);
    }
    res.json(npcs);
  });

  app.post('/api/campaigns/:id/npcs', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) {
      return res.status(403).json({ error: 'Apenas Mestres podem criar NPCs.' });
    }
    const newNpc: NPC = {
      id: `npc-${Date.now()}`,
      campaignId: req.params.id,
      name: req.body.name || 'NPC Novo',
      avatarUrl: req.body.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      race: req.body.race || 'Humano Marcado',
      status: req.body.status || 'VIVO',
      dangerLevel: req.body.dangerLevel || 'INOFENSIVO',
      attitude: req.body.attitude || 'NEUTRO',
      pv: req.body.pv || { current: 50, max: 50 },
      pr: req.body.pr || { current: 30, max: 30 },
      defense: req.body.defense || 14,
      presence: req.body.presence || 'Não detectada',
      description: req.body.description || '',
      attacks: req.body.attacks || '',
      abilities: req.body.abilities || '',
      rituals: req.body.rituals || '',
      conditions: req.body.conditions || 'Normal',
      notes: req.body.notes || '',
      revealedToPlayers: req.body.revealedToPlayers || false,
    };
    db.npcs.push(newNpc);
    res.status(201).json(newNpc);
  });

  app.delete('/api/npcs/:id', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas Mestres.' });
    db.npcs = db.npcs.filter((n) => n.id !== req.params.id);
    res.json({ success: true });
  });

  app.patch('/api/npcs/:id/reveal', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas o Mestre.' });
    const npc = db.npcs.find((n) => n.id === req.params.id);
    if (!npc) return res.status(404).json({ error: 'NPC não encontrado.' });
    npc.revealedToPlayers = !npc.revealedToPlayers;

    if (npc.revealedToPlayers) {
      broadcastToCampaign(npc.campaignId, {
        id: `evt-${Date.now()}`,
        campaignId: npc.campaignId,
        type: 'GLOBAL_ALERT',
        senderName: user.name,
        title: 'NOVO CONTATO IDENTIFICADO',
        message: `O sujeito [ ${npc.name} ] foi registrado no radar da equipe.`,
        timestamp: new Date().toISOString(),
      });
    }

    res.json(npc);
  });

  app.get('/api/campaigns/:id/creatures', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) {
      return res.status(403).json({ error: 'O Arquivo de Entidades é restrito ao Mestre da Ilha.' });
    }
    const list = db.creatures.filter((c) => c.campaignId === req.params.id);
    res.json(list);
  });

  app.post('/api/campaigns/:id/creatures', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas Mestres.' });
    const newCreature: Creature = {
      id: `creature-${Date.now()}`,
      campaignId: req.params.id,
      name: req.body.name || 'ENTIDADE DESCONHECIDA',
      classification: req.body.classification || 'CLASSE II // PARANORMAL',
      threatLevel: req.body.threatLevel || 'NÍVEL 2 (PERIGOSO)',
      avatarUrl: req.body.avatarUrl || 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80',
      pv: req.body.pv || { current: 100, max: 100 },
      pr: req.body.pr || { current: 50, max: 50 },
      defense: req.body.defense || 16,
      presence: req.body.presence || 'VIOLENTA',
      description: req.body.description || '',
      attributes: req.body.attributes || 'FOR 3 | DES 3 | CON 3 | INT 1 | SAB 2 | CAR 0',
      attacks: req.body.attacks || [{ name: 'Golpe Espectral', bonus: '+6', damageFormula: '2d8+2', damageType: 'Paranormal' }],
      abilities: req.body.abilities || [],
      rituals: req.body.rituals || [],
      weaknesses: req.body.weaknesses || '',
      resistances: req.body.resistances || '',
      lore: req.body.lore || '',
      masterNotes: req.body.masterNotes || '',
    };
    db.creatures.push(newCreature);
    res.status(201).json(newCreature);
  });

  app.delete('/api/creatures/:id', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas Mestres.' });
    db.creatures = db.creatures.filter((c) => c.id !== req.params.id);
    res.json({ success: true });
  });

  app.post('/api/creatures/:id/clone', (req, res) => {
    const user = getRequester(req);
    if (!isMasterUser(user)) return res.status(403).json({ error: 'Apenas Mestres.' });
    const original = db.creatures.find((c) => c.id === req.params.id);
    if (!original) return res.status(404).json({ error: 'Criatura não encontrada.' });

    const clone: Creature = {
      ...JSON.parse(JSON.stringify(original)),
      id: `creature-${Date.now()}`,
      name: `${original.name} (Instância #${Math.floor(1 + Math.random() * 9)})`,
    };
    db.creatures.push(clone);
    res.status(201).json(clone);
  });

  // ==================== SSE REALTIME STREAM ====================
  const handleSSE = (req: Request, res: Response) => {
    const campaignId = (req.params.id as string) || (req.query.campaignId as string) || db.campaigns[0]?.id || 'camp-conv-01';
    const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string) || 'usr-master-01';

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = `client-${Date.now()}-${Math.random()}`;
    const client: SSEClient = { id: clientId, userId, campaignId, res };
    sseClients.push(client);

    // Initial keep-alive ping
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Conexão segura com o Arquivo da Ilha estabelecida.' })}\n\n`);

    req.on('close', () => {
      sseClients = sseClients.filter((c) => c.id !== clientId);
    });
  };

  app.get('/api/events/stream', handleSSE);
  app.get('/api/campaigns/:id/events', handleSSE);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MISTÉRIO DA ILHA] Servidor seguro ativo na porta ${PORT}`);
  });
}

startServer();
