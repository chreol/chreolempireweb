"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export default function PasswordField({ className = "", ...props }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${className} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={visible}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
        style={{ color: "var(--text-muted)" }}
      >
        {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
      </button>
    </div>
  );
}
