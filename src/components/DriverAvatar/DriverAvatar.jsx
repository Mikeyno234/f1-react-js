import React, { useState } from "react";
import "./DriverAvatar.css";

// Renders a driver photo with graceful fallback:
// remote OpenF1 headshot -> local image -> initials.
function DriverAvatar({ src, localSrc, name, className = "", size }) {
  const [failed, setFailed] = useState(false);
  const resolved = !failed ? src || localSrc : localSrc;

  const style = size ? { width: size, height: size } : undefined;
  const initials = (name || "")
    .trim()
    .split(/\s+/)
    .slice(-1)[0]
    ?.slice(0, 3)
    .toUpperCase();

  if (resolved) {
    return (
      <img
        src={resolved}
        alt={name}
        className={`driver-avatar ${className}`}
        style={style}
        loading="lazy"
        onError={() => {
          // If remote failed, drop to local; if that also fails, show initials.
          if (!failed && localSrc && resolved !== localSrc) {
            setFailed(true);
          } else {
            setFailed("initials");
          }
        }}
      />
    );
  }

  return (
    <span className={`driver-avatar driver-avatar-fallback ${className}`} style={style}>
      {initials}
    </span>
  );
}

export default DriverAvatar;
