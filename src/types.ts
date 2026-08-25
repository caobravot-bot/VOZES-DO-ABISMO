export type UserRole = 'MASTER' | 'PLAYER' | 'MESTRE';

export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: 'MASTER' | 'PLAYER' | 'MESTRE';
  avatar?: string;
  campaignId?: string;
}

export type ThemeEffect = 'NORMAL' | 'CAOS' | 'SALVADOR' | 'ALAN' | 'CONVERGÊNCIA' | 'padrao' | 'caos' | 'salvador' | 'nevoa' | 'alerta';

export interface Campaign {
  id: string;
  name: string;
  code: string;
  description: string;
  banner?: string;
  masterId: string;
  masterName: string;
  themeEffect?: ThemeEffect;
  sharedNotes?: string;
  sessionNumber?: number;
  systemVersion?: string;
  createdAt: string;
}

export interface CampaignSessionData {
  activeScene?: string;
  theme?: string;
  round?: number;
  currentTurnIndex?: number;
}

export interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  type: 'ALERTA' | 'SITUACAO' | 'SEGREDO' | 'RECOMPENSA' | 'COMBATE';
  timestamp: string;
}

export type PresenceAspect = 'VIOLENTA' | 'ENTONA' | 'OBSESSIVA' | 'VONTADE' | 'MATÉRIA' | string;

export interface CharacterPresence {
  aspect: PresenceAspect;
  colorName: string;
  hexColor: string;
  level: number;
  stage: string;
  description?: string;
  effects?: string;
  specialProperties?: string;
}

export type MarkType = 'SOL' | 'LUA' | 'ESTRELA' | 'OLHO' | 'COROA' | 'CORUJA' | string;

export interface CharacterMark {
  type: MarkType;
  symbol: string;
  concept: string;
  stage: string;
  revealed: boolean;
  description: string;
  powers?: string[];
  revealedNotes?: string;
  secretNotes?: string;
}
export type MarkData = CharacterMark;

export interface ResourceValue {
  current: number;
  max: number;
  temp: number;
}

export interface CustomResource {
  id: string;
  name: string;
  current: number;
  max: number;
  color?: string;
}

export interface AttributeData {
  value: number;
  description?: string;
  bonus?: number;
  tempBonus?: number;
}

export type AttributeKey = 'for' | 'des' | 'con' | 'int' | 'sab' | 'car';

export interface CharacterSkill {
  id: string;
  name: string;
  baseAttr: AttributeKey;
  currentAttr?: AttributeKey; // Alternative active attribute
  value?: number;
  training?: string;
  bonus?: number;
  penalties?: number;
  tempMod?: number;
  notes?: string;
  formula?: string;
}

export interface Weapon {
  id: string;
  name: string;
  image?: string;
  type: string;
  category: 'Corpo a corpo' | 'Distância' | string;
  skillUsed?: string;
  attrUsed?: AttributeKey;
  damageFormula: string;
  damageType?: string;
  critical?: string;
  range?: string;
  currentAmmo?: number;
  maxAmmo?: number;
  equipped?: boolean;
  prCost?: number;
  description?: string;
  specialEffects?: string;
  abilities?: string;
}

export type AbilityCategory = 
  | 'Racial' 
  | 'Classe' 
  | 'Presença' 
  | 'Combate' 
  | 'Paranormal' 
  | 'Individualidade' 
  | 'Marca' 
  | 'Especial' 
  | 'Outro' 
  | string;

export type AbilityStatus = 'DESBLOQUEADA' | 'BLOQUEADA' | 'SECRETA' | 'PÚBLICA';

export interface Ability {
  id: string;
  name: string;
  category: AbilityCategory;
  description: string;
  execution?: string;
  range?: string;
  duration?: string;
  prCost?: number;
  effect?: string;
  prerequisites?: string;
  levelReq?: number;
  status: AbilityStatus;
  favorite?: boolean;
}

