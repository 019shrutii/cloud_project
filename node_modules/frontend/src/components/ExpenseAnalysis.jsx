import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement, Title
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import api from "../services/api";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const COLORS = ["#ec4899", "#3b82f6", "#64748b", "#fbcfe8", "#93c5fd", "#f43f5e", "#2563eb", "#475569"];

function ExpenseAnalysis({ refreshTrigger }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("doughnut");

    useEffect(() => {
        const fetchAnalysis = async () => {
            setLoading(true);
            try {
                const res = await api.get("/expenses/analysis");
                setData(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, [refreshTrigger]);

    const categories = data.map(e => e._id);
    const amounts = data.map(e => e.total);
    const total = amounts.reduce((s, a) => s + a, 0);

    const chartData = {
        labels: categories,
        datasets: [{
            label: "Spending (₹)",
            data: amounts,
            backgroundColor: COLORS.slice(0, categories.length).map(c => c + "cc"),
            borderColor: COLORS.slice(0, categories.length),
            borderWidth: 2,
            borderRadius: view === "bar" ? 6 : 0,
        }],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: "#ffffff", font: { family: "Inter", size: 12 } }
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => ` ₹${ctx.raw.toLocaleString()} (${((ctx.raw / total) * 100).toFixed(1)}%)`
                }
            }
        },
        ...(view === "bar" && {
            scales: {
                x: { ticks: { color: "#a3a3a3" }, grid: { color: "rgba(255,255,255,0.05)" } },
                y: { ticks: { color: "#a3a3a3", callback: v => `₹${v}` }, grid: { color: "rgba(255,255,255,0.05)" } }
            }
        })
    };

    return (
        <div className="glass section-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <h3 className="section-title" style={{ margin: 0 }}>
                    <span>📊</span> Spending Analysis
                </h3>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                    {["doughnut", "bar"].map(v => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            style={{
                                padding: "0.3rem 0.75rem", borderRadius: "0.5rem", border: "none",
                                fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                                background: view === v ? "linear-gradient(135deg, #ec4899, #3b82f6)" : "#262626",
                                color: view === v ? "#fff" : "#a3a3a3", transition: "all 0.2s"
                            }}
                        >
                            {v === "doughnut" ? "🥧 Donut" : "📊 Bar"}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div>
                    <div className="shimmer" style={{ height: "240px" }} />
                </div>
            ) : data.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
                    <p style={{ fontSize: "2.5rem" }}>📊</p>
                    <p style={{ marginTop: "0.5rem" }}>Add expenses to see your analysis.</p>
                </div>
            ) : (
                <>
                    <div style={{ maxHeight: "280px", display: "flex", justifyContent: "center" }}>
                        {view === "doughnut"
                            ? <Doughnut data={chartData} options={chartOptions} />
                            : <Bar data={chartData} options={chartOptions} />
                        }
                    </div>

                    {/* Category breakdown list */}
                    <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        {data.map((item, i) => {
                            const pct = total > 0 ? ((item.total / total) * 100).toFixed(1) : 0;
                            return (
                                <div key={item._id}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem", fontSize: "0.82rem" }}>
                                        <span style={{ fontWeight: 600 }}>{item._id}</span>
                                        <span style={{ color: "var(--muted)" }}>₹{item.total.toLocaleString()} ({pct}%)</span>
                                    </div>
                                    <div style={{ height: "6px", background: "rgba(255,255,255,0.07)", borderRadius: "3px" }}>
                                        <div style={{
                                            height: "100%", borderRadius: "3px",
                                            width: `${pct}%`,
                                            background: COLORS[i % COLORS.length],
                                            transition: "width 0.8s ease"
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ textAlign: "right", marginTop: "1rem", color: "var(--muted)", fontSize: "0.82rem" }}>
                        Total Tracked: <strong style={{ color: "var(--primary)" }}>₹{total.toLocaleString()}</strong>
                    </div>
                </>
            )}
        </div>
    );
}

export default ExpenseAnalysis;