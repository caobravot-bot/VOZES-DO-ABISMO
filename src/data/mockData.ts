import { 
  User, 
  Campaign, 
  Character, 
  Creature, 
  NPC, 
  RollHistoryEntry, 
  Race, 
  Ability, 
  Ritual, 
  InventoryItem, 
  Condition 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-master-01',
    username: 'mestre',
    name: 'Mestre da Ilha (Diretor)',
    email: 'direcao@misteriodailha.org',
    role: 'MESTRE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    campaignId: 'camp-conv-01',
  },
  {
    id: 'usr-player-01',
    username: 'takada',
    name: 'Takada Dias (Jogador)',
    email: 'takada@misteriodailha.org',
    role: 'PLAYER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    campaignId: 'camp-conv-01',
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-conv-01',
    name: 'MISTÉRIO DA ILHA: CONVERGÊNCIA',
    code: 'ILHA-CONV-77',
    description: 'Investigação em torno da ruptura dimensional no setor norte do arquipélago isolado. Entidades de Presença Entona e Violenta foram avistadas na antiga fundação.',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    masterId: 'usr-master-01',
    masterName: 'Mestre da Ilha (Diretor)',
    themeEffect: 'NORMAL',
    sessionNumber: 3,
    systemVersion: 'v2.0 • Mistério da Ilha Autoral',
    sharedNotes: 'Fitas cassete recuperadas no bunker 04 mencionam um ritual chamado "Convergência das Sombras". Não tocar nos espelhos sem proteção ocular de quartzo.',
    createdAt: '2026-08-01T10:00:00.000Z',
  }
];

