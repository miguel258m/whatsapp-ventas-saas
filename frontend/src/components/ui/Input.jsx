export default function Input({ label, id, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          "rounded-xl border px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400",
          "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500",
          error ? "border-red-400" : "border-ink-200",
          className,
        ].join(" ")}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
