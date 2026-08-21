const VARIANTS = {
  brand: "bg-brand-100 text-brand-700",
  neutral: "bg-ink-100 text-ink-700",
  outline: "border border-ink-200 text-ink-700",
};

export default function Badge({ variant = "brand", className = "", children }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        VARIANTS[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
