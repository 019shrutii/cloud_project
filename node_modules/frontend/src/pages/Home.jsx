import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import CanvasHero from "../components/CanvasHero";

const STEPS = [
    { n: "01", icon: "✍️", title: "Sign Up Free", desc: "Create your secure account in seconds. No credit card required." },
    { n: "02", icon: "➕", title: "Log Expenses", desc: "Add transactions with title, amount, and category. Done in one tap." },
    { n: "03", icon: "📊", title: "See Insights", desc: "Instantly visualize your spending in charts, breakdowns, and totals." },
    { n: "04", icon: "🎯", title: "Hit Your Goals", desc: "Set a monthly budget, track burn rate, and build smarter habits." },
];

const TESTIMONIALS = [
    { name: "Priya S.", role: "Freelance Designer", avatar: "P", color: "#ec4899", text: "SpendWise completely changed how I manage money. The charts make it so easy to see where I'm overspending every month!" },
    { name: "Rahul M.", role: "Software Engineer", avatar: "R", color: "#60a5fa", text: "The budget tracker with the ring animation is genius. I check it daily. Finally hit my savings goal last month!" },
    { name: "Ananya K.", role: "MBA Student", avatar: "A", color: "#34d399", text: "The finance tips page alone is worth it. The SIP calculator helped me convince my parents to start investing early." },
];

// ── Typewriter hook ──────────────────────────────────────
function useTypewriter(words, speed = 90, pause = 2000) {
    const [display, setDisplay] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        const current = words[wordIndex % words.length];
        let timeout;
        if (!deleting && charIndex <= current.length) {
            timeout = setTimeout(() => {
                setDisplay(current.slice(0, charIndex));
                setCharIndex(c => c + 1);
            }, charIndex === current.length ? pause : speed);
        } else if (deleting && charIndex >= 0) {
            timeout = setTimeout(() => {
                setDisplay(current.slice(0, charIndex));
                setCharIndex(c => c - 1);
                if (charIndex === 0) {
                    setDeleting(false);
                    setWordIndex(w => w + 1);
                }
            }, speed / 2);
        } else {
            setDeleting(true);
        }
        return () => clearTimeout(timeout);
    }, [charIndex, deleting, wordIndex, words, speed, pause]);
    /* eslint-enable react-hooks/set-state-in-effect */

    return display;
}

// ── Floating orb ─────────────────────────────────────────
function Orb({ style }) {
    return (
        <div style={{
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
            animation: "floatY 6s ease-in-out infinite",
            ...style,
        }} />
    );
}

const WORDS = ["Smarter", "Wiser", "Trackable", "Visualized", "Effortless"];

const STATS = [
    { icon: "💰", value: "₹0 Hidden", label: "Full Transparency" },
    { icon: "📊", value: "Real-time", label: "Live Analytics" },
    { icon: "🔒", value: "JWT Auth", label: "Secure & Private" },
    { icon: "⚡", value: "Instant", label: "Fast Tracking" },
];

const FEATURES = [
    { icon: "📋", text: "Log expenses by category in seconds" },
    { icon: "🔥", text: "Track your monthly burn rate live" },
    { icon: "🥧", text: "Visual doughnut chart analysis" },
    { icon: "🔐", text: "JWT-secured personal data" },
    { icon: "🔍", text: "Search & filter your expenses" },
    { icon: "📥", text: "Export data to CSV anytime" },
];

