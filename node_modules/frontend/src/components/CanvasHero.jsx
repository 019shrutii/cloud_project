import React, { useEffect, useRef } from "react";

const PARTICLES = 38;

function CanvasHero() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const SYMBOLS = ["₹", "$", "€", "💰", "✦", "◆", "○"];
        const particles = Array.from({ length: PARTICLES }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 10 + Math.random() * 14,
            symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            speed: 0.2 + Math.random() * 0.5,
            drift: (Math.random() - 0.5) * 0.25,
            opacity: 0.06 + Math.random() * 0.12,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.01,
        }));

        let animId;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.font = `${p.size}px Inter`;
                ctx.fillStyle = "#ec4899"; // Pink
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillText(p.symbol, 0, 0);
                ctx.restore();

                p.y -= p.speed;
                p.x += p.drift;
                p.rotation += p.rotSpeed;

                if (p.y < -30) {
                    p.y = canvas.height + 20;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x < -30) p.x = canvas.width + 10;
                if (p.x > canvas.width + 30) p.x = -10;
            });
            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                pointerEvents: "none", zIndex: 0,
            }}
        />
    );
}

export default CanvasHero;
