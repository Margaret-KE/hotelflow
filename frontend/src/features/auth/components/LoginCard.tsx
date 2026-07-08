import type { ReactNode } from "react";

interface LoginCardProps {
  children: ReactNode;
}

export default function LoginCard({
  children,
}: LoginCardProps) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
      {children}
    </div>
  );
}