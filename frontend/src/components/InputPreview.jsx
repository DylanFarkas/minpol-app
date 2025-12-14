import Card from "./Card";

function MiniTable({ title, rows }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">
        {title}
      </div>
      <div className="px-4 py-3">
        <div className="grid gap-2">
          {rows.map(({ k, v }) => (
            <div key={k} className="flex items-start justify-between gap-4">
              <div className="text-sm text-slate-500">{k}</div>
              <div className="text-sm font-medium text-slate-900">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MatrixS({ s }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">
        s[i,k] (baja / media / alta)
      </div>
      <div className="overflow-x-auto px-4 py-3">
        <table className="w-full min-w-105 text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="py-2 pr-4">Opinión</th>
              <th className="py-2 pr-4">Baja</th>
              <th className="py-2 pr-4">Media</th>
              <th className="py-2 pr-4">Alta</th>
            </tr>
          </thead>
          <tbody>
            {s.map((row, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="py-2 pr-4 font-medium text-slate-900">op. {i + 1}</td>
                <td className="py-2 pr-4 text-slate-700">{row[0]}</td>
                <td className="py-2 pr-4 text-slate-700">{row[1]}</td>
                <td className="py-2 pr-4 text-slate-700">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function InputPreview({ rawText, parsed }) {
  if (!rawText || !parsed) return null;

  const { n, m, p, v, s, ct, maxMovs } = parsed;

  return (
    <Card
      title="Preview de entrada"
      subtitle="Lo que leyó el backend desde tu .txt (validado y parseado)."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <MiniTable
          title="Parámetros"
          rows={[
            { k: "n", v: n },
            { k: "m", v: m },
            { k: "ct", v: ct },
            { k: "maxMovs", v: maxMovs },
          ]}
        />

        <MiniTable
          title="Vectores"
          rows={[
            { k: "p", v: `[${p.join(", ")}]` },
            { k: "v", v: `[${v.join(", ")}]` },
          ]}
        />

        <div className="lg:col-span-2">
          <MatrixS s={s} />
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100">
            <div className="mb-2 text-xs font-semibold text-slate-300">RAW TXT</div>
            <pre className="whitespace-pre-wrap leading-relaxed">{rawText}</pre>
          </div>
        </div>
      </div>
    </Card>
  );
}
