import React, { useState } from "react";
import "./TeamBadge.css";

/**
 * Shows a team logo when we have one, otherwise a colour chip derived from the
 * live team colour. That keeps brand-new teams (Audi, Cadillac, ...) looking
 * intentional instead of blank.
 */
function TeamBadge({ logo, color, name, className = "" }) {
  const [broken, setBroken] = useState(false);

  if (logo && !broken) {
    return (
      <img
        className={`team-logo ${className}`}
        src={logo}
        alt={name}
        loading="lazy"
        onError={() => setBroken(true)}
      />
    );
  }

  const initials = (name || "")
    .replace(/\s*F1 Team\s*/i, "")
    .trim()
    .slice(0, 3)
    .toUpperCase();

  return (
    <span
      className={`team-chip ${className}`}
      style={color ? { background: color } : undefined}
      title={name}
      aria-label={name}
    >
      {initials}
    </span>
  );
}

export default TeamBadge;
