import { useMemo, useState } from "react";
import Card from "./Card";
import Badge from "./Badge";

function Tabs({ tabs, value, onChange }) {
  return (
    <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
      {tabs.map((t) => {
        const active = value === t.value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={[
              "rounded-lg px-3 py-1.5 text-sm font-semibold transition",
              active ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function Matrix({ mat }) {
  if (!mat) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-130 text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-2">Origen \ Destino</th>
            {mat[0].map((_, j) => (
              <th key={j} className="px-4 py-2">
                op. {j + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mat.map((row, i) => (
            <tr key={i} className="border-t border-slate-100">
              <td className="px-4 py-2 font-medium text-slate-900">op. {i + 1}</td>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ResultView({ data }) {
  const [tab, setTab] = useState("low");
  if (!data) return null;

  const { result, time_ms } = data;
  const { pol_int, pol_real, x_low, x_med, x_high } = result;

  const current = useMemo(() => {
    if (tab === "low") return x_low;
    if (tab === "med") return x_med;
    return x_high;
  }, [tab, x_low, x_med, x_high]);

  return (
    <Card
      title="Resultado"
      subtitle="Salida del solver (formato del proyecto) + vista amigable."
      right={
        <div className="flex items-center gap-2">
          <Badge>{time_ms} ms</Badge>
          <Badge>pol_int: {pol_int}</Badge>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">Polarización real</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">{pol_real.toFixed(3)}</div>
          <div className="mt-2 text-sm text-slate-500">
            (Se imprime escalada en el .txt final: <span className="font-semibold">pol_int</span> = pol_real × 1000)
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Matriz de movimientos</div>
              <div className="text-sm text-slate-500">Cambia de pestaña para ver baja/media/alta.</div>
            </div>
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                { label: "Resistencia baja", value: "low" },
                { label: "Resistencia media", value: "med" },
                { label: "Resistencia alta", value: "high" },
              ]}
            />
          </div>

          <div className="mt-4">
            <Matrix mat={current} />
          </div>
        </div>
      </div>
    </Card>
  );
}
