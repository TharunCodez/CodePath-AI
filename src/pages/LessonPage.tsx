import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, Terminal as TerminalIcon, CheckCircle2, Lightbulb, MessageSquare, AlertTriangle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AIResponsePanel from '../components/AIResponsePanel';
import { runCode } from '../services/api';
import data from '../data.json';
import { Data } from '../types';

const typedData = data as Data;

interface LessonPageProps {
  sidebarOpen?: boolean;
}

const LessonPage: React.FC<LessonPageProps> = ({ sidebarOpen }) => {
  const { roleId, lessonId } = useParams<{ roleId: string; lessonId: string }>();
  const role = typedData.roles.find(r => r.id === roleId);
  
  if (!role) return <Navigate to="/" />;

  let currentLesson = null;
  for (const skill of role.skills) {
    for (const chapter of skill.chapters) {
      const lesson = chapter.lessons.find(l => l.id === lessonId);
      if (lesson) {
        currentLesson = lesson;
        break;
      }
    }
    if (currentLesson) break;
  }

  if (!currentLesson) return <Navigate to={`/role/${roleId}`} />;

  const [code, setCode] = useState(currentLesson.practice.starter_code);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [aiAction, setAiAction] = useState<{ type: 'explain' | 'analyze' | 'hint'; trigger: number } | null>(null);
  
  // Resizing logic
  const [outputHeight, setOutputHeight] = useState(250);
  const isResizing = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCode(currentLesson.practice.starter_code);
    setOutput('');
    setError(undefined);
    setAiAction(null);
  }, [lessonId, currentLesson.practice.starter_code]);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    setError(undefined);
    try {
      console.log('[API] Requesting /run-code');
      const result = await runCode(code, role.language_id);
      console.log('[API] /run-code response:', result);
      
      let finalOutput = '';
      if (result.stdout) {
        finalOutput = result.stdout;
      } else if (result.stderr) {
        finalOutput = result.stderr;
      } else if (result.compile_output) {
        finalOutput = result.compile_output;
      }
      
      setOutput(finalOutput || 'No output');
      
      if (result.status?.id !== 3 && !result.stdout) {
        setError(finalOutput || 'Execution failed');
        setAiAction({ type: 'analyze', trigger: Date.now() });
      }
    } catch (err: any) {
      console.error('[API] /run-code error:', err);
      const errorMessage = err.response?.data?.error || err.message;
      setOutput(`Error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const triggerAI = (type: 'explain' | 'analyze' | 'hint') => {
    setAiAction({ type, trigger: Date.now() });
  };

  // Mouse/Touch events for resizing
  const startResizing = (e: React.MouseEvent | React.TouchEvent) => {
    isResizing.current = true;
    if ('touches' in e) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', stopResizing);
    } else {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopResizing);
    }
    document.body.style.cursor = 'row-resize';
    console.log('[Resizer] Started resizing');
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', stopResizing);
    document.body.style.cursor = 'default';
    console.log('[Resizer] Stopped resizing');
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newOutputHeight = containerRect.bottom - e.clientY;
    
    updateHeight(newOutputHeight, containerRect.height);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isResizing.current || !containerRef.current) return;
    
    // Prevent scrolling while resizing
    e.preventDefault();
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const newOutputHeight = containerRect.bottom - touch.clientY;
    
    updateHeight(newOutputHeight, containerRect.height);
  };

  const updateHeight = (height: number, containerHeight: number) => {
    // Constraints: min 100px, max 80% of container
    const minHeight = 100;
    const maxHeight = containerHeight * 0.8;
    
    if (height > minHeight && height < maxHeight) {
      setOutputHeight(height);
      console.log(`[Resizer] Output height updated: ${height}px`);
    }
  };

  return (
    <div className="roadmap-page">
      <Sidebar role={role} isOpen={sidebarOpen} />
      <main className="main-content lesson-main">
        {/* Left: Lesson Content */}
        <div className="lesson-scroll-panel">
          <div className="lesson-header">
            <h1 className="lesson-title">{currentLesson.title}</h1>
            <p className="lesson-explanation">{currentLesson.explanation}</p>
          </div>

          {currentLesson.keyPoints && currentLesson.keyPoints.length > 0 && (
            <div className="key-points-container">
              <h2 className="key-points-title">
                <CheckCircle2 size={20} color="var(--success)" /> Key Points
              </h2>
              <ul className="key-points-list">
                {currentLesson.keyPoints.map((point, i) => (
                  <li key={i} className="key-point-item">
                    <span className="bullet">•</span> {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="examples-section">
            <h2 className="section-title">Examples</h2>
            {currentLesson.examples.map((example, index) => (
              <div key={index} className="example-item">
                <h3 className="example-title">{example.title}</h3>
                <div className="code-block-example">
                  <pre><code>{example.code}</code></pre>
                </div>
                <p className="example-explanation">
                  <strong>Explanation:</strong> {example.explanation}
                </p>
                <button 
                  className="btn-ai-small" 
                  onClick={() => setCode(example.code)}
                >
                  Try this example
                </button>
              </div>
            ))}
          </div>

          <div className="practice-section">
            <h2 className="section-title">
              <Lightbulb size={20} color="var(--warning)" /> Practice
            </h2>
            <div className="practice-box">
              <p className="practice-problem">{currentLesson.practice.problem}</p>
              <div className="expected-output-container">
                <p className="expected-output-label">Expected Output:</p>
                <pre className="expected-output-code">{currentLesson.practice.expected_output}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editor + Output */}
        <div className="editor-section" ref={containerRef}>
          <div className="editor-panel">
            <div className="editor-header">
              <div className="editor-title-container">
                <TerminalIcon size={18} color="var(--accent-primary)" />
                <span className="editor-title">Playground ({role.id})</span>
              </div>
              <div className="editor-actions">
                <button className="btn-ai-small" onClick={() => triggerAI('explain')} title="Explain Code">
                  <MessageSquare size={14} /> Explain
                </button>
                <button className="btn-ai-small" onClick={() => triggerAI('hint')} title="Get Hint">
                  <Lightbulb size={14} /> Hint
                </button>
                <button className="btn-run" onClick={handleRun} disabled={isRunning}>
                  {isRunning ? <div className="loading-spinner" /> : <Play size={14} />}
                  Run
                </button>
              </div>
            </div>
            <div className="monaco-container">
              <Editor
                height="100%"
                language={role.id === 'cpp' ? 'cpp' : role.id}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16 }
                }}
              />
            </div>
          </div>

          {/* Resizer */}
          <div className="resizer-v" onMouseDown={startResizing} onTouchStart={startResizing} />

          <div className="output-panel" style={{ height: `${outputHeight}px` }}>
            <div className="output-header">
              <span>Output Console</span>
              {error && (
                <button 
                  onClick={() => triggerAI('analyze')}
                  className="btn-analyze-error"
                >
                  <AlertTriangle size={12} /> Analyze Error
                </button>
              )}
            </div>
            <div className="output-content" style={{ color: error ? 'var(--error)' : '#a5f3fc' }}>
              {output || 'Run your code to see output here...'}
            </div>
          </div>
        </div>
      </main>

      <AIResponsePanel 
        code={code} 
        language={role.name} 
        error={error} 
        problem={currentLesson.practice.problem}
        externalTrigger={aiAction}
      />
    </div>
  );
};

export default LessonPage;
