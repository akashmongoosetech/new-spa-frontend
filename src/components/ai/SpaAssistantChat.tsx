import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Bot, Calendar, RotateCcw, Copy, Check, RefreshCw, BookOpen } from 'lucide-react';
import Markdown from 'react-markdown';
import { api } from '../../services/api';
import { showToast } from '../../utils/toastEvents';
import { Service, Therapist } from '../../types';

interface ChatSource {
  title: string;
  url: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: ChatSource[];
  grounded?: boolean;
  at?: number;
}

interface SpaAssistantChatProps {
  onOpenBooking: () => void;
  services?: Service[];
  therapists?: Therapist[];
}

const WELCOME: ChatMessage = {
  id: 'msg-1',
  sender: 'assistant',
  text: 'Welcome to **Tripod Wellness**! I am your AI concierge, connected to our live services, prices, availability and policies.\n\nHow may I assist you today?',
};

function fmtTime(at?: number): string {
  if (!at) return '';
  try {
    return new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export const SpaAssistantChat: React.FC<SpaAssistantChatProps> = ({ onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [conversationId, setConversationId] = useState<string>(() => {
    try {
      return localStorage.getItem('tripod_chat_id') || '';
    } catch {
      return '';
    }
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamText, isOpen, streaming]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const pushUser = (text: string): ChatMessage[] => {
    const userMsg: ChatMessage = { id: `usr-${Date.now()}`, sender: 'user', text, at: Date.now() };
    const next = [...messages, userMsg];
    setMessages(next);
    return next;
  };

  const runStream = async (queryText: string, base: ChatMessage[]) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setStreaming(true);
    setStreamText('');
    let acc = '';
    try {
      const history = base
        .slice(1)
        .slice(-6)
        .map((m) => ({ sender: m.sender, text: m.text.slice(0, 1000) }));
      const done = await api.sendChatStream({
        message: queryText.slice(0, 1000),
        conversationId: conversationId || undefined,
        history,
        signal: ctrl.signal,
        onToken: (t) => {
          acc += (acc ? ' ' : '') + t;
          setStreamText(acc.slice(0, 4000));
        },
      });
      if (done.conversationId) {
        setConversationId(done.conversationId);
        try {
          localStorage.setItem('tripod_chat_id', done.conversationId);
        } catch {
          /* ignore */
        }
      }
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: (done.answer || acc).slice(0, 4000),
        sources: done.sources,
        grounded: done.grounded,
        at: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'Assistant unavailable';
      showToast({ type: 'error', title: 'Chat failed', message });
      // Fallback: legacy non-streaming endpoint keeps the chat usable.
      try {
        const history = base
          .slice(1)
          .slice(-6)
          .map((m) => ({ sender: m.sender, text: m.text.slice(0, 1000) }));
        const fb = await api.sendAiChat(queryText.slice(0, 1000), history);
        setMessages((prev) => [
          ...prev,
          { id: `ast-fb-${Date.now()}`, sender: 'assistant', text: String(fb.reply || '').slice(0, 2000), at: Date.now() },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `ast-err-${Date.now()}`,
            sender: 'assistant',
            text: 'Sorry, I\'m temporarily unable to help. Please try again shortly or tap **Book Appointment**.',
            at: Date.now(),
          },
        ]);
      }
    } finally {
      setStreaming(false);
      setStreamText('');
      abortRef.current = null;
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const queryText = (customText || inputPrompt).trim();
    if (!queryText || streaming) return;
    const base = pushUser(queryText);
    if (!customText) setInputPrompt('');
    await runStream(queryText, base);
  };

  const handleRegenerate = async () => {
    if (streaming) return;
    const lastUser = [...messages].reverse().find((m) => m.sender === 'user');
    if (!lastUser) return;
    setMessages((prev) => {
      const idx = prev.map((m) => m.id).lastIndexOf(lastUser.id);
      return prev.slice(0, idx + 1);
    });
    await runStream(lastUser.text, [...messages]);
  };

  const handleClearChat = async () => {
    abortRef.current?.abort();
    if (conversationId) {
      try {
        await api.clearChatHistory(conversationId);
      } catch {
        /* server cleanup best-effort */
      }
    }
    setConversationId('');
    try {
      localStorage.removeItem('tripod_chat_id');
    } catch {
      /* ignore */
    }
    setMessages([{ ...WELCOME, id: `msg-${Date.now()}` }]);
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      showToast({ type: 'error', title: 'Copy failed', message: 'Could not copy to clipboard.' });
    }
  };

  const quickPrompts = [
    'Services & Pricing',
    'Are slots available tomorrow?',
    'What are your working hours?',
    'Where are you located?',
    'Book Appointment',
  ];

  const promptToQuery: Record<string, string> = {
    'Services & Pricing': 'What services do you offer and what are the prices?',
    'Are slots available tomorrow?': 'Are slots available tomorrow?',
    'What are your working hours?': 'What are your working hours?',
    'Where are you located?': 'Where are you located and how can I contact you?',
  };

  return (
    <>
      {/* Floating Action Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          id="ai-concierge-launcher-btn"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative px-5 py-3.5 rounded-full bg-linear-to-r from-[#2CB5A0] to-[#1a6e61] text-white shadow-2xl flex items-center gap-2.5 font-sans font-bold text-sm cursor-pointer border border-teal-300/30"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
          <span className="hidden sm:inline">Tripod AI Spa Assistant</span>
          <span className="sm:hidden">AI Concierge</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute top-1 right-1" />
        </motion.button>
      </div>

      {/* Floating Assistant Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-105 h-140 max-h-[calc(100dvh-6rem)] bg-white rounded-3xl shadow-2xl border border-teal-100 flex flex-col overflow-hidden font-sans"
            role="dialog"
            aria-label="Tripod Wellness Concierge chat"
          >
            {/* Header */}
            <div className="bg-[#1A1A1A] text-white p-4 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2CB5A0] flex items-center justify-center text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm tracking-wide flex items-center gap-1.5">
                    Tripod Wellness Concierge <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </h3>
                  <p className="text-[10px] text-teal-300">Live answers from studio data + AI</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  id="ai-chat-reset-btn"
                  onClick={handleClearChat}
                  title="Clear Conversation"
                  aria-label="Clear conversation"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  id="ai-chat-close-btn"
                  onClick={() => {
                    abortRef.current?.abort();
                    setIsOpen(false);
                  }}
                  aria-label="Close chat"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-[#2CB5A0] text-white flex items-center justify-center shrink-0 text-xs mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#1A1A1A] text-white rounded-tr-none'
                        : 'bg-white border border-gray-200/80 text-gray-800 rounded-tl-none shadow-xs'
                    }`}
                  >
                    <div className="markdown-body space-y-1.5 prose-xs">
                      <Markdown allowedElements={['p', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'code']} skipHtml>{msg.text}</Markdown>
                    </div>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 border-t border-gray-100 pt-2">
                        {msg.sources.map((s, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700"
                          >
                            <BookOpen className="w-3 h-3" />
                            {s.url ? (
                              <a href={s.url} target="_blank" rel="noreferrer" className="hover:underline">
                                {s.title}
                              </a>
                            ) : (
                              s.title
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className={`text-[10px] ${msg.sender === 'user' ? 'text-gray-400' : 'text-gray-400'}`}>
                        {fmtTime(msg.at)}
                      </span>
                      {msg.sender === 'assistant' && msg.id !== 'msg-1' && (
                        <span className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            title="Copy response"
                            aria-label="Copy response"
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={handleRegenerate}
                            title="Regenerate response"
                            aria-label="Regenerate response"
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {streaming && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-[#2CB5A0] text-white flex items-center justify-center shrink-0 text-xs mt-1">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed bg-white border border-gray-200/80 text-gray-800 rounded-tl-none shadow-xs">
                    {streamText ? (
                      <div className="markdown-body space-y-1.5 prose-xs">
                        <Markdown allowedElements={['p', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'code']} skipHtml>{streamText}</Markdown>
                      </div>
                    ) : (
                      <span className="font-medium text-teal-700">Tripod AI is checking live studio data…</span>
                    )}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto scrollbar-none">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (prompt === 'Book Appointment') {
                      setIsOpen(false);
                      onOpenBooking();
                    } else {
                      handleSendMessage(undefined, promptToQuery[prompt] || prompt);
                    }
                  }}
                  className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-teal-50 hover:text-[#2CB5A0] text-[11px] font-medium text-gray-600 shrink-0 transition-colors cursor-pointer border border-transparent hover:border-teal-200"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Direct Booking Shortcut Bar */}
            <div className="px-3 py-1.5 bg-teal-50/50 border-t border-teal-100 flex items-center justify-between text-xs">
              <span className="text-gray-600 font-medium text-[11px] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#2CB5A0]" /> Ready to relax?
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenBooking();
                }}
                className="text-[11px] font-bold text-[#2CB5A0] hover:underline cursor-pointer"
              >
                Book Online Now →
              </button>
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask about treatments, pricing, availability..."
                aria-label="Chat message"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2CB5A0] focus:ring-1 focus:ring-[#2CB5A0]"
              />
              <button
                type="submit"
                disabled={streaming || !inputPrompt.trim()}
                aria-label="Send message"
                className="p-2.5 rounded-xl bg-[#2CB5A0] text-white hover:bg-[#259b89] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
