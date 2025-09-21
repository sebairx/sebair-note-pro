import React, { useState } from "react";
import { login } from "./api";

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await login(email, password);
    if (res.success) {
      onLogin();
    } else {
      setError(res.error || "فشل تسجيل الدخول");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg w-full max-w-sm" onSubmit={handleSubmit}>
        <h1 className="text-xl font-bold mb-5 text-center">تسجيل الدخول في Sebair Note Pro</h1>
        <input
          type="email"
          className="w-full mb-3 p-2 rounded border search-input"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full mb-3 p-2 rounded border search-input"
          placeholder="كلمة المرور"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 bg-cyan-500 text-white rounded fab-shadow"
          disabled={loading}
        >
          {loading ? "جارٍ تسجيل الدخول..." : "دخول"}
        </button>
        <button
          type="button"
          className="w-full mt-3 py-2 bg-gray-300 text-gray-700 rounded"
          onClick={onSwitchToRegister}
        >
          ليس لديك حساب؟ سجل الآن
        </button>
      </form>
    </div>
  );
}

export default Login;