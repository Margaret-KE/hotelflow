import AuthLayout from "../../../layouts/AuthLayout";
import LoginCard from "../components/LoginCard";
import LoginForm from "../components/LoginForm";

import heroImage from "../../../assets/images/hero/hero-2.jpg";

export default function Login() {
  return (
    <AuthLayout>
      <div
        className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-6"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <LoginCard>
          <div className="relative z-10">
            <h1 className="text-center text-4xl font-bold text-white">
              Greenwood Hotel
            </h1>

            <p className="mt-2 text-center text-lg text-green-200">
              Staff Portal
            </p>

            <p className="mt-3 text-center text-sm text-white/80">
              Secure access for Greenwood Hotel staff.
            </p>

            <p className="mb-8 mt-6 text-center text-white/80">
              Welcome back. Sign in to continue.
            </p>

            <LoginForm />
          </div>
        </LoginCard>
      </div>
    </AuthLayout>
  );
}