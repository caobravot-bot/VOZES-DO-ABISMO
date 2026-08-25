import React, { useState } from 'react';
import { Character, PresenceAspect } from '../types';
import { X, Sparkles, Sliders, Shield } from 'lucide-react';

interface EditCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onSave: (updated: Partial<Character>) => void;
}

export const EditCharacterModal: React.FC<EditCharacterModalProps> = ({
  isOpen,
  onClose,
  character,
  onSave,
}) => {
  const [name, setName] = useState(character.name);
  const [nickname, setNickname] = useState(character.nickname || '');
  const [statusPhrase, setStatusPhrase] = useState(character.statusPhrase || '');
  const [race, setRace] = useState(character.race);
  const [level, setLevel] = useState(character.level);
  const [age, setAge] = useState(character.age);
  const [height, setHeight] = useState(character.height);
  const [gender, setGender] = useState(character.gender);
  const [orientation, setOrientation] = useState(character.orientation);
  const [classification, setClassification] = useState(character.classification || 'CONFIDENCIAL');
  const [archiveCode, setArchiveCode] = useState(character.archiveCode || 'ARQ-0001');
  const [avatarUrl, setAvatarUrl] = useState(character.avatarUrl || '');

  // Presence Configuration
  const [presenceAspect, setPresenceAspect] = useState<PresenceAspect>(character.presence?.aspect || 'ENTONA');
  const [presenceColorName, setPresenceColorName] = useState(character.presence?.colorName || 'Branca');
  const [presenceHexColor, setPresenceHexColor] = useState(character.presence?.hexColor || '#F8FAFC');

  // Attribute Base Values (Direct integers in Mistério da Ilha)
  const [attrFor, setAttrFor] = useState(character.attributes.for.value);
  const [attrDes, setAttrDes] = useState(character.attributes.des.value);
  const [attrCon, setAttrCon] = useState(character.attributes.con.value);
  const [attrInt, setAttrInt] = useState(character.attributes.int.value);
  const [attrSab, setAttrSab] = useState(character.attributes.sab.value);
  const [attrCar, setAttrCar] = useState(character.attributes.car.value);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      name,
      nickname,
      statusPhrase,
      race,
      level,
      age,
      height,
      gender,
      orientation,
      classification,
      archiveCode,
      avatarUrl,
      presence: {
        ...character.presence,
        aspect: presenceAspect,
        colorName: presenceColorName,
        hexColor: presenceHexColor,
        level: character.presence?.level || 1,
        stage: character.presence?.stage || 'Desperto',
      },
      attributes: {
        for: { ...character.attributes.for, value: attrFor },
        des: { ...character.attributes.des, value: attrDes },
        con: { ...character.attributes.con, value: attrCon },
        int: { ...character.attributes.int, value: attrInt },
        sab: { ...character.attributes.sab, value: attrSab },
        car: { ...character.attributes.car, value: attrCar },
      },
    });
    onClose();
  };

  const presencePresets: Array<{ aspect: PresenceAspect; colorName: string; hex: string }> = [
    { aspect: 'ENTONA', colorName: 'Branca Imaculada', hex: '#F8FAFC' },
    { aspect: 'ENTONA', colorName: 'Vermelha Sangue', hex: '#EF4444' },
    { aspect: 'ENTONA', colorName: 'Ciano Espectral', hex: '#06B6D4' },
    { aspect: 'ENTONA', colorName: 'Âmbar Dourada', hex: '#F59E0B' },
    { aspect: 'ENTONA', colorName: 'Púrpura Abissal', hex: '#A855F7' },
    { aspect: 'ENTONA', colorName: 'Esmeralda Antiga', hex: '#10B981' },
    { aspect: 'VONTADE', colorName: 'Azul Elétrico', hex: '#3B82F6' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#0D0F14] border border-[#2A2E3D] rounded-xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#12151C] border-b border-[#232836]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-rose-500" />
            <div>
              <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                EDITOR DE DOSSIÊ // CLASSIFICAÇÃO {classification}
              </div>
              <div className="text-base font-bold font-title-paranormal text-slate-100">
                Editar Dados do Personagem
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto font-mono">
          {/* Identity Info */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              1. Identidade & Registro de Agente
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232836] rounded text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Codinome / Alcunha</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232836] rounded text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Código de Arquivo</label>
                <input
                  type="text"
                  value={archiveCode}
                  onChange={(e) => setArchiveCode(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232836] rounded text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Raça / Linhagem</label>
                <input
                  type="text"
                  value={race}
                  onChange={(e) => setRace(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232836] rounded text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Grau / Nível</label>
                <input
                  type="number"
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232836] rounded text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Idade</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232836] rounded text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Altura</label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232836] rounded text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Função / Ocupação</label>
                <input
                  type="text"
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232836] rounded text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">URL da Fotografia</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232836] rounded text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Presence Section */}
          <div className="space-y-3 pt-3 border-t border-[#1E222D]">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>2. Presença Sobrenatural (Aura & Cor)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Aspecto da Presença</label>
                <select
                  value={presenceAspect}
                  onChange={(e) => setPresenceAspect(e.target.value as PresenceAspect)}
                  className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232836] rounded text-xs text-white"
                >
                  <option value="ENTONA">ENTONA</option>
                  <option value="VONTADE">VONTADE</option>
                  <option value="CALAMIDADE">CALAMIDADE</option>
                  <option value="VAZIO">VAZIO</option>
                  <option value="SANGUE">SANGUE</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Nome da Cor</label>
                <input
                  type="text"
                  value={presenceColorName}
                  onChange={(e) => setPresenceColorName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#090B0E] border border-[#232836] rounded text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Cor Hexadecimal</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={presenceHexColor}
                    onChange={(e) => setPresenceHexColor(e.target.value)}
                    className="w-8 h-8 rounded border border-[#232836] cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={presenceHexColor}
                    onChange={(e) => setPresenceHexColor(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-[#090B0E] border border-[#232836] rounded text-xs text-white uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {presencePresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPresenceAspect(p.aspect);
                    setPresenceColorName(p.colorName);
                    setPresenceHexColor(p.hex);
                  }}
                  className="px-2.5 py-1 rounded bg-[#12151C] border text-[10px] flex items-center gap-1.5 hover:border-slate-400 transition-colors"
                  style={{ borderColor: `${p.hex}60` }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.hex }} />
                  <span style={{ color: p.hex === '#F8FAFC' ? '#FFF' : p.hex }}>{p.colorName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Atributos Diretos (Mistério da Ilha) */}
          <div className="space-y-3 pt-3 border-t border-[#1E222D]">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              3. Atributos Diretos do Sistema
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {[
                { label: 'FORÇA', val: attrFor, setVal: setAttrFor },
                { label: 'DESTREZA', val: attrDes, setVal: setAttrDes },
                { label: 'CONSTITUIÇÃO', val: attrCon, setVal: setAttrCon },
                { label: 'INTELIGÊNCIA', val: attrInt, setVal: setAttrInt },
                { label: 'SABEDORIA', val: attrSab, setVal: setAttrSab },
                { label: 'CARISMA', val: attrCar, setVal: setAttrCar },
              ].map((attr, i) => (
                <div key={i} className="p-3 bg-[#090B0E] border border-[#232836] rounded text-center">
                  <label className="text-[10px] text-slate-400 block mb-1 uppercase font-bold">
                    {attr.label}
                  </label>
                  <input
                    type="number"
                    value={attr.val}
                    onChange={(e) => attr.setVal(Number(e.target.value))}
                    className="w-full text-center py-1 bg-[#12151C] border border-[#232836] rounded text-lg font-extrabold text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#12151C] border-t border-[#232836]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-rose-700 hover:bg-rose-600 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-rose-950/60 transition-colors"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};
