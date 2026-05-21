import React, { useState } from "react";

/* ─── DATA ────────────────────────────────────────────── */
const TIPS = {
    Saving: [
        { icon: "🏦", title: "Pay Yourself First", desc: "Transfer a fixed amount to savings the moment your salary arrives — before you spend anything else. Even ₹500/month compounds beautifully over time.", tag: "Beginner" },
        { icon: "☕", title: "The Latte Factor", desc: "Cutting just ₹100/day on unnecessary purchases saves ₹36,500 per year. That's a solid emergency fund in one year.", tag: "Quick Win" },
        { icon: "🛒", title: "The 24-Hour Rule", desc: "For any non-essential purchase above ₹1,000, wait 24 hours. You'll avoid ~80% of impulse buys.", tag: "Psychology" },
        { icon: "🔄", title: "Automate Everything", desc: "Set up automatic transfers to savings accounts. Willpower is finite — automation is infinite.", tag: "System" },
        { icon: "📦", title: "Bulk Buy Smartly", desc: "Non-perishable essentials like toiletries bought in bulk can save 15–30% annually.", tag: "Practical" },
        { icon: "💡", title: "Energy Audit", desc: "Review monthly bills — electricity, subscriptions, data plans. Cutting 3 unused subscriptions at ₹299 each = ₹10,764/year.", tag: "Quick Win" },
    ],
    Budgeting: [
        { icon: "🎯", title: "50-30-20 Rule", desc: "Allocate 50% of income to Needs, 30% to Wants, and 20% to Savings & Investments. A simple framework that actually works.", tag: "Framework" },
        { icon: "📊", title: "Zero-Based Budget", desc: "Give every rupee a job. Income minus all assigned expenses = ₹0. No money left unaccounted for.", tag: "Advanced" },
        { icon: "📅", title: "Weekly Money Date", desc: "Spend 15 minutes every Sunday reviewing last week's spending. Awareness alone reduces overspending by up to 20%.", tag: "Habit" },
        { icon: "🗂️", title: "Envelope Method", desc: "Divide cash into labeled envelopes (Groceries, Transport, Fun). When the envelope is empty, spending in that category stops.", tag: "Classic" },
        { icon: "📱", title: "Track Every Rupee", desc: "People who actively track expenses spend 15-20% less simply because of the awareness it creates. SpendWise does this for you!", tag: "Awareness" },
        { icon: "🚨", title: "Set Spending Alerts", desc: "Configure category limits. Get alerts when you're 80% through your budget for any category.", tag: "Proactive" },
    ],
    Investing: [
        { icon: "📈", title: "Start Early, Start Small", desc: "₹1,000/month at 12% returns from age 22 grows to ₹1.76 Crore by 60. Starting at 32? Only ₹52 Lakhs. Time is your greatest asset.", tag: "Compounding" },
        { icon: "🌐", title: "Diversify Across Assets", desc: "Don't put all eggs in one basket. Mix equity mutual funds, debt funds, gold, and FDs based on your risk appetite.", tag: "Risk Mgmt" },
        { icon: "💹", title: "SIP Over Lump Sum", desc: "Systematic Investment Plans (SIPs) average out market volatility. ₹5,000/month SIP for 10 years at 15% = ₹13.9 Lakhs.", tag: "Strategy" },
        { icon: "🛡️", title: "Emergency Fund First", desc: "Before investing, build 6 months of expenses as an emergency fund in a liquid FD or savings account.", tag: "Foundation" },
        { icon: "📉", title: "Buy the Dip", desc: "Market crashes are sale events for long-term investors. Stay invested, keep SIPs running during downturns.", tag: "Mindset" },
        { icon: "🏠", title: "Tax-Saving Investments", desc: "Maximize Section 80C (₹1.5L) via ELSS, PPF, NPS. Save tax now, build wealth long-term.", tag: "Tax" },
    ],
};

const CHALLENGES = [
    { day: "Week 1", icon: "🚫", title: "No Eating Out", desc: "Cook all meals at home for 7 days. Track savings vs normal spending.", color: "#f87171" },
    { day: "Week 2", icon: "📱", title: "No Impulse Shopping", desc: "Delete shopping apps for a week. Add to wishlist instead of buying.", color: "#60a5fa" },
    { day: "Week 3", icon: "☕", title: "DIY Coffee Week", desc: "Make your own coffee/tea for 7 days. Log what you save.", color: "#facc15" },
    { day: "Week 4", icon: "🎭", title: "Free Entertainment", desc: "Only use free entertainment — YouTube, walks, library. Save all leisure spend.", color: "#34d399" },
];

