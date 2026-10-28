import Link from "next/link";

type Variant = "primary" | "secondary" | "text";
const CLASS: Record<Variant, string> = { primary: "btn btn-primary", secondary: "btn btn-secondary", text: "btn btn-text" };

type Common = { variant?: Variant; block?: boolean; loading?: boolean; className?: string; children: React.ReactNode };

/**
 * Botões do Design System.
 * primary: cápsula Ivory com texto Midnight · secondary: Ocean Blue com texto Ivory · text: link discreto.
 */
export function Button({ variant = "primary", block, loading, className, children, disabled, ...rest }: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${CLASS[variant]}${block ? " btn-block" : ""}${className ? ` ${className}` : ""}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function ButtonLink({ variant = "primary", block, className, children, href }: Omit<Common, "loading"> & { href: string }) {
  return (
    <Link href={href} className={`${CLASS[variant]}${block ? " btn-block" : ""}${className ? ` ${className}` : ""}`}>
      {children}
    </Link>
  );
}
