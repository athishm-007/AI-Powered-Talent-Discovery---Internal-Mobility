'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FeedbackButtons } from '@/components/features/FeedbackButtons';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: { title: string; url: string }[];
  timestamp: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'assistant',
      content: 'Hello Alex! I am your AI Mobility & Career Coach, grounded in your verified skill profile, target role requirements, and current company learning catalog. How can I assist your career progression today?',
      timestamp: '10:00 AM',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    'What skills should I prioritize to reach Principal Architect faster?',
    'Explain why my match score for AI Infrastructure Lead is 86%.',
    'Recommend top 3 courses for closing my Pgvector skill gap.',
    'How do my transferable Go/Kafka skills apply to Staff Engineer roles?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsStreaming(true);

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: `Based on your profile (Alex Chen, Senior Software Engineer) and target role requirements for Principal Systems Architect:\n\n1. **Priority Skill Gap**: Your highest leverage skill gap is **Vector Databases (Pgvector)**. Elevating this from L3 to L4 will increase your match score by +6%.\n2. **Recommended Path**: Enroll in the internal course *"Deep Dive: Vector Embeddings & Indexing with Pgvector"* (12 hours) and shadow the Cloud Architecture Committee.\n3. **Citations & Grounding**: Your recent Kafka Event Bus project already satisfies 95% of the distributed messaging requirements!`,
        citations: [
          { title: 'Profile: Alex Chen (Verified Skills)', url: '/profile' },
          { title: 'Role: Principal Systems Architect Req #104', url: '/opportunities/role-01' },
          { title: 'Course: Pgvector Indexing Masterclass', url: '/skill-gaps' },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsStreaming(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100">AI Mobility &amp; Career Assistant</h1>
            <p className="text-xs text-slate-400">
              Module 4: Grounded RAG conversational coach utilizing enterprise internal talent &amp; role documents.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <Card className="p-4 sm:p-6 border-slate-800 bg-slate-900/90 flex flex-col h-[600px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-400">
                  {msg.role === 'user' ? 'You' : 'AI Career Assistant'}
                </span>
                <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
              </div>

              <div
                className={`p-4 rounded-2xl max-w-2xl text-xs md:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none space-y-3'
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>

                {/* Grounded Citations Chips */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-3 border-t border-slate-800 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-purple-400 block tracking-wider">
                      Grounded Citations
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cit, idx) => (
                        <a
                          key={idx}
                          href={cit.url}
                          className="text-[11px] px-2.5 py-1 bg-slate-900 border border-slate-700/80 hover:border-purple-500 rounded-md text-slate-300 hover:text-white transition-colors"
                        >
                          📄 {cit.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback buttons for assistant responses */}
              {msg.role === 'assistant' && (
                <div className="mt-1.5">
                  <FeedbackButtons targetType="assistant_response" targetId={msg.id} />
                </div>
              )}
            </div>
          ))}

          {isStreaming && (
            <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-950/30 p-3 rounded-xl border border-purple-900/50 w-fit">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
              <span>AI Coach is synthesizing grounded response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions */}
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
          <span className="text-[11px] text-slate-500 font-medium">Suggested Questions:</span>
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="text-xs px-3 py-1.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors text-left"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-4 flex gap-3"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask your AI Career Coach anything about roles, skills, or mobility..."
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700/70 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button type="submit" variant="primary" size="md" disabled={isStreaming || !inputQuery.trim()}>
            Send Query
          </Button>
        </form>
      </Card>
    </div>
  );
}
