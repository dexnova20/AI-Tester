"use client";

interface LogoProps {
  size?: number;
  dark?: boolean;
  showWordmark?: boolean;
}

export default function Logo({ size = 36, dark = false, showWordmark = true }: LogoProps) {
  const fg = dark ? "#f5f0eb" : "#0d0d0d";
  const accent = "#2563eb";

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Mark */}
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        {/* Outer ring */}
        <circle cx="20" cy="20" r="18" stroke={fg} strokeWidth="1.5" strokeOpacity="0.15" />
        {/* Shield body */}
        <path
          d="M20 6 L31 10.5 L31 20 C31 27 26 32 20 35 C14 32 9 27 9 20 L9 10.5 Z"
          fill={accent}
          fillOpacity="0.12"
          stroke={accent}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Eye horizontal */}
        <path
          d="M13 20 C15.5 16.5 24.5 16.5 27 20 C24.5 23.5 15.5 23.5 13 20 Z"
          fill={accent}
          fillOpacity="0.18"
          stroke={accent}
          strokeWidth="1.2"
        />
        {/* Pupil */}
        <circle cx="20" cy="20" r="3" fill={accent} />
        {/* Inner dot */}
        <circle cx="20" cy="20" r="1.2" fill="#fff" />
        {/* Tick marks */}
        <line x1="20" y1="3"  x2="20" y2="6"  stroke={fg} strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
        <line x1="20" y1="34" x2="20" y2="37" stroke={fg} strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
        <line x1="3"  y1="20" x2="6"  y2="20" stroke={fg} strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
        <line x1="34" y1="20" x2="37" y2="20" stroke={fg} strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none gap-0.5">
          <span
            className="font-bebas tracking-[0.18em]"
            style={{ fontSize: size * 0.58, color: fg, lineHeight: 1 }}
          >
            DRACULA
          </span>
          <span
            className="font-inter font-semibold tracking-[0.16em] uppercase"
            style={{ fontSize: size * 0.2, color: accent, lineHeight: 1 }}
          >
            AI Security
          </span>
        </div>
      )}
    </div>
  );
}