export const INITIAL_RACES: Race[] = [
  {
    id: 'race-pseudo-celestial',
    name: 'Pseudo Celestial',
    description: 'Seres marcados por uma centelha de luz ancestral ou anomalia estelar durante o nascimento na Ilha. Seus corpos reagem diretamente a fontes de calor e luz pura.',
    passives: ['Respiro Incandescente: Recuperação ampliada quando exposto a radiação pura.', 'Visão do Véu: Discernimento visual de névoas paranormais.'],
    abilities: ['Canalização Solar', 'Pulso de Claridade'],
    progression: 'Grau I a V conforme a ressonância da Marca Solar.',
    secretLore: 'São os receptáculos biológicos originais criados no experimento heliolítico de 1974.',
  },
  {
    id: 'race-humano-marcado',
    name: 'Humano Marcado',
    description: 'Indivíduos comuns cuja pele e alma foram marcadas pelo primeiro contato com as manifestações sobrenaturais da Ilha.',
    passives: ['Tenacidade Investigativa', 'Adaptação a Estresse Paranormal'],
    abilities: ['Foco Sobrenatural', 'Sobrevivência de Campo'],
    progression: 'Grau I a V com a evolução de atributos e perícias.',
  },
  {
    id: 'race-espectro-latente',
    name: 'Espectro Latente',
    description: 'Agentes cuja massa física oscila entre o plano terreno e a frequência etérea da Ilha.',
    passives: ['Passo Silencioso', 'Resistência a Choques Físicos'],
    abilities: ['Deslocamento Ectoplásmico'],
    secretLore: 'Se a estabilidade da alma zerar, o corpo desaparece permanentemente no véu.',
  }
];

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'char-takada-01',
    campaignId: 'camp-conv-01',
    userId: 'usr-player-01',
    name: 'TAKADA DIAS',
    archiveCode: 'ARQ-0825-TKD',
    classification: 'CONFIDENCIAL // GRAU IV',
    nickname: 'O Portador do Sol',
    age: 24,
    height: '1.82 m',
    gender: 'Masculino',
    orientation: 'Agente de Campo',
    race: 'Pseudo Celestial',
    level: 3,
    statusPhrase: 'A luz que queima não perdoa a escuridão que tenta devorar a Ilha.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    presence: {
      aspect: 'ENTONA',
      colorName: 'Branca',
      hexColor: '#F8FAFC',
      level: 2,
      stage: 'Estágio II - Pulso de Claridade',
      description: 'Uma radiação translúcida e tépida que faz o ar vibrar em tons límpidos de branco ofuscante. Objetos metálicos ressoam suavemente em sua proximidade.',
      effects: 'Dissipa névoas paranormais menores em raio de 3m; iluminação suave involuntária sob estresse.',
      specialProperties: 'Canalização solar pura e imunidade a cegueira por feixes de luz.',
    },
    mark: {
      type: 'SOL',
      symbol: '☀',
      concept: 'MATÉRIA & PURIFICAÇÃO',
      stage: 'Grau II - Incandescência',
      revealed: true,
      description: 'Uma marca espiral solar gravada na clavícula direita que arde silenciosamente em tom dourado-esbranquiçado quando rituais são conjurados.',
      powers: ['Disparo Incandescente (+1d10 solar)', 'Purificação de Substâncias'],
      revealedNotes: 'Permite canalizar calor celestial através de disparos balísticos e purificar substâncias corrompidas.',
      secretNotes: 'A Marca do Sol foi transplantada durante o experimento 09 na Ilha. Se atingir o Grau IV, a carne começará a cristalizar em heliolita.',
    },
    resources: {
      pv: { current: 82, max: 100, temp: 0 },
      pr: { current: 63, max: 90, temp: 5 },
      defense: 16,
      defenseBonus: 2,
      customResources: [
        { id: 'res-sanidade', name: 'Estabilidade da Mente', current: 75, max: 80, color: '#38BDF8' }
      ]
    },
    attributes: {
      for: { value: 3, description: 'Força muscular, empuxo físico e sustento de impacto' },
      des: { value: 4, description: 'Precisão, velocidade de reação, reflexos e pontaria' },
      con: { value: 3, description: 'Vigor orgânico, capacidade respiratória e resistência celular' },
      int: { value: 5, description: 'Raciocínio dedutivo, análise de evidências e decifração de rituais' },
      sab: { value: 3, description: 'Percepção extrassensorial, intuição da ilha e discernimento' },
      car: { value: 2, description: 'Imposição de autoridade, presença social e persuasão' },
    },
    skills: [
      { id: 'sk-1', name: 'Pontaria', baseAttr: 'des', value: 8, training: 'Veterano', bonus: 2, notes: 'Especialista em armas balísticas pesadas.' },
      { id: 'sk-2', name: 'Luta', baseAttr: 'for', currentAttr: 'for', value: 4, training: 'Treinado', bonus: 0, notes: 'Combate desarmado e facas.' },
      { id: 'sk-3', name: 'Investigação', baseAttr: 'int', value: 9, training: 'Veterano', bonus: 2, notes: 'Análise de cenas de crimes paranormais.' },
      { id: 'sk-4', name: 'Ocultismo / Paranormal', baseAttr: 'int', value: 10, training: 'Veterano', bonus: 3, notes: 'Leitura de runas e rituais da Ilha.' },
      { id: 'sk-5', name: 'Percepção', baseAttr: 'sab', value: 6, training: 'Treinado', bonus: 1, notes: 'Detecção de movimentos anômalos no ambiente.' },
      { id: 'sk-6', name: 'Iniciativa', baseAttr: 'des', value: 6, training: 'Treinado', bonus: 0, notes: 'Tempo de reação em combate.' },
      { id: 'sk-7', name: 'Reflexos', baseAttr: 'des', value: 7, training: 'Treinado', bonus: 1, notes: 'Esquiva e proteção imediata.' },
      { id: 'sk-8', name: 'Vontade', baseAttr: 'sab', value: 5, training: 'Treinado', bonus: 0, notes: 'Resistência a controle mental da Ilha.' },
      { id: 'sk-9', name: 'Fortitude', baseAttr: 'con', value: 6, training: 'Treinado', bonus: 0, notes: 'Resistência a toxinas e fadiga extrema.' },
      { id: 'sk-10', name: 'Atletismo', baseAttr: 'for', value: 4, training: 'Iniciante', bonus: 0, notes: 'Escalada, salto e corrida.' },
      { id: 'sk-11', name: 'Furtividade', baseAttr: 'des', value: 5, training: 'Iniciante', bonus: 0, notes: 'Movimentação sem ruído.' },
      { id: 'sk-12', name: 'Medicina de Campo', baseAttr: 'int', value: 6, training: 'Treinado', bonus: 0, notes: 'Primeiros socorros e contenção de ferimentos.' },
      { id: 'sk-13', name: 'Diplomacia', baseAttr: 'car', value: 3, training: 'Iniciante', bonus: 0, notes: 'Negociação com testemunhas e civis.' },
      { id: 'sk-14', name: 'Intimidação', baseAttr: 'car', value: 4, training: 'Iniciante', bonus: 0, notes: 'Interrogatório sob pressão.' },
    ],
    weapons: [
      {
        id: 'wep-1',
        name: 'SEIS PROMESSAS',
        type: 'Revólver Paranormal',
        category: 'Distância',
        skillUsed: 'Pontaria',
        attrUsed: 'des',
        damageFormula: '2d10',
        damageType: 'Balístico / Fogo Solar',
        critical: '19-20 / x3',
        range: 'Médio (30m)',
        currentAmmo: 4,
        maxAmmo: 6,
        equipped: true,
        prCost: 0,
        description: 'Um revólver pesado em aço enegrecido e gravações que canalizam luz celestial branca no cano estriado.',
        specialEffects: 'Ao gastar 5 PR, o próximo tiro causa +1d10 de dano solar puro e anula regeneração de criaturas das sombras por 1 turno.',
      },
      {
        id: 'wep-2',
        name: 'Lâmina de Prata Esmaltada',
        type: 'Faca Tática',
        category: 'Corpo a corpo',
        skillUsed: 'Luta',
        attrUsed: 'des',
        damageFormula: '1d6 + 3',
        damageType: 'Corte / Prata',
        critical: '20 / x2',
        range: 'Toque',
        currentAmmo: 1,
        maxAmmo: 1,
        equipped: true,
        prCost: 0,
        description: 'Faca forjada com liga de prata e selos arcanos da organização para cortes rápidos em combate próximo.',
        specialEffects: 'Causa dano dobrado em parasitas espectrais.',
      }
    ],
    abilities: [
      {
        id: 'ab-1',
        name: 'Respiro Celestial',
        category: 'Racial',
        description: 'Sua linhagem Pseudo Celestial acelera o fechamento de lacerações quando exposto a fontes de luz pura.',
        execution: 'Ação Livre',
        range: 'Pessoal',
        duration: 'Instantânea',
        prCost: 10,
        effect: 'Recupera 15 PV se estiver em ambiente iluminado.',
        prerequisites: 'Raça Pseudo Celestial',
        status: 'DESBLOQUEADA',
        favorite: true,
      },
      {
        id: 'ab-2',
        name: 'Mira Analítica',
        category: 'Combate',
        description: 'Permite utilizar o atributo INTELIGÊNCIA no lugar de DESTREZA ao realizar disparos de precisão calculada.',
        execution: 'Ação de Movimento',
        range: 'Visão',
        duration: '1 Rodada',
        prCost: 6,
        effect: 'Substitui atributo padrão de Pontaria por INT.',
        status: 'DESBLOQUEADA',
        favorite: true,
      },
      {
        id: 'ab-3',
        name: 'Fagulha da Alvorada',
        category: 'Marca',
        description: 'Emite um clarão estroboscópico de Presença Branca capaz de ofuscar olhares sobrenaturais.',
        execution: 'Reação',
        range: 'Curto (6m)',
        duration: '1 Turno',
        prCost: 15,
        effect: 'Inimigos no raio sofrem -2 em testes de ataque no próximo turno.',
        status: 'DESBLOQUEADA',
      },
      {
        id: 'ab-4',
        name: 'Olhar da Verdade Oculta',
        category: 'Paranormal',
        description: 'Revela marcas de rituais deixadas nas paredes ou objetos nas últimas 24 horas.',
        execution: 'Ação Completa',
        range: 'Médio',
        duration: 'Concentração',
        prCost: 12,
        effect: 'Visão direta de traços de rituais recentes.',
        status: 'BLOQUEADA',
      }
    ],
    rituals: [
      {
        id: 'rit-1',
        name: 'CHAMA DA ENTONA',
        description: 'Canaliza a Presença Branca para purificar uma área ou incinerar matéria ectoplásmica com chamas incolores.',
        troca: '40%',
        execution: 'Ação Padrão',
        range: 'Médio (15m)',
        duration: 'Instantânea',
        prCost: 25,
        damageFormula: '4d12',
        damageType: 'Paranormal / Luz',
        type: 'Purificação / Dano',
        effect: 'Alvos atingidos sofrem 4d12 de dano e a condição Queimando (Luz) por 2 turnos.',
        prerequisites: 'Presença Entona Grau I+',
        favorite: true,
      },
      {
        id: 'rit-2',
        name: 'VÉU DO ARQUIVO SILENCIOSO',
        description: 'Isola termicamente e acusticamente uma sala contra bisbilhoteiros e sondas dimensionais.',
        troca: '20%',
        execution: 'Ação Completa',
        range: 'Toque',
        duration: '1 Hora',
        prCost: 15,
        type: 'Abjuração / Sigilo',
        effect: 'Nenhum som ou rastro espectral sai do perímetro consagrado.',
        prerequisites: 'Ocultismo 6+',
      }
    ],
    inventory: [
      {
        id: 'itm-1',
        name: 'Relógio de Bolso Quebrado #09',
        category: 'Itens Paranormais',
        quantity: 1,
        weight: 0.2,
        playerDescription: 'Um relógio de prata com ponteiros parados exatamente às 03:47. Ele esquenta quando entidades com Presença Violenta se aproximam.',
        masterSecretDescription: 'O relógio pertenceu ao pesquisador chefe morto no Incidente 7. Ele contém uma alma aprisionada no mecanismo que pode ser libertada para um sacrifício.',
        isSecretRevealed: false,
        effect: 'Concede +2 em Percepção contra emboscadas sobrenaturais.',
        charges: 3,
        maxCharges: 3,
        equipped: true,
        rarity: 'Relíquia da Ilha',
        origin: 'Laboratório Subterrâneo B',
        tags: ['Detector', 'Prata', 'Entidade']
      },
      {
        id: 'itm-2',
        name: 'Frasco de Soro Estabilizador (PR)',
        category: 'Consumíveis',
        quantity: 3,
        weight: 0.3,
        playerDescription: 'Ampola com líquido luminescente azulado utilizado para reabastecer a reserva de Presença do agente.',
        effect: 'Restaura 20 PR imediatamente após uso.',
        charges: 1,
        maxCharges: 1,
        equipped: false,
        rarity: 'Incomum',
        origin: 'Arsenal da Organização',
        tags: ['Cura', 'PR']
      },
      {
        id: 'itm-3',
        name: 'Kit de Primeiros Socorros Tático',
        category: 'Equipamentos',
        quantity: 1,
        weight: 1.5,
        playerDescription: 'Bandagens estéreis, anticoagulantes e pomada cicatrizante.',
        effect: 'Permite estabilizar aliados e estancar a condição Sangrando.',
        charges: 4,
        maxCharges: 5,
        equipped: false,
        rarity: 'Comum',
        tags: ['Médico', 'Suporte']
      }
    ],
    individuality: {
      name: 'AURORA DA CONDENAÇÃO',
      concept: 'Transmutação da própria força vital em radiação heliolítica autossustentável.',
      description: 'Uma singularidade biológica rara que funde a Presença Entona com a herança Pseudo Celestial, permitindo controlar a luz pura da Ilha.',
      levels: [
        {
          level: 1,
          title: 'DESPERTAR DO VÉU LÚCIDO',
          unlocked: true,
          status: 'DOMINADO',
          description: 'A luz ao redor de Takada ganha densidade palpável, reduzindo danos físicos recebidos e iluminando mentiras.',
          skillsUnlocked: ['Escudo de Luz Tépida (+2 Defesa)', 'Visão no Escuro Paranormal'],
          requirements: 'Sobreviver ao primeiro contato com a Entidade Solar.',
          conditionsMet: { 'Contato inicial': true, 'Ressonância comprovada': true }
        },
        {
          level: 2,
          title: 'COROA INCANDESCENTE',
          unlocked: false,
          status: 'DESPERTO',
          description: 'Uma auréola espectral surge acima da cabeça. Disparos causam dano solar dobrado.',
          skillsUnlocked: ['Disparo Solar Crítico', 'Voo Planado Térmico (3m)'],
          priceOrConsequence: 'A cada uso, o usuário perde temporariamente a visão humana por 1d4 horas após o combate.',
          requirements: 'Canalizar 100 PR total em rituais do Sol e autorização do Mestre.',
          conditionsMet: { 'Canalização 100 PR': true, 'Autorização do Mestre': false }
        },
        {
          level: 3,
          title: '████ FUSÃO ESTELAR ████',
          unlocked: false,
          status: 'BLOQUEADO',
          description: 'Registro de nível restrito pela diretoria da Ilha.',
          skillsUnlocked: ['████ REDIGIDO ████'],
          requirements: 'Grau III de Presença Entona e sacrifício voluntário.',
        },
        {
          level: 4,
          title: '████ SINGULARIDADE CELESTIAL ████',
          unlocked: false,
          status: 'BLOQUEADO',
          description: 'Informação lacrada no Cofre Negro.',
          skillsUnlocked: ['████ REDIGIDO ████'],
          requirements: 'Grau IV alcançado.',
        },
        {
          level: 5,
          title: '████ TRANSCENDÊNCIA DO SOL ETERNO ████',
          unlocked: false,
          status: 'DESCONHECIDO',
          description: 'Fim do ciclo do sujeito.',
          skillsUnlocked: ['████ REDIGIDO ████'],
          requirements: 'Destino final.',
        }
      ]
    },
    conditions: [
      {
        id: 'cond-1',
        name: 'Marcado pela Entona',
        description: 'A Presença Branca vibra na pele do agente, tornando-o visível em espectros dimensionais.',
        duration: 'Permanente',
        effect: '-1 em Furtividade contra seres sobrenaturais, +1 em Ocultismo.',
        origin: 'Herança Racial'
      }
    ],
    history: {
      history: 'Nascido em uma das vilas costeiras antes da Ilha ser evacuada pelo governo secreto. Aos 16 anos, sobreviveu a um colapso espectral dentro de uma igreja abandonada, emergindo com os olhos brilhando em luz fria.',
      lore: 'Nascido em uma das vilas costeiras antes da Ilha ser evacuada pelo governo secreto. Aos 16 anos, sobreviveu a um colapso espectral dentro de uma igreja abandonada, emergindo com os olhos brilhando em luz fria.',
      appearance: 'Cabelos castanho-escuros com mechas brancas na raiz. Olhos cinza-claros que parecem refletir luz ambiente. Veste sobretudo cinza-grafite forrado com runas de isolamento e coldre duplo.',
      personality: 'Calmo sob pressão, analítico e avesso a sentimentalismos vazios. Guarda uma profunda aversão a promessas não cumpridas.',
      goals: 'Descobrir quem ordenou o bombardeio sobre a Vila Antiga e neutralizar a Entidade da Convergência.',
      fears: 'Perder o controle da Presença e desintegrar as pessoas ao redor em poeira incandescente.',
      relationships: 'Vínculo de confiança cauteloso com agentes de campo. Respeito austero pelas ordens da Direção.',
      allies: 'Agentes do Destacamento Norte.',
      enemies: 'A Seita dos Olhos Cegos.',
      family: 'Irmã mais nova dada como desaparecida no Arquivo 12.',
      keyMoments: 'O dia em que o Revólver Seis Promessas foi retirado das cinzas do altar.',
      notes: 'Lembrete pessoal: Nunca olhar diretamente para o terceiro espelho do laboratório.'
    },
    bio: {
      history: 'Nascido em uma das vilas costeiras antes da Ilha ser evacuada pelo governo secreto. Aos 16 anos, sobreviveu a um colapso espectral dentro de uma igreja abandonada, emergindo com os olhos brilhando em luz fria.',
      lore: 'Nascido em uma das vilas costeiras antes da Ilha ser evacuada pelo governo secreto. Aos 16 anos, sobreviveu a um colapso espectral dentro de uma igreja abandonada, emergindo com os olhos brilhando em luz fria.',
      appearance: 'Cabelos castanho-escuros com mechas brancas na raiz. Olhos cinza-claros que parecem refletir luz ambiente. Veste sobretudo cinza-grafite forrado com runas de isolamento e coldre duplo.',
      personality: 'Calmo sob pressão, analítico e avesso a sentimentalismos vazios. Guarda uma profunda aversão a promessas não cumpridas.',
      goals: 'Descobrir quem ordenou o bombardeio sobre a Vila Antiga e neutralizar a Entidade da Convergência.',
      fears: 'Perder o controle da Presença e desintegrar as pessoas ao redor em poeira incandescente.',
      relationships: 'Vínculo de confiança cauteloso com agentes de campo. Respeito austero pelas ordens da Direção.',
      allies: 'Agentes do Destacamento Norte.',
      enemies: 'A Seita dos Olhos Cegos.',
      family: 'Irmã mais nova dada como desaparecida no Arquivo 12.',
      keyMoments: 'O dia em que o Revólver Seis Promessas foi retirado das cinzas do altar.',
      notes: 'Lembrete pessoal: Nunca olhar diretamente para o terceiro espelho do laboratório.'
    },
    masterSecrets: {
      trueIdentity: 'Takada é o clone nº 7 do primeiro sacerdote do Culto do Sol, recriado pela fundação para servir como catalisador vivo.',
      erasedLore: 'Ele já morreu duas vezes nas expedições anteriores e teve suas memórias reescritas com soro amnésico de grau III.',
      evolutionConditions: 'Para despertar o Nível 2 de Individualidade, ele precisa queimar intencionalmente um artefato da própria família.',
      futureConsequences: 'A cada nível de Individualidade desbloqueado, 20% do seu corpo se torna pedra celeste inorgânica.',
      unrevealedAbilities: 'Purificação em Massa (sacrifica 50 PV para aniquilar qualquer criatura de escuridão em 20m).',
      counterpartOrEntity: 'A Entidade "Senhor da Luz Fria" habita o núcleo da Ilha e reconhece Takada como seu herdeiro.',
      destiny: 'Deverá escolher entre fechar a fenda selando a si mesmo ou destruir a Ilha inteira.',
      narrativeEvents: 'No próximo eclipse lunar, Takada sentirá queimação insuportável no braço direito.',
      notes: 'Se ele descobrir o prontuário no bunker 04 antes da hora, enviar o esquadrão de contenção.'
    },
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_NPCS: NPC[] = [
  {
    id: 'npc-01',
    campaignId: 'camp-conv-01',
    name: 'Guardião Samuel',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    occupation: 'Faroleiro & Ex-Agente de Contenção',
    location: 'Farol das Lamentações',
    race: 'Humano Marcado',
    status: 'VIVO',
    dangerLevel: 'MÉDIO',
    attitude: 'NEUTRO',
    pv: { current: 65, max: 65 },
    pr: { current: 40, max: 40 },
    defense: 16,
    presence: 'ENTONA • ÂMBAR',
    description: 'Um homem idoso com dedos enegrecidos por pólvora e olhos amarelados que não piscam há anos.',
    publicDescription: 'Guarda o antigo farol e abastece as lamparinas com óleo de baleia destilado em água benta.',
    masterNotes: 'Samuel esconde o diário do antigo diretor sob o piso de madeira do terceiro andar.',
    revealedToPlayers: true,
  },
  {
    id: 'npc-02',
    campaignId: 'camp-conv-01',
    name: 'A Mulher do Espelho',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    occupation: 'Entidade de Reflexo',
    location: 'Mansão Submersa',
    race: 'Espectro',
    status: 'TRANSFORMADO',
    dangerLevel: 'ALTO',
    attitude: 'HOSTIL',
    pv: { current: 90, max: 90 },
    pr: { current: 80, max: 80 },
    defense: 18,
    presence: 'OBSESSIVA • AZUL',
    description: 'Manifesta-se apenas quando vidros ou espelhos são quebrados no mesmo cômodo.',
    publicDescription: 'Voz sussurrada que promete revelar o passado de quem fitar seu reflexo.',
    masterNotes: 'Pode ser banida se o espelho principal for coberto com tecido escuro antes do terceiro turno.',
    revealedToPlayers: false,
  }
];

