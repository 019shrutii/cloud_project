import React, { useState, useEffect } from "react";
import {
    FiPlus, FiTrendingUp, FiTrendingDown,
    FiPieChart, FiDollarSign, FiSearch,
    FiMoreHorizontal, FiDownload, FiFilter
} from "react-icons/fi";
import api from "../services/api";

function ModernDashboard() {
    const [expenses, setExpenses] = useState([]);
    const [stats, setStats] = useState({ total: 0, income: 62000, savingsRate: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/expenses");
                const data = res.data;
                setExpenses(data);

                const total = data.reduce((s, e) => s + e.amount, 0);
                const income = 62000; // Hardcoded for now or fetched from profile
                const savingsRate = income > 0 ? Math.round(((income - total) / income) * 100) : 0;

                setStats({ total, income, savingsRate });
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const SUMMARY_STATS = [
        { label: "Total Balance", value: `₹${(stats.income - stats.total).toLocaleString()}`, icon: <FiDollarSign />, trend: "+0%", isPositive: true },
        { label: "Monthly Income", value: `₹${stats.income.toLocaleString()}`, icon: <FiTrendingUp />, trend: "+0%", isPositive: true },
        { label: "Total Expenses", value: `₹${stats.total.toLocaleString()}`, icon: <FiTrendingDown />, trend: "+0%", isPositive: false },
        { label: "Savings Rate", value: `${stats.savingsRate}%`, icon: <FiPieChart />, trend: "+0%", isPositive: true },
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-pink-500/30">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-neutral-900 border-b border-neutral-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="text-2xl font-black tracking-tighter">
                        SPEND<span className="text-pink-500">WISE</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
                        <a href="#" className="text-white">Dashboard</a>
                        <a href="#" className="hover:text-white transition-colors">Expenses</a>
                        <a href="#" className="hover:text-white transition-colors">Budgets</a>
                        <a href="#" className="hover:text-white transition-colors">Analytics</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden lg:block">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-neutral-800 border border-neutral-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-pink-500 transition-colors w-64"
                            />
                        </div>
                        <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95">
                            <FiPlus /> New Entry
                        </button>
                        <div className="w-10 h-10 rounded-full border-2 border-neutral-700 bg-neutral-800 flex items-center justify-center text-pink-500 font-bold">
                            JD
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                        <p className="text-neutral-400 mt-1">Welcome back, here's what's happening with your money.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all">
                            <FiDownload /> Export
                        </button>
                        <button className="bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all">
                            <FiFilter /> Filter
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SUMMARY_STATS.map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-pink-500/30 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-neutral-800 rounded-xl text-neutral-400 group-hover:text-pink-500 transition-colors">
                                    {stat.icon}
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-neutral-400">{stat.label}</p>
                            <h2 className="text-2xl font-bold mt-1 tracking-tight text-pink-500">{stat.value}</h2>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Table Container */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
                                <h3 className="font-bold text-lg">Recent Transactions</h3>
                                <button className="text-sm text-pink-500 hover:underline font-semibold">View all</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-neutral-500 text-xs uppercase tracking-wider border-b border-neutral-800">
                                            <th className="px-6 py-4 font-semibold">Description</th>
                                            <th className="px-6 py-4 font-semibold">Category</th>
                                            <th className="px-6 py-4 font-semibold text-right">Amount</th>
                                            <th className="px-6 py-4 font-semibold text-right">Date</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800">
                                        {expenses.map((txn) => (
                                            <tr key={txn._id} className="hover:bg-neutral-800/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-sm group-hover:text-white transition-colors">{txn.title}</div>
                                                    <div className="text-xs text-neutral-500">Confirmed</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-bold text-neutral-400 bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-700">
                                                        {txn.category}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 text-right font-bold text-sm text-pink-500`}>
                                                    -₹{txn.amount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right text-xs text-neutral-400 font-medium">
                                                    {new Date(txn.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 hover:bg-neutral-700 rounded-lg text-neutral-500 hover:text-white transition-all">
                                                        <FiMoreHorizontal />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Secondary Widgets */}
                    <div className="space-y-8">
                        {/* Quick Actions */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                            <h3 className="font-bold text-lg mb-6">Quick Transfer</h3>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex-1 aspect-square rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-500 hover:border-pink-500 hover:text-pink-500 cursor-pointer transition-all">
                                            U{i}
                                        </div>
                                    ))}
                                    <div className="flex-1 aspect-square rounded-2xl border-2 border-dashed border-neutral-700 flex items-center justify-center text-neutral-500 hover:border-pink-500 hover:text-pink-500 cursor-pointer transition-all">
                                        <FiPlus />
                                    </div>
                                </div>
                                <div className="space-y-2 mt-6">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 font-bold">₹</span>
                                        <input type="number" placeholder="0.00" className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl py-4 pl-8 pr-4 text-xl font-black focus:outline-none focus:border-pink-500 transition-colors" />
                                    </div>
                                </div>
                                <button className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-neutral-200 transition-all active:scale-95">
                                    Send Money
                                </button>
                            </div>
                        </div>

                        {/* Account Card */}
                        <div className="bg-pink-600 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col justify-between h-40">
                                <div className="flex justify-between items-start">
                                    <div className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Platinum Card</div>
                                    <div className="w-10 h-6 bg-neutral-950/20 rounded-md"></div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium opacity-70 mb-1">Total Saving</div>
                                    <div className="text-2xl font-black tracking-tight">₹1,24,500.00</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-sm font-bold tracking-widest">•••• 8824</div>
                                    <div className="text-xs font-black italic">VISA</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ModernDashboard;
