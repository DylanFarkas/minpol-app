import { useMemo, useState } from "react";
import { Puzzle } from "lucide-react";
import { previewTxt, solveTxt } from "./api/api";
import UploadPanel from "./components/UploadPanel";
import InputPreview from "./components/InputPreview";
import ResultView from "./components/ResultView";
import Card from "./components/Card";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(null);
  const [solve, setSolve] = useState(null);

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingSolve, setLoadingSolve] = useState(false);

  const [error, setError] = useState("");

  const canRun = useMemo(() => !!file && !!preview?.parsed && !loadingSolve, [file, preview, loadingSolve]);

  async function handlePickFile(f) {
    setError("");
    setSolve(null);
    setPreview(null);
    setFile(f);

    if (!f) return;
    setLoadingPreview(true);
    try {
      const data = await previewTxt(f);
      setPreview(data);
    } catch (e) {
      setError(e.message || "Error cargando preview");
    } finally {
      setLoadingPreview(false);
    }
  }

  async function handleRun() {
    if (!file) return;
    setError("");
    setSolve(null);
    setLoadingSolve(true);
    try {
      const data = await solveTxt(file);
      setSolve(data);
    } catch (e) {
      setError(e.message || "Error ejecutando");
    } finally {
      setLoadingSolve(false);
    }
  }

  function clearAll() {
    setFile(null);
    setPreview(null);
    setSolve(null);
    setError("");
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-gray-950 dark:text-slate-100">
      {/* fondo sutil */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-950" />
        <div className="absolute left-1/2 -top-60 h-130 w-205 -translate-x-1/2 rounded-full bg-slate-200/40 blur-3xl dark:bg-white/5" />
      </div>

      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-gray-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-900">
                <span className="text-lg"> <Puzzle /> </span>
              </div>
              <h1 className="truncate text-lg font-bold text-slate-900 dark:text-slate-100">
                MinPol <span className="text-slate-400">—</span> Interfaz de Pruebas
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Sube un .txt, valida entrada, ejecuta MiniZinc y visualiza matrices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRun}
              disabled={!canRun}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/40 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-950 dark:hover:bg-slate-200 dark:focus:ring-white/20 cursor-pointer"
            >
              {loadingSolve ? "Ejecutando..." : "Ejecutar"}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <UploadPanel file={file} onPickFile={handlePickFile} onClear={clearAll} isLoading={loadingPreview || loadingSolve} />

        {error && (
          <Card title="Ups. Algo explotó">
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          </Card>
        )}

        {loadingPreview && (
          <Card title="Leyendo archivo..." subtitle="Validando formato y consistencia (p vs s, sum(p)=n, etc.).">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-slate-900 dark:bg-white" />
            </div>
          </Card>
        )}

        <InputPreview rawText={preview?.raw_text} parsed={preview?.parsed} />

        {solve && <ResultView data={solve} />}

        {!file && (
          <Card
            title="Tip rápido"
            subtitle="Prueba con tu archivo de ejemplo. Si el backend marca error, el archivo no cumple la estructura."
          >
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Sube el <span className="font-semibold">.txt</span> → mira el preview → presiona{" "}
              <span className="font-semibold">Ejecutar</span>
            </div>
          </Card>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
        </div>
      </footer>
    </div>
  );
}
