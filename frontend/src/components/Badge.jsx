export default function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm dark:border-white/10 dark:bg-gray-950 dark:text-slate-200">
      {children}
    </span>
  );
}
