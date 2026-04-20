//import React from "react";
import "./Spinner.css";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export default function Spinner({ size = "md", label = "Loading…" }: SpinnerProps) {
  return (
    <div className={`spinner-wrap spinner-wrap--${size}`} role="status" aria-label={label}>
      <div className="spinner" />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
}