import React, { useEffect, useState } from "react";
import api from "../services/api";

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay(); // 0=Sun
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function getColor(amount, max) {
    if (amount === 0) return "rgba(255,255,255,0.04)";
    const intensity = Math.min(amount / (max || 1), 1);
    if (intensity < 0.25) return "rgba(236,72,153,0.2)";
    if (intensity < 0.5) return "rgba(236,72,153,0.45)";
    if (intensity < 0.75) return "rgba(236,72,153,0.7)";
    return "#ec4899";
}

function HeatmapCalendar({ refreshTrigger }) {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());
    const [dailyMap, setDailyMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [hoveredDay, setHoveredDay] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await api.get("/expenses");
                const map = {};
                res.data.forEach(e => {
                    const d = new Date(e.createdAt || e.date);
                    if (!isNaN(d)) {
                        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                        map[key] = (map[key] || 0) + e.amount;
                    }
                });
                setDailyMap(map);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [refreshTrigger]);

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    // Compute max for current displayed month
    let monthMax = 1;
    for (let d = 1; d <= daysInMonth; d++) {
        const key = `${year}-${month}-${d}`;
        const v = dailyMap[key] || 0;
        if (v > monthMax) monthMax = v;
    }

    const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
    const nextMonth = () => {
        const next = new Date(year, month + 1);
        if (next <= now) { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); }
    };
    const isNextDisabled = new Date(year, month + 1) > now;

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

    return (
        <div className="glass section-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <h3 className="section-title" style={{ margin: 0 }}><span>📅</span> Spending Heatmap</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button onClick={prevMonth} className="btn-ghost" style={{ padding: "0.25rem 0.6rem", fontSize: "0.85rem" }}>←</button>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, minWidth: "90px", textAlign: "center" }}>
                        {MONTHS[month]} {year}
                    </span>
                    <button onClick={nextMonth} className="btn-ghost" style={{ padding: "0.25rem 0.6rem", fontSize: "0.85rem", opacity: isNextDisabled ? 0.35 : 1 }} disabled={isNextDisabled}>→</button>
                </div>
            </div>

            {loading ? (
                <div className="shimmer" style={{ height: "160px" }} />
            ) : (
                <>
                    {/* Day labels */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "4px" }}>
                        {DAYS.map((d, i) => (
                            <div key={i} style={{ textAlign: "center", fontSize: "0.65rem", color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>{d}</div>
                        ))}
                    </div>

                    {/* Calendar cells */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
                        {cells.map((day, i) => {
                            if (day === null) return <div key={`e${i}`} />;
                            const key = `${year}-${month}-${day}`;
                            const amount = dailyMap[key] || 0;
                            const color = getColor(amount, monthMax);
                            const isToday = key === todayKey;
                            return (
                                <div
                                    key={key}
                                    onMouseEnter={() => setHoveredDay({ day, amount })}
                                    onMouseLeave={() => setHoveredDay(null)}
                                    style={{
                                        aspectRatio: "1", borderRadius: "4px",
                                        background: color,
                                        border: isToday ? "2px solid var(--primary)" : "1px solid rgba(255,255,255,0.04)",
                                        cursor: amount > 0 ? "pointer" : "default",
                                        transition: "transform 0.15s, box-shadow 0.15s",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "0.6rem", color: amount > 0 ? "#fff" : "rgba(255,255,255,0.2)",
                                        fontWeight: 600,
                                        position: "relative",
                                    }}
                                    title={amount > 0 ? `${day} ${MONTHS[month]}: ₹${amount.toLocaleString("en-IN")}` : `${day} ${MONTHS[month]}`}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "1rem", justifyContent: "flex-end" }}>
                        <span style={{ fontSize: "0.65rem", color: "var(--muted)" }}>Less</span>
                        {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
                            <div key={i} style={{ width: 12, height: 12, borderRadius: "3px", background: getColor(v * monthMax, monthMax) }} />
                        ))}
                        <span style={{ fontSize: "0.65rem", color: "var(--muted)" }}>More</span>
                    </div>

                    {/* Hover tooltip */}
                    {hoveredDay && hoveredDay.amount > 0 && (
                        <div style={{
                            marginTop: "0.75rem", padding: "0.5rem 0.85rem",
                            background: "rgba(236,72,153,0.1)", borderRadius: "0.5rem",
                            border: "1px solid rgba(236,72,153,0.2)",
                            fontSize: "0.82rem", color: "var(--primary)", fontWeight: 600,
                            textAlign: "center",
                        }}>
                            {hoveredDay.day} {MONTHS[month]}: spent ₹{hoveredDay.amount.toLocaleString("en-IN")}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default HeatmapCalendar;
