import Badge from "./Badge";

export default function UploadPanel({ file, onPickFile, onClear, isLoading }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Entrada (.txt)</h2>
          <p className="mt-1 text-sm text-slate-500">
            Sube el archivo de prueba. La app lo parsea y lo ejecuta con MiniZinc.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge>FastAPI + MiniZinc</Badge>
          <Badge>React + Tailwind</Badge>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="group relative flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600 transition hover:bg-slate-100">
            <input
              type="file"
              accept=".txt"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => onPickFile(e.target.files?.[0] || null)}
              disabled={isLoading}
            />
            <div className="text-center">
              <div className="font-semibold text-slate-900">Haz click para subir</div>
              <div className="mt-1 text-slate-500">o arrastra tu .txt aquí</div>
            </div>
          </label>

          <div className="flex w-full flex-col gap-2 md:w-90">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <div className="text-xs text-slate-500">Archivo seleccionado</div>
              <div className="truncate text-sm font-medium text-slate-900">
                {file?.name || "Ninguno"}
              </div>
            </div>

            <button
              onClick={onClear}
              disabled={!file || isLoading}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