export const INITIAL_CREATURES: Creature[] = [
  {
    id: 'creature-01',
    campaignId: 'camp-conv-01',
    name: 'ABERRAÇÃO DA NÉVOA NEGRA',
    classification: 'CLASSE III // PARANORMAL',
    threatLevel: 'NÍVEL 2 (PERIGOSO)',
    avatarUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80',
    pv: { current: 120, max: 120, temp: 0 },
    pr: { current: 60, max: 60 },
    defense: 16,
    presence: 'VIOLENTA • CARMESIM',
    presenceElement: 'Carmesim Corrosivo',
    description: 'Uma massa quadrúpede de carne putrefata e filamentos de sombras que absorve luz e calor ao redor.',
    attributes: 'FOR 4 | DES 3 | CON 4 | INT 1 | SAB 2 | CAR 0',
    attacks: [
      { name: 'Mordida Sombria', bonus: '+6', damageFormula: '2d10 + 4', damageType: 'Corte / Sombra', critical: '20 / x2' },
      { name: 'Chicote de Ectoplasma', bonus: '+5', damageFormula: '1d12 + 3', damageType: 'Impacto / Corrosão', critical: '19-20 / x2' }
    ],
    abilities: [
      { name: 'Manto da Escuridão', desc: 'Aura de 4m que impõe desvantagem em ataques à distância.' },
      { name: 'Regeneração Sombria', desc: 'Cura 10 PV por turno se não for atacada por fontes de luz/fogo.' }
    ],
    weaknesses: ['Dano Solar', 'Prata Pura'],
    resistances: 'Resistência a dano balístico comum (corta pela metade)',
    lore: 'Nascida dos resíduos do primeiro reator subaquático detonado em 1982.',
    masterNotes: 'Se o agente portar a Marca do Sol Grau II, a criatura teme se aproximar a menos de 2m.'
  }
];

