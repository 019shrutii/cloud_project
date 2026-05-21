import React, { useState, useEffect } from "react";

const QUOTES = [
    { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
    { text: "Financial freedom is available to those who learn it and work for it.", author: "Robert Kiyosaki" },
    { text: "It's not how much money you make, but how much money you keep.", author: "Robert Kiyosaki" },
    { text: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey" },
    { text: "The habit of saving is itself an education; it fosters every virtue, teaches self-denial.", author: "T.T. Munger" },
    { text: "Rich people have big libraries. Poor people have big TVs.", author: "Jim Rohn" },
    { text: "Never spend your money before you have it.", author: "Thomas Jefferson" },
    { text: "Money is a tool. Used properly it makes something beautiful; used wrong, it makes a mess.", author: "Bradley Vinson" },
    { text: "Beware of small expenses; a small leak will sink a great ship.", author: "Benjamin Franklin" },
    { text: "The art is not in making money, but in keeping it.", author: "Proverb" },
];

function QuoteWidget() {
    const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
    const [visible, setVisible] = useState(true);

    const cycle = (dir = 1) => {
        setVisible(false);
        setTimeout(() => {
            setIdx(i => (i + dir + QUOTES.length) % QUOTES.length);
            setVisible(true);
        }, 300);
    };

    // Auto-rotate every 12 seconds
    useEffect(() => {
        const t = setInterval(() => cycle(1), 12000);
        return () => clearInterval(t);
    }, []);

    const q = QUOTES[idx];

    return (
        <div className="glass section-card" style={{
            background: "linear-gradient(135deg, rgba(236,72,153,0.05), rgba(59,130,246,0.05))",
            borderColor: "rgba(236,72,153,0.25)",
            marginBottom: "1.5rem",
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    💬 Daily Finance Quote
                </span>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                    <button onClick={() => cycle(-1)} className="btn-ghost" style={{ padding: "0.25rem 0.6rem", fontSize: "0.9rem" }}>←</button>
                    <button onClick={() => cycle(1)} className="btn-ghost" style={{ padding: "0.25rem 0.6rem", fontSize: "0.9rem" }}>→</button>
                </div>
            </div>

            <div style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
            }}>
                <p style={{
                    fontSize: "1rem", fontStyle: "italic", lineHeight: 1.75,
                    color: "var(--text)", marginBottom: "0.75rem",
                }}>
                    "{q.text}"
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600 }}>
                    — {q.author}
                </p>
            </div>

            {/* Dot indicators */}
            <div style={{ display: "flex", gap: "0.4rem", marginTop: "1rem", justifyContent: "center" }}>
                {QUOTES.map((_, i) => (
                    <button key={i} onClick={() => { setVisible(false); setTimeout(() => { setIdx(i); setVisible(true); }, 300); }}
                        style={{
                            width: i === idx ? "20px" : "6px", height: "6px",
                            borderRadius: "3px", border: "none", cursor: "pointer",
                            background: i === idx ? "var(--primary)" : "rgba(255,255,255,0.1)",
                            transition: "all 0.35s ease",
                            padding: 0,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default QuoteWidget;
