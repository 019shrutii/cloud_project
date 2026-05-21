import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Reports() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchExpenses = async () => {
        try {
            const res = await api.get("/expenses");
            setExpenses(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        fetchExpenses();
    }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    // --- BASIC DATA CALCULATION (Beginner Friendly) ---

    // 1. Calculate Category Totals for Pie Chart
    const categoryTotals = {};
    expenses.forEach((item) => {
        categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });

    const pieData = {
        labels: Object.keys(categoryTotals),
        datasets: [
            {
                label: "Spending by Category",
                data: Object.values(categoryTotals),
                backgroundColor: [
                    "rgba(236, 72, 153, 0.7)", // Pink
                    "rgba(59, 130, 246, 0.7)", // Blue
                    "rgba(100, 116, 139, 0.7)", // Grey
                    "rgba(244, 63, 94, 0.7)",  // Rose
                    "rgba(37, 99, 235, 0.7)",  // Dark Blue
                ],
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
            },
        ],
    };

    // 2. Calculate Monthly Totals for Bar Chart
    const monthlyTotals = {};
    expenses.forEach((item) => {
        const date = new Date(item.createdAt || item.date);
        const month = date.toLocaleString("default", { month: "short" }); // e.g., "Jan", "Feb"
        monthlyTotals[month] = (monthlyTotals[month] || 0) + item.amount;
    });

    const barData = {
        labels: Object.keys(monthlyTotals),
        datasets: [
            {
                label: "Monthly Spending (₹)",
                data: Object.values(monthlyTotals),
                backgroundColor: "rgba(236, 72, 153, 0.6)",
                borderRadius: 8,
            },
        ],
    };

    if (loading) return <div className="dashboard-page"><p>Loading reports...</p></div>;

    return (
        <div className="dashboard-page" style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <h1 className="dashboard-title gradient-text">Spending Reports</h1>
            <p className="dashboard-sub">Visual breakdown of your financial habits.</p>

            {expenses.length === 0 ? (
                <div className="glass section-card" style={{ textAlign: "center", padding: "3rem" }}>
                    <p>No data recorded yet. Add some expenses to see your reports! 💸</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>

                    {/* Pie Chart Card */}
                    <div className="glass section-card">
                        <h3 className="section-title"><span>🍕</span> Category Distribution</h3>
                        <div style={{ padding: "1rem", maxWidth: "400px", margin: "0 auto" }}>
                            <Pie data={pieData} />
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "1rem", textAlign: "center" }}>
                            Which categories demand most of your budget?
                        </p>
                    </div>

                    {/* Bar Chart Card */}
                    <div className="glass section-card">
                        <h3 className="section-title"><span>📊</span> Monthly Comparison</h3>
                        <div style={{ padding: "1rem" }}>
                            <Bar data={barData} options={{ responsive: true }} />
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "1rem", textAlign: "center" }}>
                            How does your spending change month over month?
                        </p>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Reports;
