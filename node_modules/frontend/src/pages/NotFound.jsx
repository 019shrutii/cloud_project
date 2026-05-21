import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function NotFound() {
    const [count, setCount] = useState(10);

    useEffect(() => {
        if (count <= 0) return;
        const t = setTimeout(() => setCount(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [count]);

    return (
        <div style={{
            minHeight: "calc(100vh - 64px)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "2rem",
            position: "relative", overflow: "hidden",
        }}>
            {/* Floating orbs */}
            {[
                { w: 400, bg: "rgba(236,72,153,0.15)", top: "10%", left: "-5%" },
                { w: 300, bg: "rgba(59,130,246,0.12)", bottom: "10%", right: "-5%" },
            ].map((o, i) => (
                <div key={i} style={{
                    position: "absolute", width: o.w, height: o.w,
                    borderRadius: "50%", background: o.bg, filter: "blur(70px)",
                    pointerEvents: "none", animation: "floatY 6s ease-in-out infinite",
                    animationDelay: i + "s", ...o,
                }} />
            ))}

            {/* Content */}
            <div className="anim-fade-up" style={{ position: "relative", zIndex: 1 }}>
                {/* Animated 404 */}
                <div style={{
                    fontSize: "clamp(6rem, 20vw, 12rem)",
                    fontWeight: 900, lineHeight: 1,
                    background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "floatY 3s ease-in-out infinite",
                    filter: "drop-shadow(0 0 40px rgba(236,72,153,0.3))",
                }}>404</div>

                <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800, marginBottom: "0.75rem" }}>
                    Oops! Page not found
                </h1>
                <p style={{ color: "var(--muted)", fontSize: "1rem", maxWidth: "420px", lineHeight: 1.7, marginBottom: "2rem" }}>
                    Looks like this page went over budget and got cut. Let's get you back on track.
                </p>

                {/* Countdown */}
                <div className="glass" style={{
                    display: "inline-flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.75rem 1.5rem", borderRadius: "999px", marginBottom: "2rem",
                    borderColor: "rgba(236,72,153,0.25)",
                }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 800, fontSize: "0.9rem", color: "#fff",
                        animation: count <= 3 ? "pulse-glow 0.8s infinite" : "none",
                    }}>{count}</div>
                    <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
                        seconds · headed back…
                    </span>
                </div>

                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link to="/" className="btn-hero-primary" style={{ width: "auto", padding: "0.8rem 2rem" }}>
                        🏠 Go Home
                    </Link>
                    <Link to="/dashboard" className="btn-hero-secondary" style={{ padding: "0.8rem 2rem" }}>
                        📊 Dashboard
                    </Link>
                </div>

                {/* Fun suggestions */}
                <div style={{ marginTop: "3rem", display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                        { to: "/tips", label: "💡 Read Finance Tips" },
                        { to: "/calculator", label: "🧮 Try Calculators" },
                        { to: "/about", label: "ℹ️ About SpendWise" },
                    ].map(l => (
                        <Link key={l.to} to={l.to} className="nav-link" style={{ fontSize: "0.85rem", padding: "0.4rem 0.9rem", border: "1px solid var(--glass-border)", borderRadius: "0.5rem" }}>
                            {l.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NotFound;
