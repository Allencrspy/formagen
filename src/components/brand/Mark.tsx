/**
 * The Formagen mark: a plum tile with the letter F (same drawing as app/icon.svg).
 * `inverse` draws a white tile with a plum F, for use on the plum regions.
 */
export function Mark({ size = 20, inverse = false }: { size?: number; inverse?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill={inverse ? "#ffffff" : "var(--color-mark)"} />
      <path d="M11 9h11v3h-7.5v3.5H21v3h-6.5V23H11z" fill={inverse ? "#5a1f4b" : "var(--color-on-mark)"} />
    </svg>
  );
}
