import React, { useState } from 'react';
import { InventoryItem, ItemCategory, ItemRarity } from '../types';
import { Package, Plus, Eye, EyeOff, Check, Trash2, Tag, ShieldAlert, Sparkles } from 'lucide-react';

interface InventoryTabProps {
  inventory: InventoryItem[];
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem: (itemId: string) => void;
  onCreateItem: (item: Partial<InventoryItem>) => void;
  onToggleEquip: (itemId: string) => void;
  onToggleRevealSecret: (itemId: string) => void;
  isMaster?: boolean;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  inventory,
  onUpdateItem,
  onDeleteItem,
  onCreateItem,
  onToggleEquip,
  onToggleRevealSecret,
  isMaster = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Equipamento');
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState(0.5);
  const [rarity, setRarity] = useState<ItemRarity>('Comum');
  const [playerDescription, setPlayerDescription] = useState('');
  const [masterSecretDescription, setMasterSecretDescription] = useState('');
  const [effect, setEffect] = useState('');
  const [origin, setOrigin] = useState('');
  const [tagsInput, setTagsInput] = useState('Suporte, Tático');

  const categories: string[] = [
    'ALL',
    'Arma',
    'Equipamento',
    'Consumível',
    'Paranormal',
    'Amaldiçoado',
    'Endiabrado',
    'Documento',
    'Chave',
    'Objeto de missão',
    'Outro',
  ];

  const rarityColors: Record<ItemRarity, string> = {
    Comum: 'text-slate-400 border-slate-700 bg-slate-900',
    Incomum: 'text-emerald-400 border-emerald-800 bg-emerald-950/50',
    Raro: 'text-blue-400 border-blue-800 bg-blue-950/50',
    Amaldiçoado: 'text-amber-400 border-amber-800 bg-amber-950/50',
    'Relíquia da Ilha': 'text-purple-400 border-purple-800 bg-purple-950/50 font-bold',
  };

