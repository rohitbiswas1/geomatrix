'use client';

import {FormEvent, useState} from 'react';
import {usePathname} from 'next/navigation';
import {Bot, MessageCircle, Send, X} from 'lucide-react';

type Message = {role: 'user' | 'assistant' | 'error'; text: string};

export function ProjectAssistant({projectId: providedProjectId}: {projectId?: string}) {
  const pathname = usePathname();
  const projectId = providedProjectId || pathname.match(/^\/projects\/([^/]+)$/)?.[1] || 'p1';
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function ask(event: FormEvent) {
    event.preventDefault();
    const value = question.trim();
    if (!value || loading) return;
    setLoading(true);
    setQuestion('');
    setMessages((current) => [...current, {role: 'user', text: value}]);
    try {
      const response = await fetch('/api/projects/' + projectId + '/assistant', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question: value}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to get an answer.');
      setMessages((current) => [...current, {role: 'assistant', text: data.answer}]);
    } catch (exception) {
      setMessages((current) => [
        ...current,
        {role: 'error', text: exception instanceof Error ? exception.message : 'Unable to get an answer.'},
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (pathname === '/login') return null;
  const contextLabel = pathname.match(/^\/projects\/([^/]+)$/)
    ? "Grounded in this project's available data"
    : 'Ask about the current project portfolio';

  if (!open)
    return (
      <button
        className="btn primary"
        onClick={() => setOpen(true)}
        aria-label="Open Geomatrix AI Assistant"
        title="Open Geomatrix AI Assistant"
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          zIndex: 50,
          borderRadius: 999,
          padding: '12px 18px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
        }}
      >
        <MessageCircle size={17} /> AI Assistant
      </button>
    );

  return (
    <section
      className="panel"
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        width: 'min(440px, calc(100vw - 32px))',
        height: 'min(600px, calc(100vh - 48px))',
        zIndex: 50,
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="panelhead">
        <div>
          <div className="paneltitle">
            <Bot size={16} /> Geomatrix AI Assistant
          </div>
          <div className="muted">{contextLabel}</div>
        </div>
        <button
          className="btn"
          onClick={() => setOpen(false)}
          aria-label="Close Geomatrix AI Assistant"
          title="Close assistant"
          style={{padding: 6}}
        >
          <X size={15} />
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 0',
          display: 'grid',
          alignContent: 'start',
          gap: 10,
        }}
      >
        {messages.length === 0 && (
          <div className="demo">
            Ask about risk, bottlenecks, legal issues, compensation, approvals, or recommended next actions.
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              justifySelf: message.role === 'user' ? 'end' : 'start',
              maxWidth: '88%',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.55,
              fontSize: 13,
              padding: '10px 14px',
              borderRadius:
                message.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
              background:
                message.role === 'user'
                  ? 'var(--blue)'
                  : message.role === 'error'
                  ? 'var(--demo-bg)'
                  : 'var(--panel-subtle)',
              border:
                message.role === 'user'
                  ? 'none'
                  : message.role === 'error'
                  ? '1px solid var(--demo-border)'
                  : '1px solid var(--line)',
              color:
                message.role === 'user'
                  ? '#ffffff'
                  : message.role === 'error'
                  ? 'var(--demo-color)'
                  : 'var(--ink)',
            }}
          >
            {message.text}
          </div>
        ))}
        {loading && (
          <div className="muted" style={{fontSize: 12}}>
            Analyzing available project data...
          </div>
        )}
      </div>

      <form
        onSubmit={ask}
        style={{
          display: 'flex',
          gap: 8,
          borderTop: '1px solid var(--line)',
          paddingTop: 12,
        }}
      >
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask Geomatrix..."
          aria-label="Ask Geomatrix AI Assistant"
          style={{flex: 1}}
        />
        <button
          className="btn primary"
          type="submit"
          disabled={loading || !question.trim()}
          aria-label="Send message"
          title="Send message"
        >
          <Send size={14} />
        </button>
      </form>
    </section>
  );
}
