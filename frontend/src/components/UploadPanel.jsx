import Badge from "./Badge";
import { FileText } from "lucide-react";

export default function UploadPanel({ file, onPickFile, onClear, isLoading }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-900/60">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-white/10">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Entrada (.txt)</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sube el archivo de prueba. La app lo parsea y lo ejecuta con MiniZinc.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <Badge>FastAPI + MiniZinc</Badge>
          <Badge>React + Tailwind</Badge> */}
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="group relative flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600 transition hover:bg-slate-100 focus-within:ring-2 focus-within:ring-slate-400/40 dark:border-white/15 dark:bg-gray-950 dark:text-slate-300 dark:hover:bg-gray-900 dark:focus-within:ring-white/20">
            <input
              type="file"
              accept=".txt"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => onPickFile(e.target.files?.[0] || null)}
              disabled={isLoading}
            />
            <div className="text-center">
              <div className="font-semibold text-slate-900 dark:text-slate-100">Haz click para subir</div>
              <div className="mt-1 text-slate-500 dark:text-slate-400">o arrastra tu .txt aquí</div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm dark:border-white/10 dark:bg-gray-900 dark:text-slate-300">
                <span className="text-sm"> <FileText /> </span> Solo .txt
              </div>
            </div>
          </label>

          <div className="flex w-full flex-col gap-2 md:w-90">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-gray-950">
              <div className="text-xs text-slate-500 dark:text-slate-400">Archivo seleccionado</div>
              <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {file?.name || "Ninguno"}
              </div>
            </div>

            <button
              onClick={onClear}
              disabled={!file || isLoading}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/40 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-gray-900 dark:text-slate-200 dark:hover:bg-gray-800 dark:focus:ring-white/20"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
