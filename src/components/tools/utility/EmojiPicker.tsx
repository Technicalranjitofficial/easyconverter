"use client";
import { useState } from "react";
import { Copy, Check, Search } from "lucide-react";

const CATEGORIES: { name: string; emojis: string[] }[] = [
  { name: "Smileys", emojis: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥸","😎","🤓","🧐"] },
  { name: "Gestures", emojis: ["👍","👎","👊","✊","🤛","🤜","🤝","🙌","👐","🤲","🙏","✌️","🤞","🤟","🤘","👌","🤌","🤏","👈","👉","👆","👇","☝️","👋","🤚","✋","🖐","🖖","💪","🦾","🦿","🖕"] },
  { name: "Animals", emojis: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐻‍❄️","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦅","🦉","🦇","🐺","🐗","🦄","🐝","🦋","🐛","🐌","🐞","🐜","🦟","🦗","🕷","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🦭","🐊","🐅","🐆","🦓","🦍","🦧","🦣","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🦬","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐕‍🦺","🐈","🐈‍⬛","🐓","🦃","🦤","🦚","🦜","🦢","🦩","🕊","🐇","🦝","🦨","🦡","🦫","🦦","🦥","🐁","🐀","🐿","🦔"] },
  { name: "Food",    emojis: ["🍎","🍊","🍋","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🧅","🧄","🥔","🌽","🌶","🫑","🥒","🥬","🥗","🌿","🫚","🧂","🥐","🥯","🍞","🥖","🥨","🧀","🥚","🍳","🥞","🧇","🥓","🥩","🍗","🍖","🌭","🍔","🍟","🍕","🫓","🥙","🧆","🌮","🌯","🫔","🥫","🍱","🍘","🍙","🍚","🍛","🍜","🍝","🍠","🍢","🍣","🍤","🍥","🥮","🍡","🥟","🦪","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","☕","🫖","🍵","🧃","🥤","🧋","🍶","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🧉","🍾"] },
  { name: "Objects", emojis: ["⌚","📱","💻","🖥","🖨","⌨️","🖱","🖲","🕹","💾","💿","📀","📷","📹","🎥","📡","📺","📻","🎙","📢","🔋","🔌","💡","🔦","🕯","💰","💳","💸","🪙","💎","⚖️","🔧","🔨","⚒️","🛠","🗡","🔫","🪃","🗝","🔑","🪤","🧲","💊","🩺","🩻","🧬","🔭","🔬","🩹","💉","🩸","🧰","🪝","🧲","🧯","🛒","🚪","🪟","🪑","🛋","🚽","🚿","🪠","🪞","🛏","🛁","🧴","🧹","🧺","🧻","🧼","🪣","🧽","🧻","📦","📫","📪","📬","📭","📮","📯","📜","📄","📋","📁","📂","🗂","📅","📆","🗒","🗓","📇","📈","📉","📊","📌","📍","📎","🖇","📏","📐","✂️","🗃","🗄","🗑","🔒","🔓","🔏","🔐"] },
  { name: "Nature",  emojis: ["🌸","🌺","🌻","🌹","🌷","💐","🌼","🌝","🌛","🌜","🌞","⭐","🌟","💫","✨","⚡","☄️","🌈","☁️","⛅","🌤","🌥","🌦","🌧","🌩","🌪","🌫","❄️","🌬","🌀","🌊","💧","🔥","🌍","🌎","🌏","🗻","🏔","⛰","🌋","🗾","🏕","🏖","🏜","🏝","🏞","🌅","🌄","🌠","🎆","🎇","🌃","🏙","🌉","🌌"] },
  { name: "Symbols", emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🕉","✡️","🔯","🕎","☯️","☦️","🛐","⛎","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","🆔","⚕️","♾","🈴","🈳","🈺","🈵","🈹","🈲","🅰️","🅱️","🆎","🆑","🅾️","🆘","❌","⭕","🛑","⛔","📛","🚫","✅","☑️","✔️","❎","🔀","🔁","🔂","▶️","⏩","⏪","⏫","⏬","◀️","🔼","🔽","⏸","⏹","⏺","🎦","🔅","🔆","📶","📳","📴","📵","📴","🔇","🔕","🔔","🔕","📣","📢","🔊","🔉","🔈","🔇","🔔","🔕"] },
];

export default function EmojiPicker() {
  const [search, setSearch]   = useState("");
  const [copied, setCopied]   = useState<string | null>(null);
  const [catIdx, setCatIdx]   = useState(0);
  const [collected, setCollected] = useState<string[]>([]);

  const copy = async (emoji: string) => {
    await navigator.clipboard.writeText(emoji);
    setCopied(emoji); setTimeout(() => setCopied(null), 1200);
  };

  const collect = (emoji: string) => {
    setCollected(prev => prev.includes(emoji) ? prev.filter(e => e !== emoji) : [...prev, emoji]);
  };

  const filteredEmojis = search
    ? CATEGORIES.flatMap(c => c.emojis).filter(e => e.includes(search))
    : CATEGORIES[catIdx].emojis;

  return (
    <div className="w-full space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search emoji… (paste or type emoji)"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
      </div>
      {/* Category tabs */}
      {!search && (
        <div className="flex flex-wrap gap-1.5 overflow-x-auto">
          {CATEGORIES.map((c, i) => (
            <button key={c.name} onClick={() => setCatIdx(i)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex-shrink-0 ${
                catIdx === i ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}>{c.name}</button>
          ))}
        </div>
      )}
      {/* Grid */}
      <div className="grid grid-cols-10 sm:grid-cols-12 gap-1 max-h-64 overflow-y-auto">
        {filteredEmojis.map(emoji => (
          <button key={emoji} onClick={() => { copy(emoji); collect(emoji); }}
            title={emoji}
            className={`text-2xl h-10 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center
                         ${copied === emoji ? "bg-indigo-100 scale-125" : ""}`}>
            {emoji}
          </button>
        ))}
      </div>
      {/* Collected */}
      {collected.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Collected ({collected.length})</label>
            <button onClick={async () => { await navigator.clipboard.writeText(collected.join("")); setCopied("all"); setTimeout(() => setCopied(null), 1800); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">
              {copied === "all" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === "all" ? "Copied!" : "Copy All"}
            </button>
          </div>
          <div className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-2xl flex flex-wrap gap-1">
            {collected.map(e => (
              <button key={e} onClick={() => collect(e)} title="Click to remove" className="hover:opacity-50 transition-opacity">{e}</button>
            ))}
          </div>
        </div>
      )}
      <p className="text-xs text-slate-400 text-center">Click to copy and collect · Click again in collected strip to remove</p>
    </div>
  );
}
