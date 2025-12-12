import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ exerciseId, initialCode, expectedOutput, hint }) {
  const storageKey = exerciseId ? `code-editor-${exerciseId}` : null;
  
  // Load saved code from localStorage on mount
  const loadSavedCode = () => {
    if (!storageKey) return initialCode || '// Write your code here\n';
    
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return saved;
      }
    } catch (e) {
      console.error('Failed to load saved code:', e);
    }
    return initialCode || '// Write your code here\n';
  };

  const [code, setCode] = useState(loadSavedCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const editorRef = useRef(null);

  // Save code to localStorage whenever it changes
  useEffect(() => {
    if (storageKey && code) {
      try {
        localStorage.setItem(storageKey, code);
      } catch (e) {
        console.error('Failed to save code:', e);
      }
    }
  }, [code, storageKey]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput('');
    
    // Create a sandbox to run the code
    const logs = [];
    const originalConsoleLog = console.log;
    
    // Override console.log to capture output
    console.log = (...args) => {
      logs.push(args.map(arg => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg, null, 2);
        }
        return String(arg);
      }).join(' '));
    };

    try {
      // Create a function from the code and execute it
      const func = new Function(code);
      const result = func();
      
      // If there's a return value, add it to output
      if (result !== undefined) {
        logs.push(`Return value: ${JSON.stringify(result, null, 2)}`);
      }
      
      setOutput(logs.join('\n') || 'Code executed successfully (no output)');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      // Restore original console.log
      console.log = originalConsoleLog;
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    const resetValue = initialCode || '// Write your code here\n';
    setCode(resetValue);
    setOutput('');
    
    // Clear saved code on reset
    if (storageKey) {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        console.error('Failed to clear saved code:', e);
      }
    }
  };

  const checkResult = () => {
    if (!expectedOutput) return null;
    
    const outputLines = output.trim().split('\n');
    const expectedLines = expectedOutput.trim().split('\n');
    
    const isCorrect = outputLines.every((line, i) => 
      line.trim() === expectedLines[i]?.trim()
    ) && outputLines.length === expectedLines.length;
    
    return isCorrect;
  };

  const result = output ? checkResult() : null;

  return (
    <div className="code-editor-container">
      <div className="editor-toolbar">
        <button 
          onClick={runCode} 
          disabled={isRunning}
          className="btn-run"
        >
          {isRunning ? '⏳ Running...' : '▶ Run Code'}
        </button>
        <button onClick={resetCode} className="btn-reset">
          ↺ Reset
        </button>
        {hint && (
          <button 
            onClick={() => setShowHint(!showHint)} 
            className="btn-hint"
          >
            💡 {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        )}
      </div>

      {showHint && hint && (
        <div className="hint-box">
          <strong>Hint:</strong> {hint}
        </div>
      )}

      <div className="editor-wrapper">
        <Editor
          height="300px"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>

      <div className="output-section">
        <div className="output-header">
          <span>Output</span>
          {result !== null && (
            <span className={`result-badge ${result ? 'success' : 'error'}`}>
              {result ? '✓ Correct!' : '✗ Try again'}
            </span>
          )}
        </div>
        <pre className="output-content">
          {output || 'Click "Run Code" to see output'}
        </pre>
        {expectedOutput && (
          <div className="expected-output">
            <strong>Expected output:</strong>
            <pre>{expectedOutput}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeEditor;


