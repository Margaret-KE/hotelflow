import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { InputHTMLAttributes } from "react";

interface PasswordInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function PasswordInput({
  label,
  error,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          type={showPassword ? "text" : "password"}
          className={`w-full rounded-xl border bg-white/20 px-4 py-3 pr-12 text-white placeholder:text-white/60 outline-none transition-all duration-200
          ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-white/20 focus:border-green-400"
          }`}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}