  const itemsList = inventory || [];
  const filteredItems = itemsList.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    return true;
  });

  const totalWeight = itemsList.reduce((acc, item) => acc + (item.weight || 0) * (item.quantity || 1), 0);

  const handleCreate = () => {
    if (!name.trim()) return;
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    onCreateItem({
      name: name.trim(),
      category,
      quantity,
      weight,
      rarity,
      playerDescription,
      masterSecretDescription: isMaster ? masterSecretDescription : undefined,
      isSecretRevealed: false,
      effect,
      origin,
      tags,
      equipped: false,
    });
    setName('');
    setPlayerDescription('');
    setMasterSecretDescription('');
    setEffect('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#222634] pb-3">
        <div>
          <h2 className="text-sm font-bold font-mono tracking-wider text-slate-200 uppercase flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-500" />
            <span>INVENTÁRIO & ARQUIVO DE OBJETOS</span>
          </h2>
          <div className="text-xs text-slate-400 font-mono mt-0.5">
            Total de Itens: {inventory.length} • Carga Estimada: <strong className="text-slate-200">{totalWeight.toFixed(1)} kg</strong>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded text-xs font-mono font-bold shadow transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Item</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-amber-950 text-amber-200 border border-amber-700 font-bold'
                : 'bg-[#14161d] text-slate-400 hover:text-slate-200 border border-[#222634]'
            }`}
          >
            {cat === 'ALL' ? 'Todos os Itens' : cat}
          </button>
        ))}
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <div className="p-4 bg-[#14161d] border border-amber-900/60 rounded-xl space-y-3 animate-in fade-in">
          <div className="text-xs font-mono font-bold text-amber-400 uppercase">
            Registrar Item no Inventário do Agente
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Nome do Item</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Fita Cassete Gravada #04"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              >
                {categories.filter((c) => c !== 'ALL').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Raridade</label>
              <select
                value={rarity}
                onChange={(e) => setRarity(e.target.value as ItemRarity)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              >
                <option value="Comum">Comum</option>
                <option value="Incomum">Incomum</option>
                <option value="Raro">Raro</option>
                <option value="Amaldiçoado">Amaldiçoado</option>
                <option value="Relíquia da Ilha">Relíquia da Ilha</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Quantidade</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Peso Unitário (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Origem / Localização</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Ex: Bunker 04, Necrotério"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block">Descrição do Player (Conhecida)</label>
            <textarea
              value={playerDescription}
              onChange={(e) => setPlayerDescription(e.target.value)}
              rows={2}
              placeholder="O que o jogador visualmente percebe e conhece..."
              className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
            />
          </div>

          {isMaster && (
            <div>
              <label className="text-[10px] font-mono text-rose-400 block font-bold">
                Descrição Secreta do Mestre (Restrita até revelação)
              </label>
              <textarea
                value={masterSecretDescription}
                onChange={(e) => setMasterSecretDescription(e.target.value)}
                rows={2}
                placeholder="Maldições ocultas, lore esquecida, gatilhos de entidade..."
                className="w-full px-2.5 py-1.5 bg-rose-950/20 border border-rose-900/60 rounded text-xs font-mono text-rose-200"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Efeito Mecânico / Bônus</label>
              <input
                type="text"
                value={effect}
                onChange={(e) => setEffect(e.target.value)}
                placeholder="Ex: Concede +2 em Percepção..."
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block">Tags (separadas por vírgula)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Ex: Detector, Prata, Paranormal"
                className="w-full px-2.5 py-1.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 text-slate-400 hover:text-slate-200 text-xs font-mono"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono text-xs font-bold rounded"
            >
              Guardar Item
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs">
            Nenhum item encontrado no inventário.
          </div>
        ) : (
          filteredItems.map((item) => {
            const hasSecret = isMaster && Boolean(item.masterSecretDescription);

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border space-y-3 transition-colors ${
                  item.equipped
                    ? 'bg-[#151822] border-amber-900/60 shadow-lg'
                    : 'bg-[#14161d] border-[#222634] hover:border-slate-600'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white uppercase font-mono">
                        {item.name}
                      </span>
                      <span className={`text-[9px] font-mono px-2 py-0.2 rounded border ${rarityColors[item.rarity]}`}>
                        {item.rarity}
                      </span>
                      {item.equipped && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          EQUIPADO
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {item.category} • Quantidade: <strong className="text-slate-200">x{item.quantity}</strong> • Peso: {item.weight} kg
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleEquip(item.id)}
                      className={`p-1.5 rounded text-xs font-mono border transition-colors ${
                        item.equipped
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-[#1a1d26] text-slate-400 border-[#2e3344] hover:text-white'
                      }`}
                      title={item.equipped ? 'Desequipar item' : 'Equipar item'}
                    >
                      <Check className={`w-3.5 h-3.5 ${item.equipped ? 'opacity-100' : 'opacity-30'}`} />
                    </button>
                  </div>
                </div>

                {/* Player description */}
                {item.playerDescription && (
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {item.playerDescription}
                  </p>
                )}

                {/* Effect */}
                {item.effect && (
                  <div className="text-[11px] font-mono text-slate-200 bg-[#0d0e12] border border-[#222634] p-2 rounded">
                    <strong className="text-amber-400">Efeito:</strong> {item.effect}
                  </div>
                )}

                {/* Master Secret Description */}
                {isMaster && item.masterSecretDescription && (
                  <div className="p-2.5 bg-rose-950/30 border border-rose-900/60 rounded space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-rose-300 font-bold text-[10px] uppercase">
                      <span className="flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        SEGREDO DO MESTRE ({item.isSecretRevealed ? 'REVELADO AO PLAYER' : 'OCULTO'})
                      </span>
                      <button
                        onClick={() => onToggleRevealSecret(item.id)}
                        className="text-[10px] underline hover:text-rose-100 flex items-center gap-1"
                      >
                        {item.isSecretRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{item.isSecretRevealed ? 'Ocultar' : 'Revelar'}</span>
                      </button>
                    </div>
                    <p className="text-rose-200/90 text-[11px]">
                      {item.masterSecretDescription}
                    </p>
                  </div>
                )}

                {/* Tags & Quantity Stepper */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-2 flex-wrap">
                  <div className="flex items-center gap-1 flex-wrap">
                    {(item.tags || []).map((t) => (
                      <span key={t} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-slate-400 border border-white/5">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 bg-[#0b0c10] border border-[#222634] rounded px-1 py-0.5">
                      <button
                        onClick={() => onUpdateItem({ ...item, quantity: Math.max(1, item.quantity - 1) })}
                        className="px-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono text-slate-200 px-1 font-bold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateItem({ ...item, quantity: item.quantity + 1 })}
                        className="px-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onDeleteItem(item.id)}
                      title="Excluir item"
                      className="p-1.5 text-slate-600 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
