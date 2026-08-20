import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Bot, Calendar, RotateCcw } from 'lucide-react';
import Markdown from 'react-markdown';
import { api } from '../../services/api';
import { Service, Therapist } from '../../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

interface SpaAssistantChatProps {
  onOpenBooking: () => void;
  services?: Service[];
  therapists?: Therapist[];
}

export const SpaAssistantChat: React.FC<SpaAssistantChatProps> = ({ onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Welcome to **Aura Luxe Spa**! I am your AI Spa Concierge.\n\nHow may I assist you today?\n• **Services & Rates**: Learn about Swedish, Deep Tissue, Hot Stone, & VIP packages\n• **Health Protocols**: Sanitation, intake screening, & contraindication care\n• **Bookings**: Select therapists, apply discount codes, and reserve slots!'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const queryText = customText || inputPrompt;
    if (!queryText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!customText) setInputPrompt('');
    setLoading(true);

    try {
      const response = await api.sendAiChat(queryText, newMessages);
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: response.reply
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ast-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Our **Swedish Relaxation (₹140)** and **Deep Tissue Recovery (₹180)** are top recommendations! You can book anytime using the **Book Appointment** button.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Chat history cleared. How else may I assist your wellness experience today?'
      }
    ]);
  };

  const quickPrompts = [
    "Services & Pricing",
    "Health & Safety Protocols",
    "Deep Tissue vs Swedish",
    "First-Time Client FAQ",
    "Book Appointment"
  ];

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
          <span className="hidden sm:inline">Aura AI Spa Assistant</span>
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
            aria-label="Aura Spa Concierge chat"
          >
            {/* Header */}
            <div className="bg-[#1A1A1A] text-white p-4 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2CB5A0] flex items-center justify-center text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm tracking-wide flex items-center gap-1.5">
                    Aura Spa Concierge <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </h3>
                  <p className="text-[10px] text-teal-300">Powered by Gemini AI Intelligence</p>
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
                  onClick={() => setIsOpen(false)}
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
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2 items-center text-xs text-teal-700 bg-teal-50/80 p-3 rounded-2xl border border-teal-100 max-w-[80%]">
                  <Bot className="w-4 h-4 text-[#2CB5A0] animate-bounce shrink-0" />
                  <span className="font-medium">Aura AI is evaluating spa protocols...</span>
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
                    if (prompt === "Book Appointment") {
                      setIsOpen(false);
                      onOpenBooking();
                    } else {
                      handleSendMessage(undefined, prompt);
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
                placeholder="Ask about treatments, pricing, health safety..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2CB5A0] focus:ring-1 focus:ring-[#2CB5A0]"
              />
              <button
                type="submit"
                disabled={loading || !inputPrompt.trim()}
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