function Home() {
    const typed = useTypewriter(WORDS);
    const [visible, setVisible] = useState(false);
    const featRef = useRef(null);
    const [featVisible, setFeatVisible] = useState(false);

    useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

    // Intersection observer for features section
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setFeatVisible(true); },
            { threshold: 0.15 }
        );
        if (featRef.current) obs.observe(featRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <>
            {/* ── Hero ─────────────────────────────────────── */}
            <section className="hero" style={{ position: "relative", overflow: "hidden" }}>
                {/* Background orbs */}
                <Orb style={{ width: 400, height: 400, background: "rgba(236,72,153,0.15)", top: "10%", left: "-5%" }} />
                <Orb style={{ width: 300, height: 300, background: "rgba(59,130,246,0.15)", bottom: "5%", right: "0%", animationDelay: "2s" }} />
                <Orb style={{ width: 200, height: 200, background: "rgba(100,116,139,0.15)", top: "55%", left: "55%", animationDelay: "1s" }} />

                <div style={{ position: "relative", zIndex: 1, opacity: visible ? 1 : 0, transition: "opacity 0.6s", maxWidth: "720px" }}>
                    <p style={{
                        fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.18em",
                        textTransform: "uppercase", color: "var(--primary)", marginBottom: "1rem",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
                    }}>
                        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", animation: "pulse-glow 2s infinite" }} />
                        Smart Money Management
                    </p>

                    <h1 className="hero-title">
                        Make Spending{" "}
                        <span className="gradient-text">
                            {typed}
                            <span style={{ borderRight: "3px solid var(--primary)", marginLeft: "2px", animation: "blink 1s step-end infinite" }} />
                        </span>
                    </h1>

                    <p className="hero-sub">
                        SpendWise gives you powerful real-time insights into your spending habits —
                        beautifully visualized, securely stored, and always at your fingertips.
                    </p>

                    <div className="hero-btn-row">
                        <Link to="/signup" className="btn-hero-primary">Get Started Free →</Link>
                        <Link to="/about" className="btn-hero-secondary">Learn More</Link>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="stat-grid anim-fade-up stagger-2" style={{ position: "relative", zIndex: 1 }}>
                    {STATS.map((s, i) => (
                        <div key={i} className="stat-card" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                            <div className="stat-icon">{s.icon}</div>
                            <div className="stat-value" style={{ color: "#fff" }}>{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ─────────────────────────────────── */}
            <section ref={featRef} style={{ padding: "5rem 2rem", maxWidth: "900px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
                    <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800 }}>
                        Everything you need to <span className="gradient-text">save more</span>
                    </h2>
                    <p style={{ color: "var(--muted)", marginTop: "0.75rem", fontSize: "0.95rem" }}>
                        A complete toolkit for personal finance management
                    </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.1rem" }}>
                    {FEATURES.map((f, i) => (
                        <div
                            key={i}
                            className="glass"
                            style={{
                                padding: "1.3rem 1.4rem",
                                display: "flex", alignItems: "flex-start", gap: "0.85rem",
                                opacity: featVisible ? 1 : 0,
                                transform: featVisible ? "translateY(0)" : "translateY(24px)",
                                transition: `opacity 0.6s ${i * 0.07}s ease, transform 0.6s ${i * 0.07}s ease`,
                            }}
                        >
                            <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{f.icon}</span>
                            <span style={{ fontSize: "0.88rem", lineHeight: 1.65, color: "var(--muted)" }}>{f.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How It Works ──────────────────────────── */}
            <section style={{ padding: "5rem 2rem", maxWidth: "900px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800 }}>
                        How it <span className="gradient-text">works</span>
                    </h2>
                    <p style={{ color: "var(--muted)", marginTop: "0.6rem", fontSize: "0.95rem" }}>Up and running in under 2 minutes</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1.25rem" }}>
                    {STEPS.map((step, i) => (
                        <div key={i} className="glass anim-fade-up" style={{ padding: "1.75rem 1.25rem", textAlign: "center", animationDelay: `${i * 0.1}s` }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: "50%",
                                background: "linear-gradient(135deg, #ec4899, #3b82f6)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 900, fontSize: "0.8rem", color: "#fff",
                                margin: "0 auto 1rem",
                                boxShadow: "0 4px 16px rgba(236,72,153,0.3)",
                            }}>{step.n}</div>
                            <div style={{ fontSize: "1.6rem", marginBottom: "0.6rem" }}>{step.icon}</div>
                            <div style={{ fontWeight: 700, marginBottom: "0.4rem" }}>{step.title}</div>
                            <div style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.65 }}>{step.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Testimonials ──────────────────────────── */}
            <section style={{ padding: "0 2rem 5rem", maxWidth: "900px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800 }}>
                        Loved by <span className="gradient-text">real users</span>
                    </h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.25rem" }}>
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="glass anim-fade-up" style={{ padding: "1.5rem", animationDelay: `${i * 0.1}s`, borderColor: t.color + "33" }}>
                            <div style={{ fontSize: "1.15rem", color: "#facc15", marginBottom: "0.75rem" }}>★★★★★</div>
                            <p style={{ fontSize: "0.88rem", lineHeight: 1.75, color: "var(--muted)", marginBottom: "1.25rem", fontStyle: "italic" }}>"{t.text}"</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: `linear-gradient(135deg, ${t.color}88, ${t.color})`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: 800, fontSize: "0.9rem", color: "#fff",
                                }}>{t.avatar}</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{t.name}</div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Tool Promo Cards ──────────────────────── */}
            <section style={{ padding: "0 2rem 5rem", maxWidth: "900px", margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                    {[
                        { to: "/tips", icon: "💡", title: "Finance Tips", desc: "Flip-card tips on saving, budgeting & investing + a live SIP calculator.", color: "#ec4899" },
                        { to: "/calculator", icon: "🧮", title: "Smart Calculators", desc: "EMI, 50-30-20 budget rule, and savings goal planner — all interactive.", color: "#34d399" },
                    ].map(card => (
                        <Link key={card.to} to={card.to} style={{ textDecoration: "none" }}>
                            <div className="glass" style={{
                                padding: "1.75rem", borderRadius: "1rem",
                                borderColor: card.color + "44",
                                background: card.color + "0a",
                                transition: "transform 0.25s, box-shadow 0.25s",
                                display: "flex", flexDirection: "column", gap: "0.6rem",
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 16px 32px ${card.color}22`; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                            >
                                <span style={{ fontSize: "2rem" }}>{card.icon}</span>
                                <div style={{ fontWeight: 800, fontSize: "1.05rem", color: card.color }}>{card.title} →</div>
                                <div style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.65 }}>{card.desc}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ───────────────────────────────── */}

            <section style={{ padding: "0 2rem 6rem", maxWidth: "900px", margin: "0 auto" }}>
                <div className="glass" style={{
                    padding: "3rem 2rem", textAlign: "center",
                    background: "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(59,130,246,0.1))",
                    borderColor: "rgba(236,72,153,0.2)",
                    position: "relative", overflow: "hidden"
                }}>
                    <Orb style={{ width: 200, height: 200, background: "rgba(236,72,153,0.2)", top: "-30%", right: "-5%", filter: "blur(40px)" }} />
                    <h3 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 800, marginBottom: "0.75rem", position: "relative" }}>
                        Ready to take control of your finances?
                    </h3>
                    <p style={{ color: "var(--muted)", marginBottom: "1.75rem", fontSize: "0.95rem", position: "relative" }}>
                        Join SpendWise today — it's completely free.
                    </p>
                    <Link to="/signup" className="btn-hero-primary" style={{ display: "inline-block", width: "auto", padding: "0.9rem 2.75rem", position: "relative" }}>
                        Create Free Account 🚀
                    </Link>
                </div>
            </section>

            <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
        </>
    );
}

export default Home;