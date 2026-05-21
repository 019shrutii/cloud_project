import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1); // 1: Details, 2: OTP Verification
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
    const strengthLabel = ["", "Weak", "Good", "Strong"];
    const strengthColor = ["", "#ef4444", "#f59e0b", "#10b981"];

    // STEP 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/auth/send-otp", { email });
            toast.success("OTP sent to your email!");
            setStep(2);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    // STEP 2: Verify OTP & Signup
    const handleVerifyAndSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/signup", { name, email, password, otp });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("spendwise_name", res.data.name);
            toast.success("Account verified & created! Welcome 🎉");
            setTimeout(() => navigate("/dashboard"), 1400);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-orb" style={{ width: 400, height: 400, background: "rgba(236,72,153,0.1)", top: "-10%", right: "-5%" }} />
            <div className="auth-orb" style={{ width: 300, height: 300, background: "rgba(59,130,246,0.1)", bottom: "-5%", left: "-5%" }} />

            <div className="glass auth-card anim-fade-up">
                <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{step === 1 ? "🚀" : "🛡️"}</p>
                <h2 className="auth-title">{step === 1 ? "Create account" : "Verify Email"}</h2>
                <p className="auth-sub">
                    {step === 1
                        ? "Start tracking smarter — it's free"
                        : `We've sent a 6-digit code to ${email}`}
                </p>

                {step === 1 ? (
                    <form className="form-group" onSubmit={handleSendOtp}>
                        <div className="form-item">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="form-item">
                            <label className="form-label">Email address</label>
                            <input
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
                            {password.length > 0 && (
                                <div style={{ marginTop: "0.5rem" }}>
                                    <div style={{ display: "flex", gap: "4px", marginBottom: "0.3rem" }}>
                                        {[1, 2, 3].map(i => (
                                            <div key={i} style={{
                                                height: "4px", flex: 1, borderRadius: "2px",
                                                background: i <= strength ? strengthColor[strength] : "rgba(255,255,255,0.1)",
                                                transition: "background 0.3s"
                                            }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: "0.75rem", color: strengthColor[strength] }}>
                                        {strengthLabel[strength]} password
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? "Sending OTP…" : "Get Started →"}
                        </button>
                    </form>
                ) : (
                    <form className="form-group" onSubmit={handleVerifyAndSignup}>
                        <div className="form-item">
                            <label className="form-label">Enter 6-digit Code</label>
                            <input
                                type="text"
                                placeholder="123456"
                                value={otp}
                                onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                className="input-field"
                                style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "10px", fontWeight: "bold" }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading || otp.length < 6}
                            style={{ marginTop: "0.5rem", opacity: (loading || otp.length < 6) ? 0.7 : 1 }}
                        >
                            {loading ? "Verifying…" : "Verify & Create Account 🎉"}
                        </button>

                        <div style={{ textAlign: "center", marginTop: "1rem" }}>
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading}
                                style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600 }}
                            >
                                Resend Code
                            </button>
                        </div>
                        <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "0.85rem", cursor: "pointer" }}
                            >
                                ← Change Email
                            </button>
                        </div>
                    </form>
                )}

                <div className="auth-footer" style={{ marginTop: "1.5rem" }}>
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;