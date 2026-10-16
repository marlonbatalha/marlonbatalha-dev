import { ImageResponse } from "next/og";
import { siteDescription } from "@/lib/site";

// Imagem de preview ao compartilhar o link (LinkedIn, WhatsApp, X...),
// gerada no build com o mesmo visual de terminal do site.
export const alt = "Marlon Batalha — Desenvolvedor Full Stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: "#050505",
                    padding: 48,
                    fontFamily: "monospace",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        border: "2px solid #222",
                        borderRadius: 16,
                        background: "#0a0a0a",
                        overflow: "hidden",
                    }}
                >
                    {/* Barra de título estilo macOS */}
                    <div style={{ display: "flex", gap: 12, padding: "20px 24px", borderBottom: "2px solid #222" }}>
                        <div style={{ width: 18, height: 18, borderRadius: 9, background: "#ff5f57" }} />
                        <div style={{ width: 18, height: 18, borderRadius: 9, background: "#febc2e" }} />
                        <div style={{ width: 18, height: 18, borderRadius: 9, background: "#28c840" }} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", padding: "48px 56px", gap: 28 }}>
                        <div style={{ display: "flex", fontSize: 32 }}>
                            <span style={{ color: "#00ff88" }}>marlon</span>
                            <span style={{ color: "#666" }}>@</span>
                            <span style={{ color: "#00cfff" }}>portfolio</span>
                            <span style={{ color: "#9ca3af" }}>:~$</span>
                            <span style={{ color: "#e8e8e8", marginLeft: 16 }}>whoami</span>
                        </div>
                        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, color: "#00ff88" }}>
                            MARLON BATALHA
                        </div>
                        <div style={{ display: "flex", fontSize: 40, color: "#00cfff" }}>
                            Desenvolvedor Full Stack
                        </div>
                        <div style={{ display: "flex", fontSize: 26, color: "#888", maxWidth: 1000 }}>
                            {siteDescription}
                        </div>
                    </div>
                </div>
            </div>
        ),
        size
    );
}