export const INITIAL_ROLLS: RollHistoryEntry[] = [
  {
    id: 'roll-01',
    campaignId: 'camp-conv-01',
    characterName: 'Takada Dias',
    rollType: 'PERÍCIA',
    rollName: 'Investigação (Cena do Farol)',
    formula: '1d20 + 9',
    result: 23,
    diceBreakdown: '1d20 [14] + Bônus [+9]',
    circumstanceMod: 0,
    isCrit: false,
    isFumble: false,
    timestamp: '2026-08-25T11:30:00.000Z',
  }
];

// Content Creator / Master Catalog Items
export const INITIAL_ABILITIES_CATALOG: Ability[] = [
  {
    id: 'cat-ab-1',
    name: 'Aceleração Psíquica',
    category: 'Presença',
    description: 'Amplia as sinapses do usuário para realizar uma ação de movimento adicional no mesmo turno.',
    execution: 'Ação Livre',
    range: 'Pessoal',
    duration: '1 Turno',
    prCost: 8,
    effect: 'Concede +1 ação de movimento.',
    status: 'PÚBLICA'
  },
  {
    id: 'cat-ab-2',
    name: 'Disparo Perfurante',
    category: 'Combate',
    description: 'Canaliza pressão cinética na bala para atravessar coberturas sólidas ou blindagens leves.',
    execution: 'Ação Padrão',
    range: 'Arma',
    duration: 'Instantânea',
    prCost: 5,
    effect: 'Ignora até 4 pontos de Defesa do alvo.',
    status: 'PÚBLICA'
  },
  {
    id: 'cat-ab-3',
    name: 'Sentido da Ilha',
    category: 'Paranormal',
    description: 'Sintoniza a mente com os tremores sutis das fendas dimensionais.',
    execution: 'Ação Completa',
    range: '1km',
    duration: '10 Minutos',
    prCost: 12,
    effect: 'Indica a direção e intensidade da anomalia mais próxima.',
    status: 'PÚBLICA'
  }
];

