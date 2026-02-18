import React, { useState, useRef, useEffect } from "react";
import { Mountain, Mic, MicOff, Send, Compass, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { streamChat, type Msg } from "@/lib/streamChat";
import { useSettings } from "../context/SettingsContext";
import ChatMessage from "@/components/ChatMessage";

const Index = () => {
  const { t, lang, isDark } = useSettings();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { isListening, transcript, startListening, stopListening, setTranscript } = useVoiceInput();

  useEffect(() => { if (transcript) setInputText(transcript); }, [transcript]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const INTEREST_LIST = [
    { id: "mountains", label: t.interests.mountains },
    { id: "lakes", label: t.interests.lakes },
    { id: "history", label: t.interests.history },
    { id: "food", label: t.interests.food },
    { id: "culture", label: t.interests.culture },
    { id: "horse", label: t.interests.horse },
    { id: "nature", label: t.interests.nature },
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputText(""); setTranscript(""); setIsLoading(true); setShowChat(true);

    let assistantSoFar = "";
    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: (chunk) => {
          assistantSoFar += chunk;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
            }
            return [...prev, { role: "assistant", content: assistantSoFar }];
          });
        },
        onDone: () => setIsLoading(false),
      });
    } catch (e) { setIsLoading(false); }
  };

  const handleQuickPlan = () => {
    const selected = interests.map(id => INTEREST_LIST.find(i => i.id === id)?.label).join(", ");
    const prompt = lang === "ky" 
      ? `Мага ${days} күнгө, ${budget} сом бюджет менен саякат планы керек. Кызыгууларым: ${selected}` 
      : `План на ${days} дня, бюджет ${budget} сом. Интересы: ${selected}`;
    sendMessage(prompt);
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#0f172a] text-white" : "bg-slate-50 text-slate-900"} pb-24 transition-all`}>
      <AnimatePresence>
        {!showChat && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* СҮРӨТ БАР HEADER */}
            <div className="relative h-[45vh] flex items-center justify-center overflow-hidden">
              {/* Бул жерде Кыргызстандын тоолорунун кооз сүрөтү */}
              <img 
                src="https://images.unsplash.com/photo-1544084944-15269ec7b5a0?q=80&w=2000" 
                alt="Kyrgyzstan Mountains" 
                className="absolute inset-0 w-full h-full object-cover scale-110 motion-safe:animate-[pulse_10s_ease-in-out_infinite]"
              />
              {/* Сүрөттүн үстүнө караңгылатуу (Gradient) - текст жакшы көрүнүшү үчүн */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-blue-900/20 to-slate-950/80" />
              
              <div className="relative z-10 text-center px-6">
                <motion.div 
                   initial={{ scale: 0 }} 
                   animate={{ scale: 1 }} 
                   className="inline-block p-3 bg-white/20 backdrop-blur-xl rounded-full mb-4 border border-white/30 shadow-2xl"
                >
                  <Mountain className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                </motion.div>
                <h1 className="text-4xl font-black text-white mb-2 drop-shadow-2xl tracking-tighter italic">AkylTour</h1>
                <p className="text-blue-50/90 text-sm max-w-xs mx-auto font-medium">{t.heroTitle}</p>
              </div>
            </div>

            {/* ПЛАНДОО КАРТАСЫ */}
            <div className="max-w-md mx-auto px-4 -mt-16 relative z-20">
              <div className={`backdrop-blur-2xl p-7 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border ${isDark ? "bg-slate-900/90 border-white/10" : "bg-white/95 border-blue-50"}`}>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">{t.budget}</label>
                    <div className="relative mt-1">
                      <input
                        type="number" value={budget} onChange={(e) => setBudget(e.target.value)}
                        placeholder="5000"
                        className={`w-full p-4 pl-12 rounded-2xl border-none ${isDark ? "bg-white/5" : "bg-slate-100"} outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all`}
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 font-bold">С</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-black mb-3">
                      <span className="opacity-40 uppercase tracking-widest">{t.days}</span>
                      <span className="text-white bg-blue-600 px-3 py-1 rounded-full shadow-lg shadow-blue-500/40">{days}</span>
                    </div>
                    <input type="range" min={1} max={14} value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {INTEREST_LIST.map((i) => (
                      <button
                        key={i.id}
                        onClick={() => setInterests(prev => prev.includes(i.id) ? prev.filter(x => x !== i.id) : [...prev, i.id])}
                        className={`px-4 py-2 rounded-2xl text-[11px] font-bold transition-all border ${
                          interests.includes(i.id) 
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105" 
                          : "bg-transparent border-slate-200 text-slate-500 hover:border-blue-200"
                        }`}
                      >
                        {i.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleQuickPlan}
                    className="w-full py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-[1.8rem] font-black shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-95 transition-all uppercase tracking-wider text-xs"
                  >
                    <Sparkles className="w-5 h-5 animate-pulse" /> {t.createRoute}
                  </button>
                </div>
              </div>
            </div>

            {/* ҮНҮШҮҮ БАСКЫЧЫ */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={isListening ? stopListening : startListening}
              className={`fixed bottom-28 right-6 w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.3)] z-50 transition-all ${isListening ? "bg-red-500 animate-pulse" : "bg-blue-600 text-white"}`}
            >
              {isListening ? <MicOff size={30} /> : <Mic size={30} />}
              <span className="text-[8px] font-bold mt-1 uppercase tracking-tighter">{isListening ? "REC" : "Talk"}</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ЧАТ БӨЛҮМҮ */}
      {showChat && (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <div className={`p-5 border-b flex items-center justify-between sticky top-0 z-50 ${isDark ? "bg-[#0f172a]/90" : "bg-white/90"} backdrop-blur-xl`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20"><Mountain size={20}/></div>
              <span className="font-black tracking-tight italic">AkylTour AI</span>
            </div>
            <button onClick={() => { setShowChat(false); setMessages([]); }} className="text-[10px] bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-black uppercase tracking-wider shadow-sm">{t.newChat}</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((msg, i) => <ChatMessage key={i} message={msg} />)}
            <div ref={chatEndRef} />
          </div>

          <div className={`p-4 pb-12 border-t ${isDark ? "bg-[#1e293b]" : "bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.05)]"}`}>
            <div className="flex items-center gap-2 max-w-2xl mx-auto">
              <input
                value={inputText} onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(inputText)}
                placeholder={t.writeQuestion}
                className={`flex-1 p-4 rounded-[1.5rem] outline-none border-none shadow-inner ${isDark ? "bg-white/5" : "bg-slate-100"}`}
              />
              <button onClick={() => sendMessage(inputText)} className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/30 active:scale-90 transition-all"><Send size={22}/></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;