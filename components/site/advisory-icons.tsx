/**
 * Illustrated icons for the home-page advisory rows. Colours come from the
 * logo (see app/globals.css): ring red, yellow, harvest brown and royal blue.
 */

type IconProps = { className?: string };

/** A tap with a "no" sign: water service interrupted. */
export function NoWaterIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g fill="var(--brand-red)">
        {/* handle and stem */}
        <rect x="12" y="5" width="22" height="6" rx="3" />
        <rect x="20" y="10" width="6" height="10" />
        {/* wall flange and body */}
        <rect x="2" y="16" width="7" height="20" rx="2" />
        <rect x="8" y="20" width="30" height="12" rx="2" />
        {/* spout */}
        <path d="M32 20h8a12 12 0 0 1 12 12v5H42v-3a2 2 0 0 0-2-2h-8z" />
      </g>
      {/* "no" sign */}
      <circle
        cx="47"
        cy="47"
        r="12"
        fill="#fff"
        stroke="var(--brand-red)"
        strokeWidth="4"
      />
      <line
        x1="38.5"
        y1="38.5"
        x2="55.5"
        y2="55.5"
        stroke="var(--brand-red)"
        strokeWidth="4"
      />
    </svg>
  );
}

/** A wall calendar with a grid of days: a date to note. */
export function CalendarIcon({ className }: IconProps) {
  const cells = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      cells.push(
        <rect
          key={`${row}-${col}`}
          x={13 + col * 10}
          y={30 + row * 8.5}
          width="7"
          height="5.5"
          rx="1"
        />,
      );
    }
  }
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect
        x="5"
        y="10"
        width="54"
        height="50"
        rx="6"
        fill="#f3cf7a"
        stroke="var(--harvest-strong)"
        strokeWidth="3"
      />
      <path
        d="M5 16a6 6 0 0 1 6-6h42a6 6 0 0 1 6 6v8H5z"
        fill="var(--harvest-strong)"
      />
      {/* binder rings */}
      <g fill="var(--harvest)" stroke="var(--harvest-strong)" strokeWidth="2">
        <rect x="16" y="4" width="6" height="12" rx="3" />
        <rect x="42" y="4" width="6" height="12" rx="3" />
      </g>
      <g fill="var(--harvest-strong)">{cells}</g>
    </svg>
  );
}

/** A bold "i" on a blue disc: a general notice. */
export function NoticeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="var(--primary)" />
      <circle cx="32" cy="17" r="5.5" fill="#fff" />
      <path d="M24 27h12v20h4v6H24v-6h4V33h-4z" fill="#fff" />
    </svg>
  );
}
