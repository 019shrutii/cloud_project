import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    const currentYear = new Date().getFullYear();

    const links = [
        { section: "App", items: [{ to: "/", label: "Home" }, { to: "/dashboard", label: "Dashboard" }, { to: "/signup", label: "Get Started" }] },
        { section: "Tools", items: [{ to: "/tips", label: "Finance Tips" }, { to: "/calculator", label: "Calculators" }] },
        { section: "Info", items: [{ to: "/about", label: "About" }, { to: "/login", label: "Login" }] },
    ];

    return (
        <footer style={{
            borderTop: "1px solid var(--glass-border)",
            padding: "3rem 2rem 2rem",
            marginTop: "4rem",
        }}>
            <div style={{ maxWidth: "960px", margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(3, 1fr)", gap: "2rem", marginBottom: "2.5rem" }}>
                    {/* Brand */}
                    <div>
                        <div className="navbar-brand" style={{ fontSize: "1.3rem", marginBottom: "0.75rem" }}>💸 SpendWise</div>
                        <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.7, maxWidth: "240px" }}>
                            A smarter way to track expenses, visualize spending, and build better money habits.
                        </p>
                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                            {["Built with React", "Powered by MERN"].map(tag => (
                                <span key={tag} style={{
                                    fontSize: "0.65rem", fontWeight: 600, padding: "0.2rem 0.55rem",
                                    borderRadius: "999px", background: "rgba(236, 72, 153, 0.15)",
                                    color: "var(--primary)", border: "1px solid rgba(236, 72, 153, 0.25)",
                                }}>{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {links.map(col => (
                        <div key={col.section}>
                            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "0.85rem" }}>
                                {col.section}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {col.items.map(item => (
                                    <Link key={item.to} to={item.to} style={{
                                        color: "var(--muted)", textDecoration: "none", fontSize: "0.85rem",
                                        transition: "color 0.2s",
                                    }}
                                        onMouseEnter={e => e.target.style.color = "var(--primary)"}
                                        onMouseLeave={e => e.target.style.color = "var(--muted)"}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                        © {currentYear} SpendWise. Built with ❤️ using the MERN Stack.
                    </p>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                        {["💡 Tips", "🧮 Calculators", "📊 Dashboard"].map((label, i) => {
                            const tos = ["/tips", "/calculator", "/dashboard"];
                            return (
                                <Link key={label} to={tos[i]} style={{
                                    fontSize: "0.72rem", color: "var(--muted)", textDecoration: "none",
                                    padding: "0.2rem 0.6rem", borderRadius: "999px",
                                    border: "1px solid var(--glass-border)", transition: "all 0.2s",
                                }}
                                    onMouseEnter={e => { e.target.style.color = "var(--text)"; e.target.style.borderColor = "var(--primary)"; }}
                                    onMouseLeave={e => { e.target.style.color = "var(--muted)"; e.target.style.borderColor = "var(--glass-border)"; }}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
