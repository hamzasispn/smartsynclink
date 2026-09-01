import Link from "next/link";

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border border-line bg-white p-6 shadow-card ${className}`}
    >
      {children}
    </section>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-medium tracking-[-0.02em] text-[#1e1e1e]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1.5 text-[15px] text-muted">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-normal transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

const skins = {
  primary: "bg-brand text-white hover:bg-brand-deep",
  outline: "border border-line bg-white text-[#1e1e1e] hover:bg-page",
  danger: "border border-red-200 bg-white text-red-600 hover:bg-red-50",
} as const;

type Variant = keyof typeof skins;

export function Btn({
  variant = "primary",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button {...rest} className={`${base} ${skins[variant]} ${className}`} />;
}

export function BtnLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${base} ${skins[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-[15px] text-[#1e1e1e] outline-none transition-colors placeholder:text-muted focus:border-brand";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[#1e1e1e]">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-[12px] text-muted">{hint}</span> : null}
    </label>
  );
}

export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="text-[28px] font-medium leading-none text-[#1e1e1e]">
        {value}
      </span>
    </Card>
  );
}

export function Pill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "good" | "warn";
  children: React.ReactNode;
}) {
  const skin = {
    neutral: "bg-page text-muted",
    good: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
  }[tone];
  return (
    <span className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${skin}`}>
      {children}
    </span>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-line px-6 py-10 text-center text-[15px] text-muted">
      {children}
    </p>
  );
}
