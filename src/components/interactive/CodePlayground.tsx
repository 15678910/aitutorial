import { useState, useRef, useCallback } from 'react'

interface CodePlaygroundProps {
  initialCode?: string
  expectedOutput?: string
  hint?: string
  title?: string
  description?: string
}

export default function CodePlayground({
  initialCode = '// 여기에 코드를 작성하세요\nconsole.log("Hello, AI!");',
  expectedOutput,
  hint,
  title = '코드 실습',
  description,
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showHint, setShowHint] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const runCode = useCallback(() => {
    setIsRunning(true)
    setOutput([])
    setIsCorrect(null)

    // Create sandboxed iframe for safe code execution
    const iframe = document.createElement('iframe')
    iframe.sandbox.add('allow-scripts')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    const logs: string[] = []
    const timeoutMs = 3000

    // Listen for messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'console') {
        logs.push(event.data.value)
      } else if (event.data?.type === 'error') {
        logs.push(`오류: ${event.data.value}`)
      } else if (event.data?.type === 'done') {
        cleanup()
        setOutput(logs.length > 0 ? logs : ['(출력 없음)'])
        if (expectedOutput) {
          const actualOutput = logs.filter(l => !l.startsWith('오류:')).join('\n').trim()
          setIsCorrect(actualOutput === expectedOutput.trim())
        }
        setIsRunning(false)
      }
    }

    const cleanup = () => {
      window.removeEventListener('message', handleMessage)
      clearTimeout(timer)
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe)
      }
    }

    // Timeout protection
    const timer = setTimeout(() => {
      cleanup()
      setOutput(['오류: 실행 시간 초과 (3초). 무한 루프가 없는지 확인하세요.'])
      setIsCorrect(false)
      setIsRunning(false)
    }, timeoutMs)

    window.addEventListener('message', handleMessage)

    // Inject code into iframe
    const html = `<!DOCTYPE html><html><body><script>
      const _logs = [];
      const _origLog = console.log;
      const _capture = (...args) => {
        const val = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
        parent.postMessage({ type: 'console', value: val }, '*');
      };
      console.log = _capture;
      console.error = _capture;
      console.warn = _capture;
      try {
        ${code}
        parent.postMessage({ type: 'done' }, '*');
      } catch(e) {
        parent.postMessage({ type: 'error', value: e.message }, '*');
        parent.postMessage({ type: 'done' }, '*');
      }
    <\/script></body></html>`

    const blob = new Blob([html], { type: 'text/html' })
    iframe.src = URL.createObjectURL(blob)
  }, [code, expectedOutput])

  const resetCode = () => {
    setCode(initialCode)
    setOutput([])
    setIsCorrect(null)
    setShowHint(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newCode = code.substring(0, start) + '  ' + code.substring(end)
      setCode(newCode)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
    // Ctrl/Cmd + Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      runCode()
    }
  }

  return (
    <div className="my-8 rounded-xl border-2 border-gray-200 overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-sm font-mono text-gray-300">{title}</span>
        </div>
        <span className="text-xs text-gray-500">JavaScript</span>
      </div>

      {/* Description */}
      {description && (
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 text-sm text-blue-800">
          {description}
        </div>
      )}

      {/* Code Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-4 font-mono text-sm bg-gray-950 text-green-400 resize-none focus:outline-none min-h-[160px] leading-relaxed"
          spellCheck={false}
          placeholder="// 코드를 입력하세요..."
        />
        <div className="absolute top-2 right-2 text-xs text-gray-600">
          Ctrl+Enter로 실행
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-t border-gray-200">
        <button
          onClick={runCode}
          disabled={isRunning}
          className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/></svg>
              실행 중...
            </>
          ) : (
            <>▶ 실행</>
          )}
        </button>
        <button
          onClick={resetCode}
          className="px-4 py-2 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          초기화
        </button>
        {hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-4 py-2 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors ml-auto"
          >
            {showHint ? '힌트 숨기기' : '💡 힌트'}
          </button>
        )}
      </div>

      {/* Hint */}
      {showHint && hint && (
        <div className="px-4 py-3 bg-yellow-50 border-t border-yellow-100 text-sm text-yellow-800">
          💡 {hint}
        </div>
      )}

      {/* Output */}
      {output.length > 0 && (
        <div className="border-t-2 border-gray-200">
          <div className="px-4 py-2 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
            <span>출력 결과</span>
            {isCorrect !== null && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isCorrect ? '✓ 정답!' : '✗ 다시 시도해보세요'}
              </span>
            )}
          </div>
          <div className="p-4 bg-gray-950 font-mono text-sm min-h-[60px] max-h-[200px] overflow-y-auto">
            {output.map((line, i) => (
              <div key={i} className={`${line.startsWith('오류:') ? 'text-red-400' : 'text-gray-300'} leading-relaxed`}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expected Output */}
      {expectedOutput && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
          기대 출력: <code className="bg-gray-200 px-1.5 py-0.5 rounded text-gray-700">{expectedOutput}</code>
        </div>
      )}
    </div>
  )
}
