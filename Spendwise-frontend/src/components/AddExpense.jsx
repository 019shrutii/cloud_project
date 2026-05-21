import React, { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Health", "Education", "Entertainment", "Other"];

function AddExpense({ onExpenseAdded }) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/expenses", { title, amount: Number(amount), category });
            toast.success(`"${title}" added successfully!`);
            setTitle(""); setAmount(""); setCategory("");
            if (onExpenseAdded) onExpenseAdded();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add expense. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass section-card">
            <h3 className="section-title">
                <span>➕</span> Add Expense
            </h3>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-item">
                    <label className="form-label">Title</label>
                    <input
                        id="expense-title"
                        type="text"
                        placeholder="e.g. Dinner at cafe"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div className="form-item">
                    <label className="form-label">Amount (₹)</label>
                    <input
                        id="expense-amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="input-field"
                        min="1"
                        required
                    />
                </div>

                <div className="form-item">
                    <label className="form-label">Category</label>
                    <select
                        id="expense-category"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="input-field"
                        required
                        style={{ cursor: "pointer" }}
                    >
                        <option value="" disabled>Select a category…</option>
                        {CATEGORIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <button
                    id="expense-submit"
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ marginTop: "0.25rem", opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? "Adding…" : "Add Expense 💸"}
                </button>
            </form>
        </div>
    );
}

export default AddExpense;