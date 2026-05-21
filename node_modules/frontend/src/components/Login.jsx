import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            if (res.data.name) localStorage.setItem("spendwise_name", res.data.name);
            toast.success("Welcome back! Redirecting…");
            setTimeout(() => navigate("/dashboard"), 1200);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-orb" style={{ width: 400, height: 400, background: "rgba(236,72,153,0.1)", top: "-10%", left: "-5%" }} />
            <div className="auth-orb" style={{ width: 300, height: 300, background: "rgba(59,130,246,0.1)", bottom: "-5%", right: "-5%" }} />

            <div className="glass auth-card anim-fade-up">
                <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👋</p>
                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-sub">Sign in to your SpendWise account</p>

                <form className="form-group" onSubmit={handleLogin}>
                    <div className="form-item">
                        <label className="form-label">Email address</label>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="form-item">
                        <label className="form-label">Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                id="login-password"
                                type={showPass ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="input-field"
                                style={{ paddingRight: "3rem" }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                style={{
                                    position: "absolute", right: "0.75rem", top: "50%",
                                    transform: "translateY(-50%)", background: "none",
                                    border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "1rem"
                                }}
                            >
                                {showPass ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    <button
                        id="login-submit"
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? "Signing in…" : "Sign In →"}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/signup">Create one free</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;