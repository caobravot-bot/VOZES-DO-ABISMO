import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Character } from '../types';

interface DeleteCharacterModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (characterId: string) => void;
  onConfirmDelete?: (characterId: string) => void;
}

export const DeleteCharacterModal: React.FC<DeleteCharacterModalProps> = ({
  character,
  isOpen,
  onClose,
  onConfirm,
  onConfirmDelete,
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !character) return null;

  const handleConfirm = () => {
    if (confirmationText.trim().toUpperCase() !== 'EXCLUIR') {
      setError('Digite exatamente "EXCLUIR" em maiúsculas para confirmar.');
      return;
    }
    if (onConfirm) {
      onConfirm(character.id);
    } else if (onConfirmDelete) {
      onConfirmDelete(character.id);
    }
    setConfirmationText('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#10131A] border-2 border-red-800 rounded-lg p-6 shadow-2xl shadow-red-950/40 text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-red-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-950/60 border border-red-700/50 rounded-lg text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-title-paranormal text-lg font-bold text-red-200">
                DESTRUIR DOSSIÊ
              </h3>
              <p className="text-xs text-red-400 font-mono">
                {character.archiveCode || 'ARQ-CONFIDENCIAL'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Content */}
        <div className="space-y-4 text-sm text-slate-300">
          <div className="p-3.5 bg-red-950/30 border border-red-800/40 rounded text-red-200">
            <p className="font-semibold text-red-300">Atenção, Diretor:</p>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Você está prestes a apagar permanentemente o dossiê de{' '}
              <strong className="text-red-300 font-bold">{character.name}</strong>. Esta ação não pode ser desfeita e removerá todos os atributos, perícias, rituais, inventário e segredos do banco de dados.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Para confirmar a eliminação, digite <span className="text-red-400 font-bold">EXCLUIR</span> abaixo:
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => {
                setConfirmationText(e.target.value);
                if (error) setError('');
              }}
              placeholder="Digite EXCLUIR"
              className="w-full px-3 py-2 bg-[#08090D] border border-red-800/60 rounded text-center font-mono font-bold tracking-widest text-red-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              autoFocus
            />
            {error && <p className="mt-1 text-xs text-red-400 font-mono">{error}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-semibold uppercase text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={confirmationText.trim().toUpperCase() !== 'EXCLUIR'}
            className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-red-700 text-white rounded transition-colors shadow-lg shadow-red-950/60"
          >
            <Trash2 className="w-4 h-4" />
            Destruir Dossiê
          </button>
        </div>
      </div>
    </div>
  );
};
