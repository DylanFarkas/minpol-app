import { useMemo, useState } from "react";
import { previewTxt, solveTxt } from "./api/api";
import UploadPanel from "./components/UploadPanel";
import InputPreview from "./components/InputPreview";
import ResultView from "./components/ResultView";
import Card from "./components/Card";

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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900">MinPol — Interfaz de Pruebas</h1>
            <p className="text-sm text-slate-500">
              Sube un .txt, valida entrada, ejecuta MiniZinc y visualiza matrices.
            </p>
          </div>

          <button
            onClick={handleRun}
            disabled={!canRun}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingSolve ? "Ejecutando..." : "Ejecutar"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <UploadPanel file={file} onPickFile={handlePickFile} onClear={clearAll} isLoading={loadingPreview || loadingSolve} />

        {error && (
          <Card title="Ups. Algo explotó (pero controlado 😄)">
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          </Card>
        )}

        {loadingPreview && (
          <Card title="Leyendo archivo..." subtitle="Validando formato y consistencia (p vs s, sum(p)=n, etc.).">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-slate-900" />
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
            <div className="text-sm text-slate-600">
              Sube el <span className="font-semibold">.txt</span> → mira el preview → presiona <span className="font-semibold">Ejecutar</span>.
            </div>
          </Card>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500">
          Hecho para correr MinPol como Dios manda: entrada .txt → ejecución MiniZinc → salida + visualización.
        </div>
      </footer>
    </div>
  );
}
