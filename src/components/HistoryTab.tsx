import React from 'react';
import { CharacterBio } from '../types';
import { BookOpen, User, Target, HeartCrack, Users, FileText } from 'lucide-react';

interface HistoryTabProps {
  bio?: CharacterBio;
  onUpdateBio: (updated: Partial<CharacterBio>) => void;
  isMaster?: boolean;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ bio = {}, onUpdateBio, isMaster }) => {
  const safeBio: CharacterBio = bio || {};

  return (
    <div className="space-y-4">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Histórico & Origem */}
        <div className="p-4 bg-[#14161d] border border-[#222634] rounded-xl space-y-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-[#222634] pb-2">
            <BookOpen className="w-4 h-4 text-red-500" />
            <span>HISTÓRICO & ANTECEDENTES</span>
          </div>
          <textarea
            value={safeBio.history || safeBio.lore || ''}
            onChange={(e) => onUpdateBio({ history: e.target.value, lore: e.target.value })}
            rows={5}
            placeholder="Relatório sobre a infância, recrutamento e eventos que trouxeram o agente até a Ilha..."
            className="w-full p-2.5 bg-[#0d0e12] border border-[#2a2e3d] focus:border-red-500 rounded text-xs font-sans text-slate-200 leading-relaxed outline-none"
          />
        </div>

        {/* Aparência & Descrição Visual */}
        <div className="p-4 bg-[#14161d] border border-[#222634] rounded-xl space-y-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-[#222634] pb-2">
            <User className="w-4 h-4 text-blue-400" />
            <span>APARÊNCIA & VESTIMENTA TÁTICA</span>
          </div>
          <textarea
            value={safeBio.appearance || ''}
            onChange={(e) => onUpdateBio({ appearance: e.target.value })}
            rows={5}
            placeholder="Cicatrizes, roupas formais ou de campo, marcas visíveis, porte físico e presença corporal..."
            className="w-full p-2.5 bg-[#0d0e12] border border-[#2a2e3d] focus:border-blue-500 rounded text-xs font-sans text-slate-200 leading-relaxed outline-none"
          />
        </div>

      </div>

      {/* Psychology & Motivations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Personalidade */}
        <div className="p-4 bg-[#14161d] border border-[#222634] rounded-xl space-y-2 shadow-lg">
          <div className="text-xs font-mono font-bold text-slate-300 uppercase">
            Personalidade & Traços
          </div>
          <textarea
            value={safeBio.personality || ''}
            onChange={(e) => onUpdateBio({ personality: e.target.value })}
            rows={3}
            placeholder="Comportamento sob pressão, cinismo, estoicismo..."
            className="w-full p-2 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-200"
          />
        </div>

        {/* Objetivos */}
        <div className="p-4 bg-[#14161d] border border-[#222634] rounded-xl space-y-2 shadow-lg">
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 uppercase">
            <Target className="w-3.5 h-3.5" />
            <span>Objetivos & Motivações</span>
          </div>
          <textarea
            value={safeBio.goals || ''}
            onChange={(e) => onUpdateBio({ goals: e.target.value })}
            rows={3}
            placeholder="O que o personagem busca descobrir ou proteger..."
            className="w-full p-2 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-200"
          />
        </div>

        {/* Medos & Traumas */}
        <div className="p-4 bg-[#14161d] border border-[#222634] rounded-xl space-y-2 shadow-lg">
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-rose-400 uppercase">
            <HeartCrack className="w-3.5 h-3.5" />
            <span>Medos & Traumas</span>
          </div>
          <textarea
            value={safeBio.fears || ''}
            onChange={(e) => onUpdateBio({ fears: e.target.value })}
            rows={3}
            placeholder="Fobias paranormais, memórias perturbadoras..."
            className="w-full p-2 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-mono text-slate-200"
          />
        </div>

      </div>

      {/* Relacionamentos & Vínculos */}
      <div className="p-4 bg-[#14161d] border border-[#222634] rounded-xl space-y-2.5 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-[#222634] pb-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>REDE DE RELACIONAMENTOS & VÍNCULOS NA ILHA</span>
        </div>
        <textarea
          value={safeBio.relationships || ''}
          onChange={(e) => onUpdateBio({ relationships: e.target.value })}
          rows={3}
          placeholder="Aliados de confiança, rivais na organização, mentores e dívidas de sangue..."
          className="w-full p-2.5 bg-[#0d0e12] border border-[#2a2e3d] rounded text-xs font-sans text-slate-200"
        />
      </div>

    </div>
  );
};