const TAG_COLORS = {
    Beginner: "#34d399", "Quick Win": "#facc15", Psychology: "#e879f9",
    System: "var(--secondary)", Practical: "#fb923c", Framework: "var(--primary)",
    Advanced: "#f87171", Habit: "#34d399", Classic: "#94a3b8",
    Awareness: "#60a5fa", Proactive: "#facc15", Compounding: "#34d399",
    "Risk Mgmt": "#fb923c", Strategy: "var(--primary)", Foundation: "var(--secondary)",
    Mindset: "#e879f9", Tax: "#facc15",
};

function TipCard({ tip, index }) {
    const [flipped, setFlipped] = useState(false);
    return (
        <div
            onClick={() => setFlipped(f => !f)}
            style={{
                cursor: "pointer",
                perspective: "1000px",
                height: "200px",
                animationDelay: `${index * 0.07}s`,
            }}
            className="anim-fade-up"
        >
            <div style={{
                position: "relative", width: "100%", height: "100%",
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
            }}>
                {/* Front */}
                <div className="glass" style={{
                    position: "absolute", inset: 0, backfaceVisibility: "hidden",
                    padding: "1.4rem", display: "flex", flexDirection: "column", gap: "0.6rem",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "1.75rem" }}>{tip.icon}</span>
                        <span style={{
                            fontSize: "0.65rem", fontWeight: 700, padding: "0.2rem 0.55rem",
                            borderRadius: "999px", background: `${TAG_COLORS[tip.tag] || "#94a3b8"}22`,
                            color: TAG_COLORS[tip.tag] || "#94a3b8", border: `1px solid ${TAG_COLORS[tip.tag] || "#94a3b8"}44`,
                        }}>{tip.tag}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "1rem" }}>{tip.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.5, flex: 1 }}>
                        {tip.desc.slice(0, 60)}…
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: 600 }}>👆 Tap to read more</div>
                </div>
                {/* Back */}
                <div className="glass" style={{
                    position: "absolute", inset: 0, backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)", padding: "1.4rem",
                    display: "flex", flexDirection: "column", justifyContent: "center",
                    background: "rgba(236,72,153,0.12)", borderColor: "rgba(236,72,153,0.3)",
                }}>
                    <div style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "var(--text)" }}>{tip.desc}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--primary)", marginTop: "0.75rem", fontWeight: 600 }}>👆 Tap to flip back</div>
                </div>
            </div>
        </div>
    );
}