export interface Ritual {
  id: string;
  name: string;
  description: string;
  troca?: string;
  execution?: string;
  range?: string;
  duration?: string;
  prCost: number;
  damageFormula?: string;
  damageType?: string;
  type?: string;
  effect?: string;
  prerequisites?: string;
  notes?: string;
  symbolUrl?: string;
  favorite?: boolean;
}

export type ItemCategory = 
  | 'Armas' 
  | 'Equipamentos' 
  | 'Consumíveis' 
  | 'Itens Paranormais' 
  | 'Itens Amaldiçoados' 
  | 'Itens Endiabrados' 
  | 'Documentos' 
  | 'Objetos de Missão' 
  | 'Arma' 
  | 'Equipamento' 
  | 'Consumível' 
  | 'Paranormal' 
  | 'Amaldiçoado' 
  | 'Endiabrado' 
  | 'Documento' 
  | 'Objeto de missão' 
  | 'Outros' 
  | string;

export type ItemRarity = 'Comum' | 'Incomum' | 'Raro' | 'Amaldiçoado' | 'Relíquia da Ilha' | 'Sobrenatural' | string;

export interface InventoryItem {
  id: string;
  name: string;
  image?: string;
  category: ItemCategory;
  quantity: number;
  weight?: number;
  playerDescription: string;
  masterSecretDescription?: string;
  isSecretRevealed?: boolean;
  effect?: string;
  charges?: number;
  maxCharges?: number;
  equipped?: boolean;
  rarity?: ItemRarity;
  origin?: string;
  tags?: string[];
}

export interface IndividualityLevel {
  level: number;
  title: string;
  unlocked: boolean;
  status?: 'DESCONHECIDO' | 'BLOQUEADO' | 'DESPERTO' | 'DOMINADO';
  description: string;
  skillsUnlocked?: string[];
  transformation?: string;
  priceOrConsequence?: string;
  requirements?: string;
  secretLore?: string;
  conditionsMet?: { [key: string]: boolean };
}

export interface Individuality {
  name: string;
  concept: string;
  description: string;
  levels: IndividualityLevel[];
  currentLevel?: number;
  notes?: string;
}
export type IndividualityData = Individuality;

export interface Condition {
  id: string;
  name: string;
  description: string;
  duration: string;
  effect?: string;
  origin?: string;
}

export interface CharacterHistory {
  lore?: string;
  appearance?: string;
  personality?: string;
  goals?: string;
  fears?: string;
  relationships?: string;
  allies?: string;
  enemies?: string;
  family?: string;
  keyMoments?: string;
  notes?: string;
  history?: string;
}
export type CharacterBio = CharacterHistory;

export interface MasterSecrets {
  trueIdentity?: string;
  erasedLore?: string;
  evolutionConditions?: string;
  futureConsequences?: string;
  unrevealedAbilities?: string;
  counterpartOrEntity?: string;
  destiny?: string;
  narrativeEvents?: string;
  notes?: string;
}

export interface DefenseData {
  base: number;
  temp: number;
  other: number;
  total: number;
  notes?: string;
}

export interface Character {
  id: string;
  campaignId: string;
  userId: string;
  name: string;
  archiveCode?: string;
  classification?: string;
  nickname?: string;
  age: number;
  height: string;
  gender: string;
  orientation: string;
  race: string;
  level: number;
  statusPhrase?: string;
  avatarUrl?: string;
  presence?: CharacterPresence;
  mark?: CharacterMark;
  resources: {
    pv: ResourceValue;
    pr: ResourceValue;
    defense: number | DefenseData;
    defenseBonus?: number;
    customResources?: CustomResource[];
  };
  attributes: {
    for: AttributeData;
    des: AttributeData;
    con: AttributeData;
    int: AttributeData;
    sab: AttributeData;
    car: AttributeData;
  };
  skills: CharacterSkill[];
  weapons: Weapon[];
  abilities: Ability[];
  rituals: Ritual[];
  inventory: InventoryItem[];
  individuality?: Individuality;
  conditions?: Condition[];
  history?: CharacterHistory;
  bio?: CharacterHistory;
  masterSecrets?: MasterSecrets;
  notes?: string;
  archived?: boolean;
  updatedAt?: string;
}

