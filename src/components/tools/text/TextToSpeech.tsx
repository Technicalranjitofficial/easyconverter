"use client";
import { useState, useEffect } from "react";
import { Play, Square, Volume2 } from "lucide-react";

export default function TextToSpeech() {
  const [text, setText]     = useState("Hello! This is a text to speech demo. Type anything and click Play.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [rate, setRate]     = useState(1);
  const [pitch, setPitch]   = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!("speechSynthesis" in window)) { setSupported(false); return; }
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) setVoices(v);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const play = () => {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    if (voices[voiceIdx]) utt.voice = voices[voiceIdx];
    utt.rate  = rate;
    utt.pitch = pitch;
    utt.onstart = () => setSpeaking(true);
    utt.onend   = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const stop = () => { window.speechSynthesis.cancel(); setSpeaking(false); };

  if (!supported) return (
    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700">
      Your browser does not support the Web Speech API. Try Chrome or Edge.
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <textarea rows={7} value={text} onChange={e => setText(e.target.value)}
        placeholder="Type text to convert to speech…"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                   bg-white placeholder-slate-300 resize-none focus:outline-none
                   focus:ring-2 focus:ring-indigo-500 transition-all leading-relaxed" />
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Voice Settings</span>
        </div>
        <div className="p-4 bg-white space-y-4">
          {voices.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Voice</label>
              <select value={voiceIdx} onChange={e => setVoiceIdx(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                           bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {voices.map((v, i) => (
                  <option key={v.name} value={i}>{v.name} ({v.lang})</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Speed</label>
                <span className="text-xs font-mono font-semibold text-indigo-600">{rate}x</span>
              </div>
              <input type="range" min={0.5} max={2} step={0.1} value={rate}
                onChange={e => setRate(Number(e.target.value))}
                className="w-full accent-indigo-500 h-2 rounded-full cursor-pointer" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Pitch</label>
                <span className="text-xs font-mono font-semibold text-indigo-600">{pitch}</span>
              </div>
              <input type="range" min={0} max={2} step={0.1} value={pitch}
                onChange={e => setPitch(Number(e.target.value))}
                className="w-full accent-indigo-500 h-2 rounded-full cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={speaking ? stop : play} disabled={!text.trim()}
          className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl
                      font-semibold text-white text-sm transition-all disabled:opacity-50
                      ${speaking
                        ? "bg-red-600 hover:bg-red-500 shadow-[0_4px_20px_rgba(239,68,68,0.35)]"
                        : "bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(79,70,229,0.35)]"
                      }`}>
          {speaking ? <><Square className="w-5 h-5" />Stop</> : <><Play className="w-5 h-5" />Play</>}
        </button>
      </div>
    </div>
  );
}
