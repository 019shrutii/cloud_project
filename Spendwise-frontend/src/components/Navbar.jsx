import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isLoggedIn = !!localStorage.getItem("token");
    const storedName = localStorage.getItem("spendwise_name") || "";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setDrawerOpen(false); }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("spendwise_name");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { to: "/", label: "Home", icon: "🏠" },
        { to: "/tips", label: "Tips", icon: "💡" },
        { to: "/calculator", label: "Calculators", icon: "🧮" },
        { to: "/about", label: "About", icon: "ℹ️" },
        ...(isLoggedIn ? [
            { to: "/dashboard", label: "Dashboard", icon: "📊" },
            { to: "/reports", label: "Reports", icon: "📈" }
        ] : []),
    ];

    const LinkItem = ({ link, mobile = false }) => (
        <Link
            to={link.to}
            className="nav-link"
            style={{
                color: isActive(link.to) ? "var(--primary)" : undefined,
                background: isActive(link.to) ? "rgba(236, 72, 153, 0.1)" : undefined,
                ...(mobile ? { fontSize: "1rem", padding: "0.75rem 1rem", borderRadius: "0.6rem", display: "block" } : {}),
            }}
        >
            {mobile ? `${link.icon} ${link.label}` : link.label}
        </Link>
    );

    return (
        <>
            <nav className="navbar" style={{ boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.45)" : "none" }}>
                <Link to="/" style={{ textDecoration: "none" }} className="navbar-brand">
                    💸 SpendWise
                </Link>

                {/* Desktop */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }} className="desktop-nav">
                    {navLinks.map(link => <LinkItem key={link.to} link={link} />)}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "0.5rem" }}>
                        {isLoggedIn && storedName && (
                            <div style={{
                                fontSize: "0.78rem", color: "var(--muted)", padding: "0.3rem 0.75rem",
                                background: "rgba(255,255,255,0.05)", borderRadius: "999px",
                                border: "1px solid var(--glass-border)",
                            }}>👤 {storedName}</div>
                        )}
                        {!isLoggedIn ? (
                            <>
                                <Link to="/login"><button className="btn-ghost" style={{ padding: "0.4rem 1rem", fontSize: "0.88rem" }}>Login</button></Link>
                                <Link to="/signup"><button className="btn-primary" style={{ width: "auto", padding: "0.4rem 1rem", fontSize: "0.88rem" }}>Sign Up</button></Link>
                            </>
                        ) : (
                            <button onClick={handleLogout} className="btn-danger">Logout</button>
                        )}
                    </div>
                </div>

                <button onClick={() => setDrawerOpen(o => !o)} className="btn-ghost mobile-menu-btn" aria-label="Toggle menu" style={{ fontSize: "1.25rem", padding: "0.3rem 0.6rem" }}>
                    {drawerOpen ? "✕" : "☰"}
                </button>

                <style>{`
          .desktop-nav { display: flex; }
          .mobile-menu-btn { display: none; }
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .mobile-menu-btn { display: flex !important; }
          }
        `}</style>
            </nav>

            {/* Mobile Drawer */}
            <div onClick={() => setDrawerOpen(false)} style={{
                position: "fixed", inset: 0, zIndex: 150,
                background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
                opacity: drawerOpen ? 1 : 0,
                pointerEvents: drawerOpen ? "auto" : "none",
                transition: "opacity 0.3s",
            }} />
            <div style={{
                position: "fixed", top: 0, right: 0, height: "100dvh",
                width: "min(300px, 80vw)", zIndex: 200,
                background: "var(--card-bg)", backdropFilter: "blur(20px)",
                borderLeft: "1px solid var(--glass-border)",
                transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex", flexDirection: "column", padding: "1.5rem", gap: "0.4rem",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <span className="navbar-brand">💸 SpendWise</span>
                    <button onClick={() => setDrawerOpen(false)} className="btn-ghost" style={{ padding: "0.3rem 0.55rem" }}>✕</button>
                </div>

                {isLoggedIn && storedName && (
                    <div style={{
                        display: "flex", alignItems: "center", gap: "0.75rem",
                        padding: "0.9rem 1rem", marginBottom: "0.5rem",
                        background: "rgba(236, 72, 153, 0.1)", borderRadius: "0.75rem",
                        border: "1px solid rgba(236, 72, 153, 0.2)",
                    }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: "50%",
                            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 800, fontSize: "1rem", color: "#fff",
                        }}>{storedName[0].toUpperCase()}</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>{storedName}</div>
                            <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Signed in</div>
                        </div>
                    </div>
                )}

                {navLinks.map(link => <LinkItem key={link.to} link={link} mobile />)}

                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login"><button className="btn-ghost" style={{ width: "100%" }}>Login</button></Link>
                            <Link to="/signup"><button className="btn-primary">Sign Up →</button></Link>
                        </>
                    ) : (
                        <button onClick={handleLogout} className="btn-danger" style={{ width: "100%" }}>🚪 Logout</button>
                    )}
                </div>
            </div>
        </>
    );
}

export default Navbar;