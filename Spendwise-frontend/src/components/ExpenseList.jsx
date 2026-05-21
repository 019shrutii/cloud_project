import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const CATEGORY_COLORS = {
    Food: "#ec4899", Transport: "#3b82f6", Shopping: "#ec4899",
    Bills: "#64748b", Health: "#3b82f6", Education: "#64748b",
    Entertainment: "#ec4899", Other: "#64748b"
};

function exportCSV(expenses) {
    const headers = ["Title", "Category", "Amount (₹)", "Date"];
    const rows = expenses.map(e => [
        `"${e.title}"`,
        e.category,
        e.amount,
        e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-IN") : "—"
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spendwise-expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function ExpenseList({ refreshTrigger, onTotalChange }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
    const [search, setSearch] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/expenses");
            setExpenses(res.data);
            if (onTotalChange) onTotalChange(res.data.reduce((s, e) => s + e.amount, 0));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [onTotalChange]);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { fetchExpenses(); }, [fetchExpenses, refreshTrigger]);

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete "${title}"?`)) return;
        setDeletingId(id);
        try {
            await api.delete(`/expenses/${id}`);
            toast.success("Expense deleted");
            const updated = expenses.filter(e => e._id !== id);
            setExpenses(updated);
            if (onTotalChange) onTotalChange(updated.reduce((s, e) => s + e.amount, 0));
        } catch (error) {
            toast.error("Failed to delete expense");
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    const categories = ["All", ...new Set(expenses.map(e => e.category))];

    const filtered = expenses
        .filter(e => filter === "All" || e.category === filter)
        .filter(e =>
            search.trim() === "" ||
            e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.category.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === "highest") return b.amount - a.amount;
            if (sortBy === "lowest") return a.amount - b.amount;
            return 0;
        });

    const total = filtered.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="glass section-card" style={{ gridColumn: "1 / -1" }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <h3 className="section-title" style={{ margin: 0 }}>
                    <span>📋</span> Expense History
                </h3>
                <button
                    onClick={() => exportCSV(filtered)}
                    className="btn-ghost"
                    style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
                    title="Download filtered expenses as CSV"
                >
                    ⬇️ Export CSV
                </button>
            </div>

            {/* Search + Filter + Sort controls */}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                <div style={{ position: "relative", flex: "1 1 180px" }}>
                    <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search expenses…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: "2.25rem" }}
                    />
                </div>
                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="input-field"
                    style={{ width: "auto", padding: "0.4rem 0.75rem", fontSize: "0.82rem", flex: "0 0 auto" }}
                >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="input-field"
                    style={{ width: "auto", padding: "0.4rem 0.75rem", fontSize: "0.82rem", flex: "0 0 auto" }}
                >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="highest">Highest amount</option>
                    <option value="lowest">Lowest amount</option>
                </select>
            </div>

            {loading ? (
                <div>{[1, 2, 3, 4].map(i => (
                    <div key={i} className="shimmer" style={{ height: "48px", marginBottom: "0.5rem" }} />
                ))}</div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
                    <p style={{ fontSize: "2.5rem" }}>{search ? "🔎" : "🧾"}</p>
                    <p style={{ marginTop: "0.5rem" }}>
                        {search ? `No results for "${search}"` : "No expenses yet. Add your first one!"}
                    </p>
                    {search && (
                        <button onClick={() => setSearch("")} className="btn-ghost" style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
                            Clear search
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div style={{ overflowX: "auto" }}>
                        <table className="expense-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((exp, i) => (
                                    <tr key={exp._id} className="anim-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                                        <td style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{i + 1}</td>
                                        <td style={{ fontWeight: 500 }}>{exp.title}</td>
                                        <td>
                                            <span className="badge" style={{
                                                background: `${CATEGORY_COLORS[exp.category] || "#94a3b8"}22`,
                                                color: CATEGORY_COLORS[exp.category] || "#94a3b8",
                                                borderColor: `${CATEGORY_COLORS[exp.category] || "#94a3b8"}44`
                                            }}>
                                                {exp.category}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 700, color: "var(--primary)" }}>₹{exp.amount.toLocaleString("en-IN")}</td>
                                        <td style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
                                            {exp.createdAt
                                                ? new Date(exp.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                                : "—"}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(exp._id, exp.title)}
                                                className="btn-danger"
                                                disabled={deletingId === exp._id}
                                                style={{ opacity: deletingId === exp._id ? 0.6 : 1, padding: '0.4rem 0.6rem' }}
                                            >
                                                {deletingId === exp._id ? "…" : "🗑️"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        paddingTop: "1rem", marginTop: "0.5rem",
                        borderTop: "1px solid var(--glass-border)",
                        flexWrap: "wrap", gap: "0.5rem"
                    }}>
                        <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
                            Showing {filtered.length} of {expenses.length} expenses
                        </span>
                        <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--primary)" }}>
                            Total: ₹{total.toLocaleString("en-IN")}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}

export default ExpenseList;