export const INITIAL_RITUALS_CATALOG: Ritual[] = [
  {
    id: 'cat-rit-1',
    name: 'ESCUDO DA MATÉRIA RESSONANTE',
    description: 'Solidifica as partículas de poeira e ar em uma lâmina de vidro temperado invisível na frente do conjurador.',
    troca: '25%',
    execution: 'Reação',
    range: 'Pessoal',
    duration: '1 Rodada',
    prCost: 15,
    damageType: 'Abjuração',
    type: 'Defensivo',
    effect: 'Concede +5 na Defesa contra o ataque atacante.',
  },
  {
    id: 'cat-rit-2',
    name: 'INVOCAÇÃO DO CORVO DA ILHA',
    description: 'Chama uma entidade com forma de ave de rapina para sobrevoar áreas de difícil acesso e transmitir visão.',
    troca: '30%',
    execution: '1 Minuto',
    range: '500m',
    duration: '1 Hora',
    prCost: 18,
    type: 'Utilitário / Reconhecimento',
    effect: 'Permite ao conjurador enxergar através dos olhos da ave espectral.',
  }
];

export const INITIAL_ITEMS_CATALOG: InventoryItem[] = [
  {
    id: 'cat-itm-1',
    name: 'Lâmpada de Quartzo Espectral',
    category: 'Itens Paranormais',
    quantity: 1,
    weight: 0.8,
    playerDescription: 'Uma lamparina que emite um brilho lilás capaz de revelar passos invisíveis de entidades.',
    effect: 'Concede +2 em Percepção e Investigação de rastros ocultos.',
    rarity: 'Incomum',
    tags: ['Luz', 'Detector']
  },
  {
    id: 'cat-itm-2',
    name: 'Cartuchos de Chumbo Sagrado (x12)',
    category: 'Consumíveis',
    quantity: 12,
    weight: 0.4,
    playerDescription: 'Munições gravadas com o símbolo da Coruja para dissipar possessões.',
    effect: 'Adiciona +1d6 de dano paranormal a armas de fogo.',
    rarity: 'Raro',
    tags: ['Munição', 'Paranormal']
  }
];

// Aliases for compatibility
export const initialCampaigns = INITIAL_CAMPAIGNS;
export const initialCharacters = INITIAL_CHARACTERS;
export const initialNPCs = INITIAL_NPCS;
export const initialCreatures = INITIAL_CREATURES;
