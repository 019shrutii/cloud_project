import React, { useEffect, useState } from "react";
import api from "../services/api";

const BADGES = [
    {
        id: "first_expense",
        icon: "🚀", title: "First Step",
        desc: "Logged your very first expense",
        color: "#3b82f6", // Blue
        check: ({ count }) => count >= 1,
    },
    {
        id: "five_expenses",
        icon: "🔥", title: "On Fire",
        desc: "Logged 5 or more expenses",
        color: "#ec4899", // Pink
        check: ({ count }) => count >= 5,
    },
    {
        id: "ten_expenses",
        icon: "🏅", title: "Habit Formed",
        desc: "Logged 10+ expenses — you're a tracker now",
        color: "#64748b", // Grey
        check: ({ count }) => count >= 10,
    },
    {
        id: "fifty_expenses",
        icon: "💎", title: "Diamond Tracker",
        desc: "50+ expenses logged — elite level",
        color: "#3b82f6", // Blue
        check: ({ count }) => count >= 50,
    },
    {
        id: "category_explorer",
        icon: "🗺️", title: "Category Explorer",
        desc: "Spent across 5 or more categories",
        color: "#ec4899", // Pink
        check: ({ categories }) => categories >= 5,
    },
    {
        id: "big_spender",
        icon: "💸", title: "Big Spender",
        desc: "Total spending exceeded ₹10,000",
        color: "#3b82f6", // Blue
        check: ({ total }) => total >= 10000,
    },
    {
        id: "high_roller",
        icon: "🎰", title: "High Roller",
        desc: "Total spending exceeded ₹1,00,000",
        color: "#ec4899", // Pink
        check: ({ total }) => total >= 100000,
    },
    {
        id: "diversified",
        icon: "🌈", title: "Diversified",
        desc: "No single category exceeds 40% of spending",
        color: "#64748b", // Grey
        check: ({ topPct }) => topPct <= 40,
    },
];

function AchievementBadges({ refreshTrigger }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [revealed, setRevealed] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await api.get("/expenses");
                const expenses = res.data;
                const total = expenses.reduce((s, e) => s + e.amount, 0);
                const count = expenses.length;
                const catMap = {};
                expenses.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; });
                const categories = Object.keys(catMap).length;
                const topPct = total > 0 ? Math.round((Math.max(...Object.values(catMap), 0) / total) * 100) : 0;
                setStats({ total, count, categories, topPct });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [refreshTrigger]);

    const earned = stats ? BADGES.filter(b => b.check(stats)) : [];
    const locked = stats ? BADGES.filter(b => !b.check(stats)) : BADGES;

    return (
        <div className="glass section-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <h3 className="section-title" style={{ margin: 0 }}><span>🏆</span> Achievements</h3>
                {!loading && (
                    <span style={{
                        fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.65rem",
                        borderRadius: "999px", background: "rgba(59,130,246,0.1)",
                        color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)",
                    }}>
                        {earned.length}/{BADGES.length} unlocked
                    </span>
                )}
            </div>

            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                    {[1, 2, 3, 4].map(i => <div key={i} className="shimmer" style={{ height: "80px", borderRadius: "0.75rem" }} />)}
                </div>
            ) : (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "0.75rem" }}>
                        {/* Earned */}
                        {earned.map(badge => (
                            <div
                                key={badge.id}
                                onClick={() => setRevealed(revealed?.id === badge.id ? null : badge)}
                                style={{
                                    padding: "0.85rem 0.5rem",
                                    borderRadius: "0.85rem",
                                    background: badge.color + "15",
                                    border: `1px solid ${badge.color}44`,
                                    textAlign: "center", cursor: "pointer",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    animation: "fadeInUp 0.4s ease both",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.04)"; e.currentTarget.style.boxShadow = `0 8px 20px ${badge.color}33`; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                            >
                                <div style={{ fontSize: "1.75rem", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}>{badge.icon}</div>
                                <div style={{ fontSize: "0.62rem", fontWeight: 700, color: badge.color, marginTop: "0.3rem", lineHeight: 1.2 }}>{badge.title}</div>
                            </div>
                        ))}

                        {/* Locked */}
                        {locked.map(badge => (
                            <div
                                key={badge.id}
                                style={{
                                    padding: "0.85rem 0.5rem",
                                    borderRadius: "0.85rem",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    textAlign: "center", opacity: 0.45,
                                    cursor: "not-allowed",
                                }}
                            >
                                <div style={{ fontSize: "1.75rem", filter: "grayscale(1) blur(1px)" }}>{badge.icon}</div>
                                <div style={{ fontSize: "0.6rem", color: "var(--muted)", marginTop: "0.3rem" }}>🔒 Locked</div>
                            </div>
                        ))}
                    </div>

                    {/* Detail card on click */}
                    {revealed && (
                        <div style={{
                            marginTop: "1rem", padding: "0.85rem 1rem",
                            background: revealed.color + "12", border: `1px solid ${revealed.color}33`,
                            borderRadius: "0.75rem", display: "flex", alignItems: "center", gap: "0.85rem",
                            animation: "fadeInUp 0.3s ease both",
                        }}>
                            <span style={{ fontSize: "1.75rem" }}>{revealed.icon}</span>
                            <div>
                                <div style={{ fontWeight: 700, color: revealed.color }}>{revealed.title}</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{revealed.desc}</div>
                            </div>
                        </div>
                    )}

                    {earned.length === 0 && (
                        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                            Add your first expense to start earning badges! 🚀
                        </p>
                    )}
                </>
            )}
        </div>
    );
}

export default AchievementBadges;
