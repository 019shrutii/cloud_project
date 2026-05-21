import React, { useState } from "react";

/* ─── EMI Calculator ─ */
function EMICalc() {
    const [principal, setPrincipal] = useState(500000);
    const [rate, setRate] = useState(10);
    const [tenure, setTenure] = useState(5);

    const r = rate / 100 / 12;
    const n = tenure * 12;
    const emi = r > 0 ? (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : principal / n;
    const totalPay = emi * n;
    const interest = totalPay - principal;
    const pct = Math.round((principal / totalPay) * 100);

    const fmt = (v) => "₹" + Math.round(v).toLocaleString("en-IN");

    return (
        <div className="glass section-card">
            <h3 className="section-title"><span>🏦</span> EMI Calculator</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                    {[
                        { label: "Loan Amount", val: principal, set: setPrincipal, min: 10000, max: 10000000, step: 10000, unit: "₹" },
                        { label: "Interest Rate (%/yr)", val: rate, set: setRate, min: 1, max: 36, step: 0.5, unit: "%" },
                        { label: "Tenure (years)", val: tenure, set: setTenure, min: 1, max: 30, step: 1, unit: "yrs" },
                    ].map(f => (
                        <div key={f.label}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                                <label className="form-label" style={{ margin: 0 }}>{f.label}</label>
                                <span style={{ fontWeight: 700, color: "var(--secondary)", fontSize: "0.88rem" }}>
                                    {f.unit === "₹" ? fmt(f.val) : f.val + " " + f.unit}
                                </span>
                            </div>
                            <input type="range" min={f.min} max={f.max} step={f.step}
                                value={f.val} onChange={e => f.set(Number(e.target.value))}
                                style={{ width: "100%", accentColor: "var(--primary)" }} />
                        </div>
                    ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                    <div style={{ padding: "1.25rem", borderRadius: "0.85rem", background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Monthly EMI</div>
                        <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--primary)" }}>{fmt(emi)}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                        <div style={{ padding: "0.85rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)" }}>
                            <div style={{ fontSize: "0.65rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase" }}>Principal</div>
                            <div style={{ fontWeight: 800, color: "var(--secondary)", fontSize: "0.95rem" }}>{fmt(principal)}</div>
                        </div>
                        <div style={{ padding: "0.85rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)" }}>
                            <div style={{ fontSize: "0.65rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase" }}>Interest</div>
                            <div style={{ fontWeight: 800, color: "#f87171", fontSize: "0.95rem" }}>{fmt(interest)}</div>
                        </div>
                    </div>
                    {/* Progress bar: principal vs interest */}
                    <div>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.4rem" }}>Principal vs Interest breakdown</div>
                        <div style={{ height: "10px", borderRadius: "5px", background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg, var(--secondary), var(--primary))", transition: "width 0.6s ease" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.3rem" }}>
                            <span style={{ color: "var(--secondary)" }}>Principal {pct}%</span>
                            <span style={{ color: "#f87171" }}>Interest {100 - pct}%</span>
                        </div>
                    </div>
                    <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "0.6rem", fontSize: "0.82rem", color: "var(--muted)" }}>
                        Total Repayable: <strong style={{ color: "var(--text)" }}>{fmt(totalPay)}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── 50-30-20 Rule ─ */
function Rule503020() {
    const [income, setIncome] = useState(50000);
    const needs = Math.round(income * 0.5);
    const wants = Math.round(income * 0.3);
    const savings = Math.round(income * 0.2);
    const fmt = (v) => "₹" + v.toLocaleString("en-IN");

    const SLICES = [
        { label: "Needs", pct: 50, color: "#60a5fa", icon: "🏠", examples: "Rent, Groceries, Bills, Transport" },
        { label: "Wants", pct: 30, color: "var(--primary)", icon: "🎮", examples: "Dining out, Shopping, Entertainment" },
        { label: "Savings", pct: 20, color: "#34d399", icon: "💰", examples: "Emergency fund, Investments, SIP" },
    ];

    return (
        <div className="glass section-card">
            <h3 className="section-title"><span>🎯</span> 50-30-20 Budget Rule</h3>
            <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <label className="form-label" style={{ margin: 0 }}>Monthly Income</label>
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>{fmt(income)}</span>
                </div>
                <input type="range" min={10000} max={500000} step={1000}
                    value={income} onChange={e => setIncome(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--primary)" }} />
            </div>

            {/* Stacked visual bar */}
            <div style={{ display: "flex", height: "18px", borderRadius: "9px", overflow: "hidden", marginBottom: "1.5rem", gap: "2px" }}>
                {SLICES.map(s => (
                    <div key={s.label} style={{
                        width: s.pct + "%", background: s.color,
                        transition: "width 0.4s ease", borderRadius: "2px"
                    }} />
                ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {SLICES.map(s => (
                    <div key={s.label} style={{
                        display: "flex", alignItems: "center", gap: "1rem",
                        padding: "0.9rem 1rem", borderRadius: "0.75rem",
                        background: s.color + "0f", border: `1px solid ${s.color}33`
                    }}>
                        <span style={{ fontSize: "1.4rem" }}>{s.icon}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: s.color }}>{s.label} ({s.pct}%)</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{s.examples}</div>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: "1.05rem", color: s.color }}>
                            {fmt(s.label === "Needs" ? needs : s.label === "Wants" ? wants : savings)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Goal Planner ─ */
function GoalPlanner() {
    const [goal, setGoal] = useState(200000);
    const [saved, setSaved] = useState(30000);
    const [monthly, setMonthly] = useState(10000);

    const remaining = Math.max(goal - saved, 0);
    const months = monthly > 0 ? Math.ceil(remaining / monthly) : 0;
    const years = Math.floor(months / 12);
    const rem = months % 12;
    const pct = Math.min(Math.round((saved / goal) * 100), 100);
    const fmt = (v) => "₹" + v.toLocaleString("en-IN");

    return (
        <div className="glass section-card">
            <h3 className="section-title"><span>🎪</span> Savings Goal Planner</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                {[
                    { label: "🏆 Goal Amount", val: goal, set: setGoal, min: 10000, max: 5000000, step: 5000 },
                    { label: "💼 Already Saved", val: saved, set: setSaved, min: 0, max: goal, step: 1000 },
                    { label: "📅 Monthly Contribution", val: monthly, set: setMonthly, min: 500, max: 100000, step: 500 },
                ].map(f => (
                    <div key={f.label}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                            <label className="form-label" style={{ margin: 0 }}>{f.label}</label>
                            <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.88rem" }}>{fmt(f.val)}</span>
                        </div>
                        <input type="range" min={f.min} max={f.max} step={f.step}
                            value={f.val} onChange={e => f.set(Number(e.target.value))}
                            style={{ width: "100%", accentColor: "var(--primary)" }} />
                    </div>
                ))}

                {/* Progress */}
                <div style={{ marginTop: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "0.5rem" }}>
                        <span style={{ color: "var(--muted)" }}>Progress</span>
                        <span style={{ fontWeight: 700, color: "#34d399" }}>{pct}%</span>
                    </div>
                    <div style={{ height: "12px", borderRadius: "6px", background: "rgba(255,255,255,0.07)" }}>
                        <div style={{
                            height: "100%", borderRadius: "6px",
                            width: pct + "%",
                            background: "linear-gradient(90deg, var(--secondary), var(--primary))",
                            transition: "width 0.7s ease",
                        }} />
                    </div>
                </div>

                <div style={{
                    padding: "1rem 1.25rem", borderRadius: "0.85rem",
                    background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)",
                    textAlign: "center"
                }}>
                    {remaining === 0 ? (
                        <span style={{ color: "#34d399", fontWeight: 800, fontSize: "1.1rem" }}>🎉 Goal Achieved!</span>
                    ) : (
                        <>
                            <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase" }}>Time to Goal</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#34d399" }}>
                                {years > 0 ? `${years}y ` : ""}{rem > 0 ? `${rem}m` : ""}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Remaining: {fmt(remaining)}</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Main Page ───────────────────────────────────────── */
function Calculator() {
    return (
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
            <div className="anim-fade-up" style={{ marginBottom: "2.75rem" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "0.6rem" }}>
                    ✦ Finance Tools
                </p>
                <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "0.85rem" }}>
                    Smart <span className="gradient-text">Calculators</span>
                </h1>
                <p style={{ color: "var(--muted)", fontSize: "1rem", lineHeight: 1.8, maxWidth: "580px" }}>
                    Interactive financial calculators with live sliders — plan your EMIs, split your income, and hit your savings goals.
                </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                <div className="anim-fade-up stagger-1"><EMICalc /></div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem" }}>
                    <div className="anim-fade-up stagger-2"><Rule503020 /></div>
                    <div className="anim-fade-up stagger-3"><GoalPlanner /></div>
                </div>
            </div>
        </div>
    );
}

export default Calculator;
