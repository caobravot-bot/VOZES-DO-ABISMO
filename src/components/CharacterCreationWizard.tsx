import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  User as UserIcon, 
  Sparkles, 
  BarChart2, 
  Shield, 
  Heart, 
  Zap, 
  BookOpen, 
  FileText,
  Plus,
  Trash2
} from 'lucide-react';
import { Character, CharacterPresence, CharacterMark, Race, AttributeKey } from '../types';
import { fetchRaces } from '../lib/api';

interface CharacterCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (character: Partial<Character>) => void;
  campaignId: string;
  userId: string;
}

const DEFAULT_PRESENCE_COLORS = [
  { name: 'Branca', hex: '#F8FAFC' },
  { name: 'Cobalto / Azul', hex: '#38BDF8' },
  { name: 'Carmesim / Vermelha', hex: '#DC2626' },
  { name: 'Âmbar / Dourada', hex: '#F59E0B' },
  { name: 'Esmeralda / Verde', hex: '#10B981' },
  { name: 'Púrpura / Violeta', hex: '#A855F7' },
  { name: 'Sombria / Negra', hex: '#475569' },
];

const DEFAULT_MARKS: Array<{ type: string; symbol: string; concept: string; description: string }> = [
  { type: 'SOL', symbol: '☀', concept: 'MATÉRIA & PURIFICAÇÃO', description: 'Canaliza calor e radiação celestial direta.' },
  { type: 'LUA', symbol: '🌙', concept: 'MENTE & ILUSÃO', description: 'Manipula percepção e frequências do véu.' },
  { type: 'ESTRELA', symbol: '⭐', concept: 'ESPAÇO & DESTINO', description: 'Dobra pequenas distâncias e conecta probabilidades.' },
  { type: 'OLHO', symbol: '👁', concept: 'PERCEPÇÃO & VERDADE', description: 'Enxerga rastros do véu e anomalias ocultas.' },
  { type: 'COROA', symbol: '👑', concept: 'AUTORIDADE & VONTADE', description: 'Impõe domínio e comando sobre seres menores.' },
  { type: 'CORUJA', symbol: '🦉', concept: 'CONHECIMENTO & SILÊNCIO', description: 'Guarda segredos e dissipa ruídos paranormais.' },
];