export interface Race {
  id: string;
  name: string;
  description: string;
  passives?: string[];
  abilities?: string[];
  progression?: string;
  secretLore?: string;
  imageUrl?: string;
}

export type NPCStatus = 'VIVO' | 'DESAPARECIDO' | 'MORTO' | 'TRANSFORMADO' | 'INCONSCIENTE';
export type DangerLevel = 'INOFENSIVO' | 'BAIXO' | 'MÉDIO' | 'ALTO' | 'EXTREMO';
export type Attitude = 'ALIADO' | 'AMIGÁVEL' | 'NEUTRO' | 'HOSTIL' | 'DESCONHECIDO';

export interface NPC {
  id: string;
  campaignId: string;
  name: string;
  avatarUrl?: string;
  occupation?: string;
  location?: string;
  race?: string;
  status: NPCStatus;
  dangerLevel: DangerLevel;
  attitude: Attitude;
  publicDescription?: string;
  masterNotes?: string;
  knownSecrets?: string[];
  pv?: { current: number; max: number };
  pr?: { current: number; max: number };
  defense?: number;
  presence?: string;
  description?: string;
  attacks?: string;
  abilities?: string;
  rituals?: string;
  conditions?: string;
  notes?: string;
  revealedToPlayers?: boolean;
}

export type ThreatLevel = 
  | 'NÍVEL 1 (MENOR)'
  | 'NÍVEL 2 (PERIGOSO)'
  | 'NÍVEL 3 (LETAL)'
  | 'NÍVEL 4 (APOCALÍPTICO)'
  | 'NÍVEL 5 (ENTIDADE DA ILHA)'
  | string;

export interface Creature {
  id: string;
  campaignId: string;
  name: string;
  concept?: string;
  classification?: string;
  threatLevel: ThreatLevel;
  avatarUrl?: string;
  pv: { current: number; max: number; temp?: number };
  pr?: { current: number; max: number };
  defense: number;
  presence?: string;
  presenceElement?: string;
  description?: string;
  attributes?: string;
  attacks?: Array<{
    id?: string;
    name: string;
    attackFormula?: string;
    bonus?: string;
    damageFormula?: string;
    damage?: string;
    type?: string;
    damageType?: string;
    critical?: string;
    special?: string;
  }>;
  abilities?: Array<{ name: string; desc: string }>;
  rituals?: Array<{ name: string; desc: string; cost: string }>;
  immunities?: string[];
  weaknesses?: string[];
  resistances?: string;
  lore?: string;
  masterNotes?: string;
}

export type SessionEventType = 
  | 'GLOBAL_ALERT' 
  | 'WHISPER' 
  | 'ITEM_GRANTED' 
  | 'ABILITY_UNLOCKED' 
  | 'ROLL' 
  | 'STATUS_CHANGE' 
  | 'THEME_TRIGGER'
  | 'RESOURCE_UPDATE'
  | 'ALERT'
  | 'THEME_CHANGE'
  | 'CHARACTER_UPDATE';

export interface SessionEvent {
  id: string;
  campaignId: string;
  type: SessionEventType;
  targetUserId?: string;
  targetCharacterName?: string;
  senderName?: string;
  title?: string;
  message?: string;
  payload?: any;
  data?: any;
  timestamp?: string;
}

export interface RollHistoryEntry {
  id: string;
  campaignId: string;
  characterName: string;
  rollType: 'PERÍCIA' | 'ATAQUE' | 'DANO' | 'RITUAL' | 'LIVRE';
  rollName: string;
  formula: string;
  result: number;
  diceBreakdown: string;
  circumstanceMod: number;
  isCrit: boolean;
  isFumble: boolean;
  timestamp: string;
}
