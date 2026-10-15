import React, { useEffect, useState } from 'react';
const KEY = 'ted-preferred-voice';
const PREVIEW = 'Hello. I am Ted, your OCG LAB technology lead. What would you like to work on today?';
export const TedVoicePicker: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [chosen, setChosen] = useState(() => { try { return localStorage.getItem(KEY) ?? ''; } catch { return ''; } });
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const refresh = () => setVoices(window.speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith('en')));
    refresh();
    window.speechSynthesis.addEventListener('voiceschanged', refresh);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', refresh);
  }, []);
  const save = (name: string) => {
    setChosen(name);
    try { if (name) localStorage.setItem(KEY, name); else localStorage.removeItem(KEY); } catch { /* storage disabled */ }
  };
  const preview = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(PREVIEW);
    const voice = voices.find(v => v.name === chosen);
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };
  return <div className="relative">
    <button type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">TED voice</button>
    {open && <div className="absolute right-0 top-10 z-50 w-[min(340px,90vw)] rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-2 text-sm font-bold">TED voice settings</div>
      <p className="mb-3 text-xs text-slate-600">Choose and preview a voice installed in this browser. Premium neural speech is not connected.</p>
      <label htmlFor="ted-voice-select" className="mb-1 block text-xs font-medium">Speaking voice</label>
      <select id="ted-voice-select" value={chosen} onChange={e => save(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm">
        <option value="">Automatic executive voice</option>
        {voices.map(v => <option key={v.voiceURI} value={v.name}>{v.name} ({v.lang})</option>)}
      </select>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={preview} disabled={!voices.length} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">Preview voice</button>
        <button type="button" onClick={() => window.speechSynthesis?.cancel()} className="rounded-lg border border-slate-300 px-3 py-2 text-xs">Stop preview</button>
      </div>
      {!voices.length && <p className="mt-2 text-xs text-amber-700">No English voices reported by this browser.</p>}
    </div>}
  </div>;
};
