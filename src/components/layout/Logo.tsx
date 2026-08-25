import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const dims = { sm: 28, md: 34, lg: 42 }[size];
  const textSize = { sm: "text-[0.9rem]", md: "text-[1.05rem]", lg: "text-[1.3rem]" }[size];

  return (
    <Link href="/" className={`flex items-center gap-2.5 group flex-shrink-0 ${className}`}>
      {/* Icon mark */}
      <svg
        width={dims}
        height={dims}
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
        aria-hidden="true"
      >
        {/* Background rounded square */}
        <rect width="34" height="34" rx="9" fill="url(#logo-grad-bg)" />

        {/* Outer ring arc (top-right) — represents transformation/conversion */}
        <path
          d="M24 9.5 A9.5 9.5 0 0 1 24.5 24"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Two stacked document shapes — source and output */}
        {/* Back document (source) */}
        <rect x="8" y="10" width="11" height="14" rx="2" fill="rgba(255,255,255,0.25)" />
        <path d="M10 14h7M10 17h5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" />

        {/* Front document (output) — offset right-down */}
        <rect x="14" y="13" width="11" height="14" rx="2" fill="white" />
        <path d="M16.5 17.5h6M16.5 20.5h4" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />

        {/* Arrow / bolt — conversion indicator */}
        <circle cx="25.5" cy="8.5" r="4" fill="url(#logo-grad-accent)" />
        <path
          d="M25.5 6.5 L24.2 8.5 H25.2 L23.5 10.5 L26.8 8.2 H25.7 L27 6.5 Z"
          fill="white"
        />

        <defs>
          <linearGradient id="logo-grad-bg" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="logo-grad-accent" x1="21.5" y1="4.5" x2="29.5" y2="12.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>

      {/* Wordmark */}
      <div className={`flex items-baseline gap-0 leading-none ${textSize}`}>
        <span className="font-extrabold text-slate-900 tracking-tight">Easy</span>
        <span
          className="font-extrabold tracking-tight"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Converter
        </span>
        <span className="font-medium text-slate-300 text-[0.7em] ml-[1px]">.io</span>
      </div>
    </Link>
  );
}
