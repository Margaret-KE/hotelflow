import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({
  label,
  error,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        {label}
      </label>

      <input
        {...props}
        className={`w-full rounded-xl border px-4 py-3 outline-none transition-all duration-200
          bg-white/20 text-white placeholder:text-white/60
          ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-white/20 focus:border-green-400"
          }`}
      />

      {error && (
        <p className="text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}