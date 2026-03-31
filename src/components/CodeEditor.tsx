import { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { autocompletion } from '@codemirror/autocomplete';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';

interface CodeEditorProps {
  language: string;
  code: string;
  setCode: (code: string) => void;
}

function getLanguageExtension(language: string) {
  switch (language.toLowerCase()) {
    case 'python':
      return python();
    case 'java':
      return java();
    case 'cpp':
    case 'c':
    case 'c++':
      return cpp();
    default:
      return python();
  }
}

export default function CodeEditor({ language, code, setCode }: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  // Track the latest setCode without recreating the editor on every render
  const setCodeRef = useRef(setCode);
  setCodeRef.current = setCode;

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy any existing instance to avoid duplicates / frozen editors
    if (viewRef.current) {
      viewRef.current.destroy();
      viewRef.current = null;
    }

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        setCodeRef.current(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        getLanguageExtension(language),
        oneDark,
        autocompletion(),
        updateListener,
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14px',
          },
          '.cm-scroller': {
            overflow: 'auto',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            // Touch scroll fix — natural momentum scroll on iOS/Android
            WebkitOverflowScrolling: 'touch' as any,
          },
          '.cm-content': {
            padding: '16px 0',
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    // Cleanup on unmount or language change
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Re-create editor when language changes; intentionally exclude `code`
    // so fast typing doesn't trigger a full re-mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Sync external code changes (e.g. "Try this example") without remounting
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (currentDoc !== code) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: code },
      });
    }
  }, [code]);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    />
  );
}