/* ─── Savings Calculator ──────────────────────────────── */
function SavingsCalc() {
    const [monthly, setMonthly] = useState(5000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);

    const months = years * 12;
    const r = rate / 100 / 12;
    const fv = r > 0 ? monthly * ((Math.pow(1 + r, months) - 1) / r) : monthly * months;
    const invested = monthly * months;
    const gain = fv - invested;

    const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

    return (
        <div className="glass section-card" style={{ marginTop: "2rem" }}>
            <h3 className="section-title"><span>🧮</span> SIP / Savings Calculator</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                {/* Inputs */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {[
                        { label: "Monthly Investment", value: monthly, set: setMonthly, min: 100, max: 100000, step: 100, unit: "₹" },
                        { label: "Annual Return (%)", value: rate, set: setRate, min: 1, max: 30, step: 0.5, unit: "%" },
                        { label: "Time Period (years)", value: years, set: setYears, min: 1, max: 40, step: 1, unit: "yrs" },
                    ].map(field => (
                        <div key={field.label}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                                <label className="form-label" style={{ margin: 0 }}>{field.label}</label>
                                <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.9rem" }}>
                                    {field.unit === "₹" ? "₹" : ""}{field.value.toLocaleString("en-IN")}{field.unit !== "₹" ? " " + field.unit : ""}
                                </span>
                            </div>
                            <input type="range" min={field.min} max={field.max} step={field.step}
                                value={field.value} onChange={e => field.set(Number(e.target.value))}
                                style={{ width: "100%", accentColor: "var(--primary)" }}
                            />
                        </div>
                    ))}
                </div>

                {/* Result */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", justifyContent: "center" }}>
                    {[
                        { label: "Total Invested", value: fmt(invested), color: "#60a5fa" },
                        { label: "Estimated Returns", value: fmt(gain), color: "#34d399" },
                        { label: "Final Corpus", value: fmt(fv), color: "var(--primary)", big: true },
                    ].map(r => (
                        <div key={r.label} style={{
                            padding: "1rem 1.25rem", borderRadius: "0.75rem",
                            background: r.big ? "rgba(236,72,153,0.15)" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${r.color}33`,
                        }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{r.label}</div>
                            <div style={{ fontSize: r.big ? "1.6rem" : "1.2rem", fontWeight: 800, color: r.color }}>{r.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Main Page ───────────────────────────────────────── */
function Tips() {
    const [activeTab, setActiveTab] = useState("Saving");
    const [doneChallenge, setDoneChallenge] = useState({});

    const tabs = Object.keys(TIPS);

    return (
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
            {/* Header */}
            <div className="anim-fade-up" style={{ marginBottom: "2.75rem" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "0.6rem" }}>
                    ✦ Financial Wisdom
                </p>
                <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "0.85rem" }}>
                    Tips &amp; <span className="gradient-text">Insights</span>
                </h1>
                <p style={{ color: "var(--muted)", fontSize: "1rem", lineHeight: 1.8, maxWidth: "580px" }}>
                    Actionable money tips, interactive savings calculator, and 30-day spending challenges to transform your financial habits.
                </p>
            </div>

            {/* ── Tab Navigation ────────────────────────── */}
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "2rem", background: "rgba(255,255,255,0.04)", padding: "0.35rem", borderRadius: "0.8rem", border: "1px solid var(--glass-border)", width: "fit-content" }}>
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        padding: "0.55rem 1.3rem", borderRadius: "0.55rem", border: "none",
                        fontWeight: 600, fontSize: "0.88rem", cursor: "pointer",
                        background: activeTab === tab ? "linear-gradient(135deg, var(--primary), var(--secondary))" : "transparent",
                        color: activeTab === tab ? "#fff" : "var(--muted)",
                        transition: "all 0.25s", boxShadow: activeTab === tab ? "0 4px 12px rgba(236,72,153,0.35)" : "none",
                    }}>
                        {tab === "Saving" ? "💰" : tab === "Budgeting" ? "📊" : "📈"} {tab}
                    </button>
                ))}
            </div>

            {/* ── Flip Cards Grid ────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.1rem" }}>
                {TIPS[activeTab].map((tip, i) => <TipCard key={tip.title} tip={tip} index={i} />)}
            </div>

            {/* ── Savings Calculator ─────────────────────── */}
            <SavingsCalc />

            {/* ── 30-Day Challenges ─────────────────────── */}
            <div style={{ marginTop: "3rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                    🏆 30-Day Spending Challenges
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                    Pick a weekly challenge and tick it off when done. Small wins build big habits.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1rem" }}>
                    {CHALLENGES.map((ch, i) => (
                        <div
                            key={ch.title}
                            onClick={() => setDoneChallenge(d => ({ ...d, [i]: !d[i] }))}
                            className="glass anim-fade-up"
                            style={{
                                animationDelay: `${i * 0.08}s`,
                                padding: "1.4rem", borderRadius: "1rem", cursor: "pointer",
                                borderColor: doneChallenge[i] ? ch.color + "66" : "var(--glass-border)",
                                background: doneChallenge[i] ? ch.color + "11" : "var(--glass-bg)",
                                transition: "all 0.3s",
                                transform: doneChallenge[i] ? "scale(0.97)" : "scale(1)",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                                <span style={{ fontSize: "1.6rem" }}>{doneChallenge[i] ? "✅" : ch.icon}</span>
                                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: ch.color, padding: "0.15rem 0.5rem", background: ch.color + "18", borderRadius: "999px" }}>{ch.day}</span>
                            </div>
                            <div style={{ fontWeight: 700, marginBottom: "0.35rem", textDecoration: doneChallenge[i] ? "line-through" : "none", opacity: doneChallenge[i] ? 0.6 : 1 }}>
                                {ch.title}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.6 }}>{ch.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Tips;
