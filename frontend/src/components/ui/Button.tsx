interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const base =
    "rounded-xl px-6 py-3 font-medium transition-all duration-200";

  const styles = {
    primary:
      "bg-green-700 text-white hover:bg-green-800",

    secondary:
      "border border-green-700 text-green-700 hover:bg-green-50",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${styles[variant]} ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : ""
      }`}
    >
      {children}
    </button>
  );
}