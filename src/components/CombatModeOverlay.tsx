import React, { useState } from 'react';
import { Character, Weapon, Ability, Ritual, Condition } from '../types';
import { 
  Swords, 
  X, 
  Shield, 
  Heart, 
  Sparkles, 
  RotateCw, 
  Crosshair, 
  Flame, 
  Zap,
  Activity,
  ChevronRight
} from 'lucide-react';

interface CombatModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onUpdateResources: (pvDelta: number, prDelta: number) => void;
  onOpenRoll: (rollName: string, defaultFormula: string, rollType: 'ATAQUE' | 'DANO' | 'RITUAL') => void;
  onReloadWeapon: (weaponId: string) => void;
  onFireWeapon: (weaponId: string) => void;
  onCastRitual: (ritual: Ritual) => void;
  onUseAbility: (ability: Ability) => void;
}

export const CombatModeOverlay: React.FC<CombatModeOverlayProps> = ({
  isOpen,
  onClose,
  character,
  onUpdateResources,
  onOpenRoll,
  onReloadWeapon,
  onFireWeapon,
  onCastRitual,
  onUseAbility,
}) => {
  const [deltaVal, setDeltaVal] = useState<number>(5);

  if (!isOpen) return null;

  const equippedWeapons = (character.weapons || []).filter((w) => w.equipped);
  const favoriteAbilities = (character.abilities || []).filter((a) => a.favorite || a.status === 'DESBLOQUEADA').slice(0, 4);
  const favoriteRituals = (character.rituals || []).filter((r) => r.favorite || true).slice(0, 3);

  const pvCurrent = character.resources?.pv?.current ?? 0;
  const pvMax = character.resources?.pv?.max || 1;
  const prCurrent = character.resources?.pr?.current ?? 0;
  const prMax = character.resources?.pr?.max || 1;

  const pvPercent = Math.min(100, Math.max(0, (pvCurrent / pvMax) * 100));
  const prPercent = Math.min(100, Math.max(0, (prCurrent / prMax) * 100));

  const presenceHex = character.presence?.hexColor || '#F8FAFC';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 bg-[#14161d] border border-red-900/60 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-950 border border-red-700 text-red-500 shadow-md">
              <Swords className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-red-400 uppercase font-bold flex items-center gap-2">
                <span>MODO DE COMBATE TÁTICO</span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <span>{character.name}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  DEFESA {(typeof character.resources.defense === 'object' ? ((character.resources.defense as any)?.total ?? (character.resources.defense as any)?.base ?? 14) : (character.resources.defense ?? 14)) + (character.resources.defenseBonus || 0)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e2230] hover:bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Fechar Modo Combate</span>
          </button>
        </div>

        {/* Tactical Resource Gauges & Rapid Modifier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          
          {/* PV (Pontos de Vida) */}
          <div className="p-4 bg-[#151822] border border-rose-900/50 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <Heart className="w-4 h-4" />
                <span>PONTOS DE VIDA (PV)</span>
              </div>
              <div className="text-xl font-extrabold font-mono text-white">
                {character.resources.pv.current} <span className="text-sm font-normal text-slate-500">/ {character.resources.pv.max}</span>
              </div>
            </div>

            {/* Health Bar */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-rose-700 to-rose-500 transition-all duration-300"
                style={{ width: `${pvPercent}%` }}
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateResources(-deltaVal, 0)}
                  className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-200 font-mono text-xs font-bold rounded"
                >
                  -{deltaVal} PV
                </button>
                <button
                  onClick={() => onUpdateResources(-1, 0)}
                  className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-mono text-xs rounded"
                >
                  -1
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateResources(1, 0)}
                  className="px-2.5 py-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-mono text-xs rounded"
                >
                  +1
                </button>
                <button
                  onClick={() => onUpdateResources(deltaVal, 0)}
                  className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 font-mono text-xs font-bold rounded"
                >
                  +{deltaVal} PV
                </button>
              </div>
            </div>
          </div>

          {/* PR (Pontos de Presença) */}
          <div className="p-4 bg-[#151822] border border-blue-900/50 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Zap className="w-4 h-4" />
                <span>PONTOS DE PRESENÇA (PR)</span>
              </div>
              <div className="text-xl font-extrabold font-mono text-white">
                {character.resources.pr.current} <span className="text-sm font-normal text-slate-500">/ {character.resources.pr.max}</span>
              </div>
            </div>

            {/* PR Bar with Dynamic Presence Accent Glow */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${prPercent}%`,
                  backgroundColor: presenceHex === '#F8FAFC' ? '#60A5FA' : presenceHex,
                  boxShadow: `0 0 10px ${presenceHex}40`
                }}
              />
            </div>

            {/* Quick PR Actions */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateResources(0, -deltaVal)}
                  className="px-3 py-1.5 bg-blue-950/80 hover:bg-blue-900 border border-blue-700 text-blue-200 font-mono text-xs font-bold rounded"
                >
                  -{deltaVal} PR
                </button>
                <button
                  onClick={() => onUpdateResources(0, -1)}
                  className="px-2.5 py-1.5 bg-blue-950/60 hover:bg-blue-900 border border-blue-800 text-blue-300 font-mono text-xs rounded"
                >
                  -1
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateResources(0, 1)}
                  className="px-2.5 py-1.5 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-mono text-xs rounded"
                >
                  +1
                </button>
                <button
                  onClick={() => onUpdateResources(0, deltaVal)}
                  className="px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-200 font-mono text-xs font-bold rounded"
                >
                  +{deltaVal} PR
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Delta Step Selector & Active Conditions */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#11131a] rounded-lg border border-[#222634]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Passo de alteração rápida:</span>
            {[1, 5, 10, 20].map((step) => (
              <button
                key={step}
                onClick={() => setDeltaVal(step)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  deltaVal === step
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-[#1a1d26] text-slate-400 hover:text-white border border-[#2e3344]'
                }`}
              >
                {step}
              </button>
            ))}
          </div>

          {/* Conditions Active */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-mono text-slate-400">Condições:</span>
            {(!character.conditions || character.conditions.length === 0) ? (
              <span className="text-xs text-slate-500 font-mono">Normal (Nenhuma)</span>
            ) : (
              character.conditions.map((c) => (
                <span
                  key={c.id}
                  className="px-2 py-0.5 bg-rose-950/80 text-rose-300 border border-rose-700/80 rounded text-xs font-medium flex items-center gap-1"
                >
                  <Activity className="w-3 h-3 text-rose-400" />
                  <span>{c.name}</span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Equipped Weapons Section */}
        <div className="space-y-3">
          <div className="text-xs font-mono tracking-wider text-slate-400 uppercase font-bold flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-red-500" />
            <span>ARMAS EQUIPADAS & ATAQUES PRINCIPAIS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {equippedWeapons.length === 0 ? (
              <div className="p-4 bg-[#14161d] border border-[#222634] rounded-lg text-slate-500 text-xs font-mono">
                Nenhuma arma equipada no momento. Equipe uma arma na aba Combate da ficha.
              </div>
            ) : (
              equippedWeapons.map((wep) => {
                const charSkills = character.skills || [];
                const skill = charSkills.find((s) => s.name === wep.skillUsed) || charSkills[0];
                const attackFormula = `1d20 + ${skill ? skill.value : 10}`;
                const hasAmmo = wep.maxAmmo > 1;

                return (
                  <div
                    key={wep.id}
                    className="p-4 bg-[#14161d] border border-[#2a2e3d] hover:border-red-600/50 rounded-xl space-y-3 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold text-white uppercase">{wep.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {wep.type} • {wep.category} • Alcance: {wep.range}
                        </div>
                      </div>

                      {hasAmmo && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-[#1e2230] border border-[#2e3344] rounded text-xs font-mono text-amber-300">
                          <span>Munição:</span>
                          <span className="font-bold">{wep.currentAmmo}/{wep.maxAmmo}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#0f1117] p-2.5 rounded border border-[#222634]">
                      <div>
                        <span className="text-slate-500">Teste:</span>{' '}
                        <span className="text-slate-200 font-bold">{wep.skillUsed} ({attackFormula})</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Dano:</span>{' '}
                        <span className="text-rose-400 font-bold">{wep.damageFormula}</span> ({wep.damageType})
                      </div>
                    </div>

                    {wep.specialEffects && (
                      <div className="text-[11px] text-slate-400 italic bg-black/30 p-2 rounded border border-white/5">
                        {wep.specialEffects}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          if (hasAmmo && wep.currentAmmo > 0) {
                            onFireWeapon(wep.id);
                          }
                          onOpenRoll(`Ataque com ${wep.name}`, attackFormula, 'ATAQUE');
                        }}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>ATACAR</span>
                      </button>

                      <button
                        onClick={() => onOpenRoll(`Dano de ${wep.name}`, wep.damageFormula, 'DANO')}
                        className="flex-1 py-2 bg-[#1e2230] hover:bg-slate-800 text-rose-300 border border-rose-900/60 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>ROLAR DANO</span>
                      </button>

                      {hasAmmo && (
                        <button
                          onClick={() => onReloadWeapon(wep.id)}
                          title="Recarregar Munição"
                          className="px-3 py-2 bg-[#1a1d26] hover:bg-[#242836] border border-[#2e3344] text-slate-300 hover:text-white text-xs rounded-lg flex items-center justify-center transition-colors"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Favorite Rituals & Abilities Quick Triggers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Quick Rituals */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono tracking-wider text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>RITUAIS DE COMBATE</span>
            </div>
            <div className="space-y-2">
              {favoriteRituals.map((rit) => (
                <div
                  key={rit.id}
                  className="p-3 bg-[#14161d] border border-purple-950 hover:border-purple-800 rounded-lg flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-100">{rit.name}</div>
                    <div className="text-[10px] font-mono text-purple-400">
                      Gasto: {rit.prCost} PR • Troca: {rit.troca} • Dano: {rit.damageFormula || 'Efeito'}
                    </div>
                  </div>
                  <button
                    onClick={() => onCastRitual(rit)}
                    disabled={character.resources.pr.current < rit.prCost}
                    className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 disabled:opacity-40 border border-purple-700 text-purple-200 text-xs font-bold rounded flex items-center gap-1 shrink-0"
                  >
                    <span>CONJURAR</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Abilities */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono tracking-wider text-blue-400 uppercase font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>HABILIDADES RÁPIDAS</span>
            </div>
            <div className="space-y-2">
              {favoriteAbilities.map((ab) => (
                <div
                  key={ab.id}
                  className="p-3 bg-[#14161d] border border-blue-950 hover:border-blue-800 rounded-lg flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-100">{ab.name}</div>
                    <div className="text-[10px] font-mono text-blue-400">
                      Custo: {ab.prCost > 0 ? `${ab.prCost} PR` : 'Passiva/Livre'} • {ab.execution}
                    </div>
                  </div>
                  <button
                    onClick={() => onUseAbility(ab)}
                    className="px-3 py-1.5 bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 text-xs font-bold rounded flex items-center gap-1 shrink-0"
                  >
                    <span>USAR</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
