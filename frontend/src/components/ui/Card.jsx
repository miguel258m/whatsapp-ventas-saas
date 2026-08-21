export default function Card({ className = "", children, ...props }) {
  return (
    <div
      className={[
        "rounded-2xl border border-ink-100 bg-white p-6 shadow-sm",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
