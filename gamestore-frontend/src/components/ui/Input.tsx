//import React from "react";
import "./Input.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({ label, error, hint, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={`input-wrap ${error ? "input-wrap--error" : ""} ${className}`}>
      {label && <label className="input-label" htmlFor={inputId}>{label}</label>}
      <input className="input-field" id={inputId} {...props} />
      {error && <span className="input-msg input-msg--error">{error}</span>}
      {hint && !error && <span className="input-msg">{hint}</span>}
    </div>
  );
}