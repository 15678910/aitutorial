import { useState, useRef, useCallback, useEffect } from 'react'
import { getPyodide, loadedPackages } from '../../lib/pyodide'

interface PythonPlaygroundProps {
  initialCode?: string
  expectedOutput?: string
  hint?: string
  title?: string
  description?: string
  packages?: string[]
}

export default function PythonPlayground({
  initialCode = '# 여기에 코드를 작성하세요\nprint("Hello, Python!")',
  expectedOutput,
  hint,
  title = 'Python 실습',
  description,
  packages = [],
}: PythonPlaygroundProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [isReady, setIsReady] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showHint, setShowHint] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pyodideRef = useRef<any>(null)

  // Pyodide 초기화 (컴포넌트 마운트 시)
  useEffect(() => {
    let cancelled = false

    async function init() {
      setIsLoading(true)
      setLoadingMessage('Python 환경 준비 중...')
      try {
        const pyodide = await getPyodide([])
        if (cancelled) return
        pyodideRef.current = pyodide

        if (packages.length > 0) {
          setLoadingMessage(`패키지 로딩 중 (${packages.join(', ')})...`)
          const newPkgs = packages.filter(p => !loadedPackages.has(p))
          if (newPkgs.length > 0) {
            await pyodide.loadPackage(newPkgs)
            newPkgs.forEach(p => loadedPackages.add(p))
          }
        }

        if (!cancelled) {
          setIsReady(true)
          setIsLoading(false)
        }
      } catch (e: any) {
        if (!cancelled) {
          setIsLoading(false)
          setOutput([`오류: Python 환경을 로드할 수 없습니다. ${e.message}`])
        }
      }
    }

    init()
    return () => { cancelled = true }
  }, [packages])

  const runCode = useCallback(async () => {
    if (!pyodideRef.current || isRunning) return

    setIsRunning(true)
    setOutput([])
    setIsCorrect(null)

    const pyodide = pyodideRef.current

    try {
      // stdout/stderr 캡쳐 설정
      pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`)

      // 타임아웃 보호 (10초)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('실행 시간 초과 (10초)')), 10000)
      })

      const execPromise = (async () => {
        await pyodide.runPythonAsync(code)
        const stdout = pyodide.runPython('sys.stdout.getvalue()')
        const stderr = pyodide.runPython('sys.stderr.getvalue()')
        return { stdout, stderr }
      })()

      const { stdout, stderr } = await Promise.race([execPromise, timeoutPromise])

      const lines: string[] = []
      if (stdout && stdout.trim()) {
        lines.push(...stdout.trim().split('\n'))
      }
      if (stderr && stderr.trim()) {
        lines.push(...stderr.trim().split('\n').map((l: string) => `경고: ${l}`))
      }
      if (lines.length === 0) {
        lines.push('(출력 없음)')
      }

      setOutput(lines)

      // 정답 판정
      if (expectedOutput) {
        const actual = lines.filter(l => !l.startsWith('경고:')).join('\n').trim()
        setIsCorrect(actual === expectedOutput.trim())
      }
    } catch (e: any) {
      const errMsg = e.message || String(e)
      // Python 에러에서 핵심 메시지만 추출
      const lines = errMsg.split('\n')
      const lastLine = lines[lines.length - 1] || errMsg
      setOutput([`오류: ${lastLine}`])
      if (expectedOutput) setIsCorrect(false)
    } finally {
      setIsRunning(false)
    }
  }, [code, expectedOutput, isRunning])

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
      const newCode = code.substring(0, start) + '    ' + code.substring(end)
      setCode(newCode)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4
        }
      }, 0)
    }
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
        <span className="text-xs text-yellow-400 font-medium">Python</span>
      </div>

      {/* Description */}
      {description && (
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 text-sm text-blue-800">
          {description}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="px-4 py-8 flex flex-col items-center gap-3 bg-gray-950">
          <div className="flex items-center gap-3">
            <svg className="animate-spin w-5 h-5 text-yellow-400" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
            <span className="text-gray-300 text-sm">{loadingMessage}</span>
          </div>
          <div className="w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      )}

      {/* Code Editor */}
      {!isLoading && (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-4 font-mono text-sm bg-gray-950 text-green-400 resize-none focus:outline-none min-h-[180px] leading-relaxed"
            spellCheck={false}
            placeholder="# Python 코드를 입력하세요..."
            disabled={!isReady}
          />
          <div className="absolute top-2 right-2 text-xs text-gray-600">
            Ctrl+Enter로 실행
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!isLoading && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-t border-gray-200">
          <button
            onClick={runCode}
            disabled={isRunning || !isReady}
            className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
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
              {showHint ? '힌트 숨기기' : '힌트'}
            </button>
          )}
        </div>
      )}

      {/* Hint */}
      {showHint && hint && (
        <div className="px-4 py-3 bg-yellow-50 border-t border-yellow-100 text-sm text-yellow-800">
          {hint}
        </div>
      )}

      {/* Output */}
      {output.length > 0 && (
        <div className="border-t-2 border-gray-200">
          <div className="px-4 py-2 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
            <span>출력 결과</span>
            {isCorrect !== null && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isCorrect ? '정답!' : '다시 시도해보세요'}
              </span>
            )}
          </div>
          <div className="p-4 bg-gray-950 font-mono text-sm min-h-[60px] max-h-[200px] overflow-y-auto">
            {output.map((line, i) => (
              <div key={i} className={`${line.startsWith('오류:') ? 'text-red-400' : line.startsWith('경고:') ? 'text-yellow-400' : 'text-gray-300'} leading-relaxed`}>
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
