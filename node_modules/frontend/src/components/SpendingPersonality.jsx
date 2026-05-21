import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS, RadialLinearScale, PointElement,
    LineElement, Filler, Tooltip, Legend
} from "chart.js";
import { Radar } from "react-chartjs-2";
import api from "../services/api";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Map category → dimension index (0-5)
const CAT_DIM = {
    Food: 0, Transport: 1, Shopping: 2,
    Health: 3, Education: 4, Entertainment: 5,
    Bills: 2, Other: 5,
};

const DIMS = ["🍔 Food", "🚌 Mobility", "🛍️ Lifestyle", "💚 Wellness", "📚 Knowledge", "🎭 Social"];

const PERSONALITIES = [
    { type: "The Foodie", emoji: "🍔", color: "#ec4899", threshold: 0, dim: 0, tip: "You invest in great meals. Try meal prepping 2x/week to save 30% on food costs." }, // Pink
    { type: "The Wanderer", emoji: "🚌", color: "#3b82f6", threshold: 0, dim: 1, tip: "Adventure fuels you. Try a monthly travel budget envelope to keep exploring guilt-free." }, // Blue
    { type: "The Shopaholic", emoji: "🛍️", color: "#ec4899", threshold: 0, dim: 2, tip: "Style is your thing. The 30-wears rule — only buy if you'll wear it 30+ times." }, // Pink
    { type: "The Health Nut", emoji: "💚", color: "#3b82f6", threshold: 0, dim: 3, tip: "Investing in health pays the best dividends. Look for group memberships to reduce costs." }, // Blue
    { type: "The Scholar", emoji: "📚", color: "#64748b", threshold: 0, dim: 4, tip: "Knowledge is your priority. Check if your employer offers a learning stipend." }, // Grey
    { type: "The Socialite", emoji: "🎭", color: "#ec4899", threshold: 0, dim: 5, tip: "You thrive on experiences. Host potluck dinners to keep the social life without the bill." }, // Pink
    { type: "The Minimalist", emoji: "🧘", color: "#64748b", threshold: -1, dim: -1, tip: "Balanced spending across all areas. You're a financial zen master." }, // Grey
];

function SpendingPersonality({ refreshTrigger }) {
    const [dims, setDims] = useState([0, 0, 0, 0, 0, 0]);
    const [personality, setPersonality] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await api.get("/expenses");
                const expenses = res.data;
                const grand = expenses.reduce((s, e) => s + e.amount, 0);

                const buckets = [0, 0, 0, 0, 0, 0];
                expenses.forEach(e => {
                    const idx = CAT_DIM[e.category] ?? 5;
                    buckets[idx] += e.amount;
                });

                const pcts = buckets.map(v => grand > 0 ? Math.round((v / grand) * 100) : 0);
                setDims(pcts);

                // Pick personality by dominant dimension
                const maxIdx = pcts.indexOf(Math.max(...pcts));
                const maxPct = pcts[maxIdx];
                if (maxPct < 20) {
                    setPersonality(PERSONALITIES[6]); // minimalist
                } else {
                    setPersonality(PERSONALITIES[maxIdx] || PERSONALITIES[6]);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [refreshTrigger]);

    const chartData = {
        labels: DIMS,
        datasets: [{
            label: "Your Spending DNA",
            data: dims,
            backgroundColor: "rgba(236, 72, 153, 0.18)",
            borderColor: "var(--primary)",
            borderWidth: 2,
            pointBackgroundColor: "var(--primary)",
            pointRadius: 5,
            pointHoverRadius: 7,
        }],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: { label: ctx => ` ${ctx.raw}% of spending` }
            }
        },
        scales: {
            r: {
                min: 0, max: 100,
                ticks: { display: false },
                grid: { color: "rgba(0,0,0,0.08)" },
                pointLabels: { color: "var(--muted)", font: { family: "Inter", size: 11 } },
                angleLines: { color: "rgba(0,0,0,0.07)" },
            }
        }
    };

    return (
        <div className="glass section-card" style={{
            background: personality ? `linear-gradient(135deg, ${personality.color}0a, transparent)` : undefined,
            borderColor: personality ? personality.color + "33" : undefined,
        }}>
            <h3 className="section-title"><span>🧠</span> Spending Personality</h3>

            {loading ? (
                <div className="shimmer" style={{ height: "220px" }} />
            ) : dims.every(d => d === 0) ? (
                <div style={{ textAlign: "center", padding: "2.5rem", color: "var(--muted)" }}>
                    <p style={{ fontSize: "2rem" }}>🧠</p>
                    <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>Add expenses to reveal your spending personality.</p>
                </div>
            ) : (
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
                    {/* Radar Chart */}
                    <div style={{ width: "200px", height: "200px", flexShrink: 0 }}>
                        <Radar data={chartData} options={chartOptions} />
                    </div>

                    {/* Personality Card */}
                    {personality && (
                        <div style={{ flex: 1, minWidth: "180px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem" }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: "50%", fontSize: "1.6rem",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    background: personality.color + "22", border: `2px solid ${personality.color}55`,
                                    animation: "floatY 3s ease-in-out infinite",
                                }}>
                                    {personality.emoji}
                                </div>
                                <div>
                                    <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>You are</div>
                                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: personality.color }}>{personality.type}</div>
                                </div>
                            </div>

                            {/* Dim bars */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "0.85rem" }}>
                                {DIMS.map((label, i) => (
                                    dims[i] > 0 && (
                                        <div key={label}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "2px" }}>
                                                <span>{label}</span><span>{dims[i]}%</span>
                                            </div>
                                            <div style={{ height: "5px", background: "rgba(0,0,0,0.07)", borderRadius: "3px" }}>
                                                <div style={{
                                                    height: "100%", borderRadius: "3px",
                                                    width: dims[i] + "%",
                                                    background: PERSONALITIES[i]?.color || "var(--primary)",
                                                    transition: "width 1s ease",
                                                }} />
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>

                            <div style={{
                                padding: "0.75rem", borderRadius: "0.6rem",
                                background: personality.color + "12",
                                border: `1px solid ${personality.color}30`,
                                fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.6,
                            }}>
                                💡 {personality.tip}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SpendingPersonality;
