import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, ArrowDown } from 'lucide-react';
import api from '../api/axios';
import type { ApiResponse } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Namaste! 🙏 I'm your **KalaSetu Business Helper**.

I can help you understand business terms and processes in simple language. Ask me about:

• **GST** — registration, filing, HSN codes for handicrafts
• **MSME / Udyam** — registration and benefits
• **Export docs** — IEC code, shipping bills, certificates
• **Pricing strategies** for handmade products
• **GI Tags** — Geographical Indication applications
• **Government schemes** — PM Vishwakarma, SFURTI, etc.
• **E-commerce** — Amazon Karigar, Flipkart Samarth
• **Finance** — Mudra loans, working capital

How can I help you today?`,
  timestamp: new Date(),
};

const QUICK_PROMPTS = [
  'How do I register for GST?',
  'What is MSME Udyam registration?',
  'How to price my handmade products?',
  'Tell me about PM Vishwakarma scheme',
];

export default function BusinessHelperPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Track scroll position to show/hide scroll-to-bottom button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Build history from messages (excluding welcome)
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          parts: m.content,
        }));

      const res = await api.post<ApiResponse<{ reply: string }>>('/chat', {
        message: text.trim(),
        history,
      });

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: res.data.data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: err.response?.data?.message || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const formatContent = (content: string) => {
    // Simple markdown-like rendering
    return content.split('\n').map((line, i) => {
      // Bold
      const boldRendered = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Bullet points
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div key={i} className="flex gap-2 ml-2 my-0.5">
            <span className="text-gold-500 mt-0.5 shrink-0">•</span>
            <span dangerouslySetInnerHTML={{ __html: boldRendered.replace(/^[•-]\s/, '') }} />
          </div>
        );
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="my-0.5" dangerouslySetInnerHTML={{ __html: boldRendered }} />;
    });
  };

  return (
    <div className="min-h-screen bg-earth-50 pt-24 pb-0 flex flex-col">
      {/* Header */}
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-earth-900">Business Helper</h1>
            <p className="text-earth-500 text-sm">AI-powered assistant for artisan business terms</p>
          </div>
        </motion.div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col container-custom max-w-4xl pb-4 min-h-0">
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4 scroll-smooth"
          style={{ maxHeight: 'calc(100vh - 280px)' }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-earth-800 text-earth-50 rounded-br-sm'
                      : 'bg-white border border-earth-100 text-earth-800 rounded-bl-sm'
                  }`}
                >
                  {formatContent(msg.content)}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-earth-200 flex items-center justify-center shrink-0 mt-1">
                    <User size={16} className="text-earth-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white border border-earth-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-earth-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-earth-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-earth-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom */}
        {showScrollBtn && (
          <div className="flex justify-center -mt-12 mb-2 relative z-10">
            <button
              onClick={scrollToBottom}
              className="bg-earth-800 text-white p-2 rounded-full shadow-lg hover:bg-earth-900 transition-colors"
            >
              <ArrowDown size={16} />
            </button>
          </div>
        )}

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={isTyping}
                className="px-4 py-2 text-sm bg-white border border-earth-200 rounded-full text-earth-700 hover:border-gold-500 hover:text-gold-600 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </motion.div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 items-center bg-white border border-earth-200 rounded-xl px-4 py-3 shadow-md"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about GST, MSME, pricing, exports..."
            disabled={isTyping}
            className="flex-1 bg-transparent outline-none text-sm text-earth-900 placeholder:text-earth-400 font-sans disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gold-500 text-white hover:bg-gold-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={16} />
          </button>
        </form>

        <p className="text-center text-earth-400 text-xs mt-2 mb-2">
          AI responses are for guidance only. Consult a professional for specific legal/tax advice.
        </p>
      </div>
    </div>
  );
}
