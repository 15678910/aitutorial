import { useState, useEffect, useRef, useCallback } from 'react'
import { getPyodide, loadedPackages } from '../../lib/pyodide'

export interface GuidedStep {
  title: string
  explanation: string
  code: string
  expectedOutput: string
}

export interface GuidedExampleData {
  sectionId: string
  title: string
  description: string
  steps: GuidedStep[]
  packages: string[]
}

interface GuidedExamplesProps {
  data: GuidedExampleData
}

export default function GuidedExamples({ data }: GuidedExamplesProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [runningStep, setRunningStep] = useState<number | null>(null)
  const [outputs, setOutputs] = useState<Record<number, string[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const pyodideRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false
    async function init() {
      setIsLoading(true)
      try {
        const pyodide = await getPyodide([])
        if (cancelled) return
        pyodideRef.current = pyodide

        if (data.packages.length > 0) {
          const newPkgs = data.packages.filter(p => !loadedPackages.has(p))
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
          setLoadError(`Python 환경을 불러올 수 없습니다. ${e.message || '네트워크를 확인해 주세요.'}`)
        }
      }
    }
    init()
    return () => { cancelled = true }
  }, [data.packages])

  const runStep = useCallback(async (stepIndex: number) => {
    if (!pyodideRef.current || runningStep !== null) return
    setRunningStep(stepIndex)

    const pyodide = pyodideRef.current
    const step = data.steps[stepIndex]

    try {
      pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('실행 시간 초과 (10초)')), 10000)
      })
      const execPromise = (async () => {
        await pyodide.runPythonAsync(step.code)
        const stdout = pyodide.runPython('sys.stdout.getvalue()')
        return stdout
      })()

      const stdout = await Promise.race([execPromise, timeoutPromise])
      const lines = stdout && stdout.trim() ? stdout.trim().split('\n') : ['(출력 없음)']

      setOutputs(prev => ({ ...prev, [stepIndex]: lines }))
      setCompletedSteps(prev => {
        const next = new Set(prev)
        next.add(stepIndex)
        return next
      })
    } catch (e: any) {
      const errMsg = e.message || String(e)
      const lines = errMsg.split('\n')
      setOutputs(prev => ({ ...prev, [stepIndex]: [`오류: ${lines[lines.length - 1]}`] }))
    } finally {
      setRunningStep(null)
    }
  }, [data.steps, runningStep])

  const allCompleted = completedSteps.size === data.steps.length

  return (
    <div className="mt-12 border-t border-gray-200 pt-12">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-2xl">📖</span>
        <h2 className="text-xl font-bold text-gray-900">따라하며 배워요</h2>
      </div>

      <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
        {/* Description */}
        <p className="text-sm text-amber-800 mb-6 leading-relaxed">
          {data.description}
        </p>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-8">
            <svg className="animate-spin w-5 h-5 text-amber-500" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
            <span className="text-amber-700 text-sm font-medium">Python 환경 준비 중...</span>
          </div>
        )}

        {/* Error State */}
        {loadError && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="text-3xl">⚠️</span>
            <p className="text-sm text-red-700 font-medium">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-100 text-red-700 text-sm font-bold rounded-lg hover:bg-red-200 transition-colors"
            >
              페이지 새로고침
            </button>
          </div>
        )}

        {/* Steps */}
        {!isLoading && !loadError && (
          <div className="space-y-1">
            {data.steps.map((step, idx) => {
              const isCompleted = completedSteps.has(idx)
              const isRunning = runningStep === idx
              const hasOutput = outputs[idx] !== undefined

              return (
                <div key={idx} className="relative pl-10">
                  {/* Timeline line */}
                  {idx < data.steps.length - 1 && (
                    <div className={`absolute left-[15px] top-10 w-0.5 h-[calc(100%-8px)] ${isCompleted ? 'bg-green-300' : 'bg-amber-200'}`} />
                  )}

                  {/* Step number circle */}
                  <div className={`absolute left-0 top-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isCompleted ? 'bg-green-500 text-white' : 'bg-amber-400 text-white'
                  }`}>
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </div>

                  {/* Step card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
                    {/* Step title */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
                    </div>

                    {/* Explanation */}
                    <div className="px-4 py-3 bg-blue-50/50 text-sm text-gray-700 leading-relaxed">
                      {step.explanation}
                    </div>

                    {/* Code block */}
                    <div className="bg-gray-900 p-4 font-mono text-sm text-green-400 leading-relaxed overflow-x-auto">
                      <pre className="whitespace-pre-wrap">{step.code}</pre>
                    </div>

                    {/* Run button */}
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => runStep(idx)}
                        disabled={isRunning || !isReady || runningStep !== null}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 ${
                          isCompleted
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50'
                        }`}
                      >
                        {isRunning ? (
                          <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
                              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                            </svg>
                            실행 중...
                          </>
                        ) : isCompleted ? (
                          <>✅ 다시 실행</>
                        ) : (
                          <>▶ 실행해보기</>
                        )}
                      </button>
                      {isCompleted && (
                        <span className="text-xs text-green-600 font-medium">완료!</span>
                      )}
                    </div>

                    {/* Output */}
                    {hasOutput && (
                      <div className="border-t border-gray-200">
                        <div className="px-4 py-1.5 bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          ✅ 출력 결과
                        </div>
                        <div className="p-3 bg-gray-900 font-mono text-sm max-h-[150px] overflow-y-auto">
                          {outputs[idx].map((line, li) => (
                            <div key={li} className={`leading-relaxed ${line.startsWith('오류:') ? 'text-red-400' : 'text-gray-300'}`}>
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* All completed message */}
        {allCompleted && (
          <div className="mt-4 bg-green-100 border-2 border-green-300 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🎉</div>
            <p className="font-bold text-green-800 text-sm">
              모든 단계를 완료했어요! 이제 아래에서 직접 도전해보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
