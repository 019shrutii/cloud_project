import React, { useState, useEffect } from "react";
import DashboardStats from "../components/DashboardStats";
import BudgetTracker from "../components/BudgetTracker";
import QuoteWidget from "../components/QuoteWidget";
import SpendingPersonality from "../components/SpendingPersonality";
import HeatmapCalendar from "../components/HeatmapCalendar";
import AchievementBadges from "../components/AchievementBadges";
import AddExpense from "../components/AddExpense";
import ExpenseList from "../components/ExpenseList";
import ExpenseAnalysis from "../components/ExpenseAnalysis";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [refresh, setRefresh] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const triggerRefresh = () => setRefresh(r => r + 1);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="dashboard-page">
            {/* Header */}
            <div className="anim-fade-up" style={{ marginBottom: "0.25rem" }}>
                <h1 className="dashboard-title gradient-text">My Dashboard</h1>
                <p className="dashboard-sub">Track, manage and analyze all your expenses in one place.</p>
            </div>

            {/* Quote */}
            <QuoteWidget />

            {/* Stat Cards */}
            <DashboardStats refreshTrigger={refresh} />

            {/* ── Row 1: Budget + Add Expense ─────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                <div className="anim-fade-up stagger-1"><BudgetTracker totalSpent={totalSpent} /></div>
                <div className="anim-fade-up stagger-2"><AddExpense onExpenseAdded={triggerRefresh} /></div>
            </div>

            {/* ── Row 2: Spending Personality + Heatmap ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                <div className="anim-fade-up stagger-1"><SpendingPersonality refreshTrigger={refresh} /></div>
                <div className="anim-fade-up stagger-2"><HeatmapCalendar refreshTrigger={refresh} /></div>
            </div>

            {/* ── Achievement Badges (full width) ─────── */}
            <div className="anim-fade-up stagger-3" style={{ marginBottom: "1.5rem" }}>
                <AchievementBadges refreshTrigger={refresh} />
            </div>

            {/* ── Analysis Chart ───────────────────────── */}
            <div className="anim-fade-up stagger-3" style={{ marginBottom: "1.5rem" }}>
                <ExpenseAnalysis refreshTrigger={refresh} />
            </div>

            {/* ── Expense Table ────────────────────────── */}
            <div className="anim-fade-up stagger-4">
                <ExpenseList refreshTrigger={refresh} onTotalChange={setTotalSpent} />
            </div>
        </div>
    );
}

export default Dashboard;