export const CharacterCreationWizard: React.FC<CharacterCreationWizardProps> = ({
  isOpen,
  onClose,
  onSave,
  campaignId,
  userId,
}) => {
  const [step, setStep] = useState(1);
  const [availableRaces, setAvailableRaces] = useState<Race[]>([]);

  // Form State
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [classification, setClassification] = useState('CONFIDENCIAL // GRAU I');
  const [age, setAge] = useState(24);
  const [height, setHeight] = useState('1.78m');
  const [gender, setGender] = useState('Masculino');
  const [orientation, setOrientation] = useState('Agente de Campo');
  const [statusPhrase, setStatusPhrase] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80');

  // Race & Nature
  const [selectedRace, setSelectedRace] = useState('Pseudo Celestial');
  const [customRaceName, setCustomRaceName] = useState('');
  const [presenceAspect, setPresenceAspect] = useState('ENTONA');
  const [presenceColorName, setPresenceColorName] = useState('Branca');
  const [presenceHexColor, setPresenceHexColor] = useState('#F8FAFC');
  const [presenceStage, setPresenceStage] = useState('Estágio I - Desperto');
  const [presenceDesc, setPresenceDesc] = useState('');

  // Mark
  const [selectedMark, setSelectedMark] = useState(DEFAULT_MARKS[0]);
  const [customMarkSymbol, setCustomMarkSymbol] = useState('');

  // Direct Attributes (Integer numbers without D&D formulas)
  const [attrFor, setAttrFor] = useState(3);
  const [attrDes, setAttrDes] = useState(3);
  const [attrCon, setAttrCon] = useState(3);
  const [attrInt, setAttrInt] = useState(3);
  const [attrSab, setAttrSab] = useState(3);
  const [attrCar, setAttrCar] = useState(3);

  // Resources
  const [maxPv, setMaxPv] = useState(100);
  const [maxPr, setMaxPr] = useState(80);
  const [defenseBase, setDefenseBase] = useState(14);
  const [defenseNotes, setDefenseNotes] = useState('Sobretudo tático + reflexo');

  // Skills
  const [skills, setSkills] = useState([
    { id: 'sk-c1', name: 'Pontaria', baseAttr: 'des' as AttributeKey, bonus: 2, training: 'Veterano' },
    { id: 'sk-c2', name: 'Luta', baseAttr: 'for' as AttributeKey, bonus: 0, training: 'Treinado' },
    { id: 'sk-c3', name: 'Investigação', baseAttr: 'int' as AttributeKey, bonus: 2, training: 'Veterano' },
    { id: 'sk-c4', name: 'Ocultismo / Paranormal', baseAttr: 'int' as AttributeKey, bonus: 2, training: 'Veterano' },
    { id: 'sk-c5', name: 'Percepção', baseAttr: 'sab' as AttributeKey, bonus: 1, training: 'Treinado' },
    { id: 'sk-c6', name: 'Iniciativa', baseAttr: 'des' as AttributeKey, bonus: 0, training: 'Treinado' },
    { id: 'sk-c7', name: 'Reflexos', baseAttr: 'des' as AttributeKey, bonus: 1, training: 'Treinado' },
    { id: 'sk-c8', name: 'Vontade', baseAttr: 'sab' as AttributeKey, bonus: 0, training: 'Treinado' },
    { id: 'sk-c9', name: 'Fortitude', baseAttr: 'con' as AttributeKey, bonus: 0, training: 'Treinado' },
    { id: 'sk-c10', name: 'Furtividade', baseAttr: 'des' as AttributeKey, bonus: 0, training: 'Iniciante' },
  ]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillAttr, setNewSkillAttr] = useState<AttributeKey>('int');

  useEffect(() => {
    fetchRaces()
      .then((races) => {
        if (races && races.length > 0) {
          setAvailableRaces(races);
          setSelectedRace(races[0].name);
        }
      })
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([
      ...skills,
      {
        id: `sk-${Date.now()}`,
        name: newSkillName.trim(),
        baseAttr: newSkillAttr,
        bonus: 0,
        training: 'Treinado',
      },
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  const handleComplete = () => {
    const presence: CharacterPresence = {
      aspect: presenceAspect,
      colorName: presenceColorName,
      hexColor: presenceHexColor,
      level: 1,
      stage: presenceStage,
      description: presenceDesc || `Presença com tonalidade ${presenceColorName}.`,
    };

    const mark: CharacterMark = {
      type: selectedMark.type,
      symbol: customMarkSymbol || selectedMark.symbol,
      concept: selectedMark.concept,
      stage: 'Grau I - Desperto',
      revealed: true,
      description: selectedMark.description,
      powers: [],
    };

    const characterData: Partial<Character> = {
      campaignId,
      userId,
      name: (name || 'AGENTE DESCONHECIDO').toUpperCase(),
      nickname,
      classification,
      age: Number(age),
      height,
      gender,
      orientation,
      race: customRaceName || selectedRace,
      level: 1,
      statusPhrase,
      avatarUrl,
      presence,
      mark,
      resources: {
        pv: { current: maxPv, max: maxPv, temp: 0 },
        pr: { current: maxPr, max: maxPr, temp: 0 },
        defense: defenseBase,
        defenseBonus: 0,
        customResources: [],
      },
      attributes: {
        for: { value: attrFor, description: 'Força física e impacto' },
        des: { value: attrDes, description: 'Destreza, precisão e reflexos' },
        con: { value: attrCon, description: 'Vigor orgânico e resistência' },
        int: { value: attrInt, description: 'Raciocínio dedutivo e decifração' },
        sab: { value: attrSab, description: 'Percepção e discernimento' },
        car: { value: attrCar, description: 'Imposição e autoridade social' },
      },
      skills: skills.map((s) => ({
        id: s.id,
        name: s.name,
        baseAttr: s.baseAttr,
        bonus: s.bonus,
        training: s.training,
      })),
      weapons: [],
      abilities: [],
      rituals: [],
      inventory: [],
      individuality: {
        name: 'INDIVIDUALIDADE LATENTE',
        concept: 'Anomalia biológica em fase inicial de observação.',
        description: 'Capacidade singular do agente despertada pela proximidade com o arquipélago.',
        levels: [
          { level: 1, title: 'DESPERTAR DO VÉU', unlocked: true, status: 'DOMINADO', description: 'Primeira manifestação da singularidade.' },
          { level: 2, title: '████ BLOQUEADO ████', unlocked: false, status: 'BLOQUEADO', description: 'Grau II sob sigilo da Direção.' },
          { level: 3, title: '████ BLOQUEADO ████', unlocked: false, status: 'BLOQUEADO', description: 'Grau III sob sigilo da Direção.' },
          { level: 4, title: '████ BLOQUEADO ████', unlocked: false, status: 'BLOQUEADO', description: 'Grau IV sob sigilo da Direção.' },
          { level: 5, title: '████ BLOQUEADO ████', unlocked: false, status: 'DESCONHECIDO', description: 'Grau V sob sigilo da Direção.' },
        ],
      },
      history: {
        lore: 'Registro inicial de admissão ao Arquivo Paranormal da Ilha.',
        history: 'Registro inicial de admissão ao Arquivo Paranormal da Ilha.',
        appearance: '',
        personality: '',
        goals: '',
        fears: '',
        relationships: '',
      },
      bio: {
        lore: 'Registro inicial de admissão ao Arquivo Paranormal da Ilha.',
        history: 'Registro inicial de admissão ao Arquivo Paranormal da Ilha.',
        appearance: '',
        personality: '',
        goals: '',
        fears: '',
        relationships: '',
      },
    };

    onSave(characterData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0D0F14] border border-[#2A2E3D] rounded-xl shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#12151C] border-b border-[#232734]">
          <div className="flex items-center gap-3">
            <span className="stamp-confidential text-xs">NOVO REGISTRO</span>
            <div>
              <h2 className="font-title-paranormal text-lg font-bold tracking-wide text-slate-100">
                CRIAÇÃO DE DOSSIÊ DE AGENTE
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                MISTÉRIO DA ILHA • PROTOCOLO DE ADMISSÃO
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

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#090B0E] border-b border-[#1E222D] text-xs font-mono">
          {[
            { n: 1, label: 'Identidade' },
            { n: 2, label: 'Natureza & Marca' },
            { n: 3, label: 'Atributos' },
            { n: 4, label: 'Perícias' },
            { n: 5, label: 'Recursos' },
            { n: 6, label: 'Finalizar' },
          ].map((s) => (
            <button
              key={s.n}
              onClick={() => setStep(s.n)}
              className={`flex items-center gap-2 py-1 px-2.5 rounded transition-colors ${
                step === s.n
                  ? 'bg-rose-950/70 text-rose-300 border border-rose-800/60 font-bold'
                  : step > s.n
                  ? 'text-emerald-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-black/40 text-[11px]">
                {step > s.n ? '✓' : s.n}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: IDENTIDADE */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <UserIcon className="w-4 h-4" /> 1. DADOS DE IDENTIFICAÇÃO DO AGENTE
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: TAKADA DIAS"
                    className="w-full px-3 py-2 bg-[#12151C] border border-[#232734] rounded text-slate-100 font-bold focus:border-rose-600 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Apelido / Codinome</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Ex: O Portador do Sol"
                    className="w-full px-3 py-2 bg-[#12151C] border border-[#232734] rounded text-slate-100 focus:border-rose-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Classificação de Acesso</label>
                  <input
                    type="text"
                    value={classification}
                    onChange={(e) => setClassification(e.target.value)}
                    placeholder="CONFIDENCIAL // GRAU I"
                    className="w-full px-3 py-2 bg-[#12151C] border border-[#232734] rounded text-slate-100 font-mono text-xs focus:border-rose-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Orientação / Função</label>
                  <input
                    type="text"
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                    placeholder="Ex: Agente de Campo, Pesquisador, Especialista em Contenção"
                    className="w-full px-3 py-2 bg-[#12151C] border border-[#232734] rounded text-slate-100 focus:border-rose-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Idade</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#12151C] border border-[#232734] rounded text-slate-100 focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Altura</label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 py-2 bg-[#12151C] border border-[#232734] rounded text-slate-100 focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Gênero</label>
                    <input
                      type="text"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 bg-[#12151C] border border-[#232734] rounded text-slate-100 focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">URL da Fotografia</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-[#12151C] border border-[#232734] rounded text-slate-100 text-xs font-mono focus:border-rose-600 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Frase de Status / Filosofia</label>
                  <input
                    type="text"
                    value={statusPhrase}
                    onChange={(e) => setStatusPhrase(e.target.value)}
                    placeholder="Ex: A luz que queima não perdoa a escuridão..."
                    className="w-full px-3 py-2 bg-[#12151C] border border-[#232734] rounded text-slate-100 italic focus:border-rose-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: NATUREZA & MARCA */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> 2.1 RAÇA OU ORIGEM PARANORMAL
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {availableRaces.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setSelectedRace(r.name);
                        setCustomRaceName('');
                      }}
                      className={`p-3 text-left rounded-lg border transition-all ${
                        selectedRace === r.name && !customRaceName
                          ? 'bg-rose-950/50 border-rose-600 shadow-md'
                          : 'bg-[#12151C] border-[#232734] hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-sm text-slate-100">{r.name}</div>
                      <div className="text-xs text-slate-400 line-clamp-2 mt-1">{r.description}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    value={customRaceName}
                    onChange={(e) => setCustomRaceName(e.target.value)}
                    placeholder="Ou digite outra raça personalizada..."
                    className="w-full px-3 py-2 bg-[#12151C] border border-[#232734] rounded text-xs text-slate-200 focus:border-rose-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* PRESENCE SELECTION */}
              <div className="p-4 bg-[#12151C] border border-[#232734] rounded-lg space-y-4">
                <h3 className="text-sm font-mono uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-400" /> 2.2 PRESENÇA PARANORMAL
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Aspecto da Presença</label>
                    <select
                      value={presenceAspect}
                      onChange={(e) => setPresenceAspect(e.target.value)}
                      className="w-full px-3 py-2 bg-[#090B0E] border border-[#232734] rounded text-slate-100 font-mono text-xs focus:outline-none focus:border-rose-600"
                    >
                      <option value="ENTONA">ENTONA</option>
                      <option value="VIOLENTA">VIOLENTA</option>
                      <option value="OBSESSIVA">OBSESSIVA</option>
                      <option value="VONTADE">VONTADE</option>
                      <option value="MATÉRIA">MATÉRIA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Cor da Presença</label>
                    <select
                      value={presenceColorName}
                      onChange={(e) => {
                        const found = DEFAULT_PRESENCE_COLORS.find((c) => c.name === e.target.value);
                        setPresenceColorName(e.target.value);
                        if (found) setPresenceHexColor(found.hex);
                      }}
                      className="w-full px-3 py-2 bg-[#090B0E] border border-[#232734] rounded text-slate-100 font-mono text-xs focus:outline-none focus:border-rose-600"
                    >
                      {DEFAULT_PRESENCE_COLORS.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Estágio Inicial</label>
                    <input
                      type="text"
                      value={presenceStage}
                      onChange={(e) => setPresenceStage(e.target.value)}
                      className="w-full px-3 py-2 bg-[#090B0E] border border-[#232734] rounded text-slate-100 text-xs focus:outline-none focus:border-rose-600"
                    />
                  </div>
                </div>
              </div>

              {/* MARKS SELECTION */}
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-rose-400" /> 2.3 MARCA SOBRENATURAL
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DEFAULT_MARKS.map((m) => (
                    <button
                      key={m.type}
                      type="button"
                      onClick={() => setSelectedMark(m)}
                      className={`p-3 text-left rounded-lg border transition-all flex items-start gap-2.5 ${
                        selectedMark.type === m.type
                          ? 'bg-rose-950/60 border-rose-600 text-white'
                          : 'bg-[#12151C] border-[#232734] text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-2xl">{m.symbol}</span>
                      <div>
                        <div className="font-bold text-xs uppercase tracking-wider">{m.type}</div>
                        <div className="text-[11px] text-slate-400">{m.concept}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ATRIBUTOS DIRETOS */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" /> 3. ATRIBUTOS DIRETOS (SEM FÓRMULAS DE D&D)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Defina os valores numéricos inteiros diretamente (Ex: FOR 3, DES 4, CON 3, INT 5, SAB 3, CAR 2).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { key: 'for', name: 'FORÇA', val: attrFor, set: setAttrFor, desc: 'Empuxo físico e impacto' },
                  { key: 'des', name: 'DESTREZA', val: attrDes, set: setAttrDes, desc: 'Reflexos, agilidade e pontaria' },
                  { key: 'con', name: 'CONSTITUIÇÃO', val: attrCon, set: setAttrCon, desc: 'Vigor orgânico e respiração' },
                  { key: 'int', name: 'INTELIGÊNCIA', val: attrInt, set: setAttrInt, desc: 'Análise, dedução e rituais' },
                  { key: 'sab', name: 'SABEDORIA', val: attrSab, set: setAttrSab, desc: 'Percepção e intuição da ilha' },
                  { key: 'car', name: 'CARISMA', val: attrCar, set: setAttrCar, desc: 'Imposição e presença social' },
                ].map((a) => (
                  <div key={a.key} className="p-4 bg-[#12151C] border border-[#232734] rounded-lg text-center">
                    <span className="text-xs font-mono font-bold tracking-widest text-rose-300">{a.name}</span>
                    <p className="text-[10px] text-slate-500 my-1">{a.desc}</p>
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => a.set(Math.max(0, a.val - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-[#1E222D] hover:bg-slate-700 rounded text-slate-200 font-bold"
                      >
                        -
                      </button>
                      <span className="font-title-paranormal text-2xl font-bold text-slate-100 w-8">
                        {a.val}
                      </span>
                      <button
                        type="button"
                        onClick={() => a.set(a.val + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-[#1E222D] hover:bg-slate-700 rounded text-slate-200 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: PERÍCIAS */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> 4. PERÍCIAS & ESPECIALIZAÇÕES
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure o bônus adicional e o atributo base de cada perícia.
                </p>
              </div>

              {/* Add New Skill */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-[#12151C] border border-[#232734] rounded-lg">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Nome da perícia..."
                  className="flex-1 min-w-[200px] px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs text-slate-100 focus:outline-none"
                />
                <select
                  value={newSkillAttr}
                  onChange={(e) => setNewSkillAttr(e.target.value as AttributeKey)}
                  className="px-3 py-1.5 bg-[#090B0E] border border-[#232734] rounded text-xs font-mono text-slate-300 focus:outline-none"
                >
                  <option value="for">FOR</option>
                  <option value="des">DES</option>
                  <option value="con">CON</option>
                  <option value="int">INT</option>
                  <option value="sab">SAB</option>
                  <option value="car">CAR</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-white rounded text-xs font-mono font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar
                </button>
              </div>

              {/* Skills List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {skills.map((sk, idx) => (
                  <div
                    key={sk.id || idx}
                    className="flex items-center justify-between p-2.5 bg-[#12151C] border border-[#232734] rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 uppercase font-bold text-[10px] w-8">
                        [{sk.baseAttr}]
                      </span>
                      <span className="font-semibold text-slate-200">{sk.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sk.training}
                        onChange={(e) => {
                          const updated = [...skills];
                          updated[idx].training = e.target.value;
                          setSkills(updated);
                        }}
                        className="w-20 px-1.5 py-0.5 bg-[#090B0E] border border-[#232734] rounded text-[11px] text-slate-300 text-center"
                      />
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-slate-500">Bônus:</span>
                        <input
                          type="number"
                          value={sk.bonus}
                          onChange={(e) => {
                            const updated = [...skills];
                            updated[idx].bonus = Number(e.target.value);
                            setSkills(updated);
                          }}
                          className="w-10 px-1 py-0.5 bg-[#090B0E] border border-[#232734] rounded text-[11px] text-center font-bold text-rose-300"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sk.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: RECURSOS */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <Heart className="w-4 h-4" /> 5. RECURSOS VITAIS E DEFESA
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Valores máximos de vitalidade orgânica e energia de Presença.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#12151C] border border-red-900/40 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400 font-mono text-xs uppercase font-bold mb-2">
                    <Heart className="w-4 h-4" /> Pontos de Vida (PV Máx)
                  </div>
                  <input
                    type="number"
                    value={maxPv}
                    onChange={(e) => setMaxPv(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#090B0E] border border-red-900/50 rounded font-title-paranormal text-xl font-bold text-red-200 text-center focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-2">Dano letal, lacerações e trauma físico.</p>
                </div>

                <div className="p-4 bg-[#12151C] border border-sky-900/40 rounded-lg">
                  <div className="flex items-center gap-2 text-sky-400 font-mono text-xs uppercase font-bold mb-2">
                    <Zap className="w-4 h-4" /> Pontos de Ritual (PR Máx)
                  </div>
                  <input
                    type="number"
                    value={maxPr}
                    onChange={(e) => setMaxPr(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#090B0E] border border-sky-900/50 rounded font-title-paranormal text-xl font-bold text-sky-200 text-center focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-2">Gasto para habilidades e conjuração de rituais.</p>
                </div>

                <div className="p-4 bg-[#12151C] border border-emerald-900/40 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-bold mb-2">
                    <Shield className="w-4 h-4" /> Defesa Base
                  </div>
                  <input
                    type="number"
                    value={defenseBase}
                    onChange={(e) => setDefenseBase(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#090B0E] border border-emerald-900/50 rounded font-title-paranormal text-xl font-bold text-emerald-200 text-center focus:outline-none"
                  />
                  <input
                    type="text"
                    value={defenseNotes}
                    onChange={(e) => setDefenseNotes(e.target.value)}
                    placeholder="Notas da defesa..."
                    className="w-full mt-2 px-2 py-1 bg-[#090B0E] border border-[#232734] rounded text-[10px] text-slate-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: RESUMO */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-4 bg-[#12151C] border border-rose-900/40 rounded-lg">
                <h3 className="font-title-paranormal text-lg font-bold text-rose-200">
                  {name || 'AGENTE DESCONHECIDO'} {nickname ? `"${nickname}"` : ''}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {customRaceName || selectedRace} • {classification} • Presença {presenceAspect} ({presenceColorName})
                </p>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 bg-[#090B0E] rounded">
                    <span className="text-slate-500 block">PV Máx:</span>
                    <strong className="text-red-400 text-sm">{maxPv}</strong>
                  </div>
                  <div className="p-2 bg-[#090B0E] rounded">
                    <span className="text-slate-500 block">PR Máx:</span>
                    <strong className="text-sky-400 text-sm">{maxPr}</strong>
                  </div>
                  <div className="p-2 bg-[#090B0E] rounded">
                    <span className="text-slate-500 block">Defesa:</span>
                    <strong className="text-emerald-400 text-sm">{defenseBase}</strong>
                  </div>
                  <div className="p-2 bg-[#090B0E] rounded">
                    <span className="text-slate-500 block">Marca:</span>
                    <strong className="text-amber-400 text-sm">{selectedMark.symbol} {selectedMark.type}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#12151C] border-t border-[#232734]">
          <button
            type="button"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          <div className="flex items-center gap-3">
            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-5 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded text-xs font-mono font-bold uppercase tracking-wider"
              >
                Próximo <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-emerald-950/60"
              >
                <Check className="w-4 h-4" /> Registrar & Abrir Dossiê
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
