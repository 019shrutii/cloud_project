import React from "react";

const FEATURES = [
    { icon: "📋", title: "Expense Logging", desc: "Quickly log expenses with a title, amount, and category. Never lose track of where your money goes." },
    { icon: "🔥", title: "Burn Rate Tracking", desc: "Monitor how fast you're spending. Get a clear picture of your monthly financial velocity." },
    { icon: "🥧", title: "Visual Analytics", desc: "Understand spending patterns at a glance with beautiful doughnut and bar charts." },
    { icon: "🔐", title: "JWT Security", desc: "Every request is authenticated with JSON Web Tokens. Your data stays yours." },
    { icon: "⚡", title: "Real-time Updates", desc: "Add an expense and watch your charts and totals update instantly — no page reloads." },
    { icon: "📱", title: "Responsive Design", desc: "Works beautifully on desktop, tablet, and mobile. Track expenses anywhere, anytime." },
];

const STACK = [
    { name: "MongoDB", color: "#34d399", desc: "NoSQL database" },
    { name: "Express.js", color: "#fb923c", desc: "REST API backend" },
    { name: "React", color: "#60a5fa", desc: "Interactive UI" },
    { name: "Node.js", color: "#a3e635", desc: "Server runtime" },
    { name: "Tailwind CSS", color: "#3b82f6", desc: "Styling" },
    { name: "Chart.js", color: "var(--primary)", desc: "Data visualization" },
];

function About() {
    return (
        <div className="about-page">
            {/* Hero */}
            <div className="anim-fade-up" style={{ marginBottom: "3rem" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "0.75rem" }}>
                    ✦ About SpendWise
                </p>
                <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1rem" }}>
                    Built for people who <span className="gradient-text">care about money</span>
                </h1>
                <p style={{ fontSize: "1.05rem", color: "var(--muted)", lineHeight: 1.8, maxWidth: "620px" }}>
                    SpendWise is a full-stack MERN application that helps you stay on top of your finances.
                    With real-time charts, JWT-secured accounts, and an intuitive dashboard, budgeting has never been this effortless.
                </p>
            </div>

            {/* Features */}
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1.25rem" }}>✨ Key Features</h2>
            <div className="feature-grid">
                {FEATURES.map((f, i) => (
                    <div key={i} className="feature-card anim-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                        <div className="feature-icon">{f.icon}</div>
                        <div className="feature-title">{f.title}</div>
                        <div className="feature-desc">{f.desc}</div>
                    </div>
                ))}
            </div>

            {/* Tech Stack */}
            <div style={{ marginTop: "3.5rem" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1.25rem" }}>🛠️ Tech Stack</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                    {STACK.map((t, i) => (
                        <div key={i} className="anim-fade-up" style={{
                            animationDelay: `${i * 0.07}s`,
                            display: "flex", alignItems: "center", gap: "0.6rem",
                            background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
                            borderRadius: "0.75rem", padding: "0.65rem 1.1rem",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            cursor: "default"
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 20px ${t.color}33`; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                        >
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: t.color }} />
                            <div>
                                <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{t.name}</div>
                                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{t.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default About;