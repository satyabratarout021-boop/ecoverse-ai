import React, { useState } from 'react';
import { aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  Send,
  Sparkles,
  Globe,
  User,
  ShieldCheck,
  RotateCcw,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const EcoAIPage = () => {
  const { user } = useAuth();
  const [language, setLanguage] = useState('en');
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text:
        `Hello ${user ? user.name : 'there'}! I am **EcoAI**, your civic assistant for EcoVerse AI.\n\n` +
        `I can help you check live complaint statuses, guide you on waste segregation rules, explain water and clean energy telemetry, or navigate the 3D smart village and city environment.\n\n` +
        `How may I assist you today?`,
      timestamp: new Date(),
    },
  ]);

  const suggestions = {
    en: [
      'What is the status of ECO-2026-1001?',
      'How do I segregate plastic from organic waste?',
      'How to report a water pipeline leakage?',
      'Explain the civic complaint resolution workflow',
    ],
    hi: [
      'मेरी शिकायत ECO-2026-1001 की क्या स्थिति है?',
      'गीला और सूखा कचरा कैसे अलग करें?',
      'पानी की लीकेज की शिकायत कैसे दर्ज करें?',
      'नागरिक समाधान प्रक्रिया कैसे काम करती है?',
    ],
    or: [
      'ମୋର ଅଭିଯୋଗ ECO-2026-1001 ର ସ୍ଥିତି କ’ଣ?',
      'ଆବର୍ଜନା ପୃଥକୀକରଣ ନିୟମ କ’ଣ?',
      'ପାଣି ଲିକ୍ ସମ୍ବନ୍ଧରେ କିପରି ଅଭିଯୋଗ କରିବେ?',
    ],
  };

  const handleSend = async (textToSend = null) => {
    const text = textToSend || inputPrompt;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await aiAPI.chat(text, language);
      if (res.data.success) {
        const aiMsg = {
          sender: 'ai',
          text: res.data.reply,
          source: res.data.source,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('AI Chat Error:', err);
      const errMsg = {
        sender: 'ai',
        text: 'I am currently unable to reach the AI service. Please verify your connection or try asking about your complaint ID directly.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'ai',
        text: 'Conversation history reset. How can I assist you?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-teal-950/20 to-slate-950">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              MODULE FIVE
            </span>
            <span className="text-xs text-slate-400">Multilingual Civic Intelligence</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">EcoAI — Assistant & Knowledge Hub</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time complaint tracking from database records, civic FAQs, waste guidelines, and clean energy insights.
          </p>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-700 self-start sm:self-auto">
          <Globe className="w-4 h-4 text-cyan-400 ml-2" />
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              language === 'en' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              language === 'hi' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिन्दी
          </button>
          <button
            onClick={() => setLanguage('or')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              language === 'or' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            ଓଡ଼ିଆ
          </button>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="rounded-3xl glass-panel border border-slate-800 flex flex-col h-[560px] overflow-hidden shadow-2xl">
        {/* Chat Header Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">EcoAI Civic Model Online</span>
            <span className="text-[10px] text-slate-500 font-mono">
              [Anti-Hallucination DB Verifier Active]
            </span>
          </div>
          <button
            onClick={handleClearChat}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-tr from-cyan-600 to-teal-500 text-white shadow-md'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs space-y-2 leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  {m.source && (
                    <div className="text-[10px] font-mono text-cyan-400 pt-1 border-t border-slate-800/80">
                      Source: {m.source}
                    </div>
                  )}
                  <span className={`block text-[9px] ${isUser ? 'text-emerald-200' : 'text-slate-500'}`}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 mr-auto">
              <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>EcoAI is formulating response...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Pills */}
        <div className="px-6 py-2 border-t border-slate-800/60 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
          {(suggestions[language] || suggestions.en).map((sugg, i) => (
            <button
              key={i}
              onClick={() => handleSend(sugg)}
              className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-all"
            >
              {sugg}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={
                language === 'hi'
                  ? 'EcoAI से कुछ भी पूछें... (उदा. शिकायत स्थिति, कचरा नियम)'
                  : language === 'or'
                  ? 'EcoAI କୁ କିଛି ବି ପଚାରନ୍ତୁ... (ଯଥା: ଅଭିଯୋଗ ସ୍ଥିତି)'
                  : 'Ask EcoAI anything... (e.g. Check complaint status, waste rules)'
              }
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
