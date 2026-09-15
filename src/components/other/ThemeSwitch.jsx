import React from "react";
import "./ThemeSwitch.css";

// Minimal, emoji-free light/dark toggle. `checked` = dark mode.
function ThemeSwitch({ checked, onChange, onClick, className = "" }) {
  const handle = (e) => {
    if (onChange) onChange(e);
    if (onClick) onClick(e);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Toggle dark mode"
      className={`theme-switch ${checked ? "is-dark" : ""} ${className}`}
      onClick={handle}
    >
      <span className="theme-switch-track">
        <span className="theme-switch-thumb" />
      </span>
    </button>
  );
}

export default ThemeSwitch;
