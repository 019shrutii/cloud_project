import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";

function AnimatedNumber({ target, prefix = "", suffix = "", duration = 1200 }) {
    const [val, setVal] = useState(0);
    const startRef = useRef(null);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (target === 0) { setVal(0); return; }
        startRef.current = performance.now();
        const tick = (now) => {
            const elapsed = now - startRef.current;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setVal(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [target, duration]);
    /* eslint-enable react-hooks/set-state-in-effect */

    return <>{prefix}{val.toLocaleString("en-IN")}{suffix}</>;
}

const STAT_CONFIG = [
    {
        key: "total",
        icon: "💸",
        label: "Total Spent",
        color: "#ec4899", // Pink
        glow: "rgba(236,72,153,0.25)",
        prefix: "₹",
    },
    {
        key: "count",
        icon: "🧾",
        label: "Transactions",
        color: "#3b82f6", // Blue
        glow: "rgba(59,130,246,0.25)",
        suffix: " txns",
    },
    {
        key: "avg",
        icon: "📈",
        label: "Avg per Expense",
        color: "#64748b", // Grey
        glow: "rgba(100,116,139,0.25)",
        prefix: "₹",
    },
    {
        key: "topCategory",
        icon: "🏆",
        label: "Top Category",
        color: "#ec4899", // Pink
        glow: "rgba(236,72,153,0.25)",
        isText: true,
    },
];

function DashboardStats({ refreshTrigger }) {
    const [stats, setStats] = useState({ total: 0, count: 0, avg: 0, topCategory: "—" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const res = await api.get("/expenses");
                const expenses = res.data;
                const total = expenses.reduce((s, e) => s + e.amount, 0);
                const count = expenses.length;
                const avg = count > 0 ? Math.round(total / count) : 0;

                // top category
                const catMap = {};
                expenses.forEach((e) => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; });
                const topCategory = Object.keys(catMap).length
                    ? Object.entries(catMap).sort((a, b) => b[1] - a[1])[0][0]
                    : "—";

                setStats({ total, count, avg, topCategory });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [refreshTrigger]);

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            marginBottom: "1.75rem",
        }}>
            {STAT_CONFIG.map((s, i) => (
                <div
                    key={s.key}
                    className="glass anim-fade-up"
                    style={{
                        animationDelay: `${i * 0.08}s`,
                        padding: "1.4rem 1.25rem",
                        borderRadius: "1rem",
                        borderColor: s.color + "44",
                        transition: "transform 0.25s, box-shadow 0.25s",
                        cursor: "default",
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow = `0 16px 32px ${s.glow}`;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = "";
                        e.currentTarget.style.boxShadow = "";
                    }}
                >
                    <div style={{ fontSize: "1.75rem", marginBottom: "0.6rem" }}>{s.icon}</div>
                    <div style={{
                        fontSize: s.isText ? "1.3rem" : "1.8rem",
                        fontWeight: 800,
                        color: s.color,
                        lineHeight: 1.1,
                        marginBottom: "0.3rem",
                    }}>
                        {loading ? (
                            <div className="shimmer" style={{ height: "28px", width: "80%", borderRadius: "6px" }} />
                        ) : s.isText ? (
                            stats[s.key]
                        ) : (
                            <AnimatedNumber
                                target={stats[s.key]}
                                prefix={s.prefix || ""}
                                suffix={s.suffix || ""}
                            />
                        )}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {s.label}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DashboardStats;
