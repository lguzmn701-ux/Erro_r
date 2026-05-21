import React, { useState } from "react";
import { Sparkles, Terminal, Flame, CornerDownLeft } from "lucide-react";

interface WelcomeScreenProps {
  onStart: (username: string) => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [tag, setTag] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTag = tag.trim() || `RBL_ART_0${Math.floor(Math.random() * 900 + 100)}`;
    onStart(finalTag);
  };

  return (
    <div className="min-h-screen bg-[#050506] flex items-center justify-center p-4 md:p-8 relative brutalist-grid overflow-hidden">
      {/* Absolute graphic noise element */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Decorative massive letters in backgrounds */}
      <div className="absolute text-[24vw] font-display font-bold select-none text-zinc-950 pointer-events-none -bottom-24 -left-12 leading-none opacity-40">
        SYS
      </div>
      <div className="absolute text-[18vw] font-display font-bold select-none text-zinc-950 pointer-events-none -top-12 -right-12 leading-none opacity-40">
        ERR
      </div>

      <div className="max-w-xl w-full bg-zinc-900/90 border-2 border-white rounded-none p-6 md:p-10 relative z-10 shadow-[8px_8px_0px_#FF007F]">
        {/* Punk warning banner */}
        <div className="bg-digital-magenta text-black text-xs font-bold py-1 px-3 uppercase tracking-widest inline-flex items-center gap-1.5 mb-6">
          <Flame className="w-3.5 h-3.5 fill-black" />
          <span>DECLARACIÓN ANTI-PERFECCIONISTA</span>
        </div>

        {/* Header Title */}
        <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight text-white select-none">
          ¿Listo para <span className="text-neon-green">destruir</span> tu zona de confort?
        </h2>

        {/* Philosophy Intro text */}
        <p className="text-zinc-300 mt-4 text-sm leading-relaxed border-l-2 border-acid-yellow pl-4">
          La inspiración corporativa está muerta. El orden impecable alimenta tus bloqueos. 
          Aquí, <strong>el error visual es tu mejor herramienta</strong>. Manipularemos, distorsionaremos, 
          mezclaremos corrientes y retaremos tu mente para liberar tu potencial artístico reprimido en el caos controlado.
        </p>

        {/* Nickname selection form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
              [INGRESA TU FIRMA DE DISEÑADOR REBELDE]
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-green font-mono text-lg font-bold">
                $
              </span>
              <input
                type="text"
                maxLength={18}
                value={tag}
                onChange={(e) => setTag(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                placeholder="TAG_ARTISTA"
                className="w-full bg-black border border-zinc-700 focus:border-neon-green focus:ring-1 focus:ring-neon-green font-mono text-white text-lg pl-8 pr-4 py-3 outline-none uppercase transition-all"
              />
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">
              *Solo caracteres numéricos, guiones o guiones bajos. Si lo dejas vacío, te generaremos un número de serie rebelde.
            </p>
          </div>

          <button
            type="submit"
            className="w-full group bg-white text-black hover:bg-neon-green hover:text-black font-display font-bold py-4 text-base tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 border-2 border-black"
          >
            <span>ACTIVAR DISRUPTOR VISUAL</span>
            <CornerDownLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Screen layout credits bar */}
        <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mt-8 border-t border-zinc-800 pt-4">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-acid-yellow" />
            <span>ESTADO DE REBELDÍA: CRÍTICO</span>
          </div>
          <span>CRAFTED IN CHAOS</span>
        </div>
      </div>
    </div>
  );
}
