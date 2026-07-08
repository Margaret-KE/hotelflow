import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Input, PasswordInput } from "../../../components/ui";

import { login } from "../../../api/auth";

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email,
        password,
      });

      // Save authentication
      localStorage.setItem(
        "accessToken",
        response.data.accessToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Input
        label="Email Address"
        type="email"
        placeholder="staff@greenwood.co.ke"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      {error && (
        <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-white">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Remember me
        </label>

        <button
          type="button"
          className="hover:text-yellow-300"
        >
          Forgot Password?
        </button>
      </div>

      <Button
        type="submit"
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}