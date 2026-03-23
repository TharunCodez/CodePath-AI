import React, { useState, useEffect } from 'react';
import { Sparkles, X, MessageSquare, HelpCircle, AlertTriangle } from 'lucide-react';
import { runCode } from '../services/api';
import { getAIExplanation, getAIErrorAnalysis, getAIHint } from '../services/gemini';

interface AIResponsePanelProps {
  code: string;
  language: string;
  error?: string;
  problem?: string;
  externalTrigger?: { type: 'explain' | 'analyze' | 'hint'; trigger: number } | null;
}

const AIResponsePanel: React.FC<AIResponsePanelProps> = ({ code, language, error, problem, externalTrigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  useEffect(() => {
    if (externalTrigger) {
      setIsOpen(true);
      handleAction(externalTrigger.type);
    }
  }, [externalTrigger]);

  const handleAction = async (action: 'explain' | 'analyze' | 'hint') => {
    setLoading(true);
    setActiveAction(action);
    setResponse(null);
    try {
      console.log(`[AI] Requesting /${action}-code`);
      let res;
      if (action === 'explain') {
        const explanation = await getAIExplanation(code, language);
        console.log(`[AI] explanation response:`, explanation);
        setResponse(explanation);
      } else if (action === 'analyze') {
        const analysis = await getAIErrorAnalysis(code, error || 'No error reported', problem || 'General coding', language);
        console.log(`[AI] analysis response:`, analysis);
        setResponse(analysis);
      } else if (action === 'hint') {
        const hint = await getAIHint(code, problem || 'General coding', language);
        console.log(`[AI] hint response:`, hint);
        setResponse(hint);
      }
    } catch (err: any) {
      console.error(`[AI] /${action} error:`, err);
      const errorMessage = err.response?.data?.error || err.message;
      setResponse(`AI failed to respond: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button className="ai-panel-trigger" onClick={() => setIsOpen(true)} style={{
        position: 'fixed',
        right: '2rem',
        bottom: '2rem',
        backgroundColor: 'var(--accent-primary)',
        color: 'var(--bg-primary)',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        zIndex: 1000
      }}>
        <Sparkles size={24} />
      </button>
    );
  }

  return (
    <div className="ai-panel">
      <div className="ai-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} color="var(--accent-primary)" />
          <span style={{ fontWeight: '600' }}>AI Assistant</span>
        </div>
        <button onClick={() => setIsOpen(false)} style={{ background: 'none', color: 'var(--text-secondary)' }}>
          <X size={20} />
        </button>
      </div>
      <div className="ai-content">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
            <div className="loading-spinner" style={{ width: '40px', height: '40px', borderTopColor: 'var(--accent-primary)' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Thinking...</p>
          </div>
        ) : response ? (
          <div className="markdown-body">
            <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>
              {activeAction === 'explain' ? 'Explanation' : activeAction === 'analyze' ? 'Error Analysis' : 'Hint'}
            </p>
            <div style={{ whiteSpace: 'pre-wrap' }}>{response}</div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p>How can I help you with your code today?</p>
          </div>
        )}
      </div>
      <div className="ai-actions">
        <button className="btn-ai" onClick={() => handleAction('explain')}>
          <MessageSquare size={14} style={{ marginRight: '4px' }} /> Explain Code
        </button>
        <button className="btn-ai" onClick={() => handleAction('hint')}>
          <HelpCircle size={14} style={{ marginRight: '4px' }} /> Get Hint
        </button>
        <button className="btn-ai" onClick={() => handleAction('analyze')} style={{ gridColumn: 'span 2', marginTop: '4px' }}>
          <AlertTriangle size={14} style={{ marginRight: '4px' }} /> Analyze Error
        </button>
      </div>
    </div>
  );
};

export default AIResponsePanel;
