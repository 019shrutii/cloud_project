import React, { useState } from "react";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function BudgetTracker({ totalSpent }) {
    const STORAGE_KEY = "spendwise_budget";
    const [budget, setBudget] = useState(() => Number(localStorage.getItem(STORAGE_KEY)) || 10000);
    const [editing, setEditing] = useState(false);
    const [inputVal, setInputVal] = useState(budget);

    const percent = Math.min((totalSpent / budget) * 100, 100);
    const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

    const colorByPercent =
        percent >= 90 ? "#ec4899" : // Pink for high usage
            percent >= 70 ? "#64748b" : // Grey for warning
                "#3b82f6"; // Blue for healthy usage

    const saveBudget = () => {
        const v = Math.max(1, Number(inputVal));
        setBudget(v);
        localStorage.setItem(STORAGE_KEY, v);
        setEditing(false);
    };

    const remaining = budget - totalSpent;
    const isOver = remaining < 0;

    return (
        <div className="glass section-card">
            <h3 className="section-title"><span>🎯</span> Monthly Budget</h3>

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                {/* SVG Ring */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                    <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
                        {/* Track */}
                        <circle
                            cx="65" cy="65" r={RADIUS}
                            fill="none"
                            stroke="rgba(255,255,255,0.07)"
                            strokeWidth="10"
                        />
                        {/* Progress */}
                        <circle
                            cx="65" cy="65" r={RADIUS}
                            fill="none"
                            stroke={colorByPercent}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={offset}
                            style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }}
                        />
                    </svg>
                    {/* Center text */}
                    <div style={{
                        position: "absolute", top: "50%", left: "50%",
                        transform: "translate(-50%,-50%)",
                        textAlign: "center",
                    }}>
                        <div style={{ fontSize: "1.4rem", fontWeight: 800, color: colorByPercent, lineHeight: 1 }}>
                            {Math.round(percent)}%
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "var(--muted)", fontWeight: 600 }}>USED</div>
                    </div>
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: "140px", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                    <div>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Spent</div>
                        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ec4899" }}>₹{totalSpent.toLocaleString("en-IN")}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            {isOver ? "Over Budget" : "Remaining"}
                        </div>
                        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: isOver ? "#ec4899" : "#3b82f6" }}>
                            {isOver ? "-" : ""}₹{Math.abs(remaining).toLocaleString("en-IN")}
                        </div>
                    </div>

                    {/* Budget edit */}
                    {editing ? (
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                            <input
                                type="number"
                                value={inputVal}
                                onChange={e => setInputVal(e.target.value)}
                                className="input-field"
                                style={{ padding: "0.35rem 0.6rem", fontSize: "0.85rem" }}
                                autoFocus
                                onKeyDown={e => e.key === "Enter" && saveBudget()}
                            />
                            <button onClick={saveBudget} className="btn-primary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>✓</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            className="btn-ghost"
                            style={{ fontSize: "0.78rem", padding: "0.3rem 0.75rem", width: "fit-content" }}
                        >
                            ✏️ Budget: ₹{budget.toLocaleString("en-IN")}
                        </button>
                    )}
                </div>
            </div>

            {/* Burn status */}
            {percent >= 90 && (
                <div style={{
                    marginTop: "1rem", padding: "0.65rem 1rem",
                    background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.3)",
                    borderRadius: "0.6rem", fontSize: "0.82rem", color: "#ec4899",
                    display: "flex", alignItems: "center", gap: "0.5rem"
                }}>
                    ⚠️ {isOver ? "You have exceeded your budget!" : "Warning: You're almost out of budget!"}
                </div>
            )}
        </div>
    );
}

export default BudgetTracker;
