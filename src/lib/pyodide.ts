// Shared Pyodide singleton - used by PythonPlayground and GuidedExamples
let pyodidePromise: Promise<any> | null = null
const loadedPackages = new Set<string>()

export async function getPyodide(packages: string[] = []) {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js'
      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Pyodide 로드 실패'))
        document.head.appendChild(script)
      })
      const pyodide = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/',
      })
      return pyodide
    })()
  }
  const pyodide = await pyodidePromise
  const newPackages = packages.filter(p => !loadedPackages.has(p))
  if (newPackages.length > 0) {
    await pyodide.loadPackage(newPackages)
    newPackages.forEach(p => loadedPackages.add(p))
  }
  return pyodide
}

export { loadedPackages }
