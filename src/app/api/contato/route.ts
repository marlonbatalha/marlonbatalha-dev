import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Armazena os IPs e a quantidade de requisições para Rate Limiting
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX_REQUESTS = 3; // Máximo de 3 mensagens
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // Por janela de 1 hora

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record) {
        rateLimitMap.set(ip, { count: 1, lastReset: now });
        return true;
    }

    if (now - record.lastReset > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, lastReset: now });
        return true;
    }

    if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }

    record.count += 1;
    return true;
}

export async function POST(req: NextRequest) {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown_ip";

    if (!checkRateLimit(ip)) {
        return NextResponse.json(
            { error: "Muitas tentativas. Tente novamente mais tarde." },
            { status: 429 }
        );
    }

    const { nome, email, mensagem } = await req.json();

    if (!nome || !email || !mensagem) {
        return NextResponse.json(
            { error: "Campos obrigatórios faltando" },
            { status: 400 }
        );
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || "smtp.gmail.com",
            port: Number(process.env.EMAIL_PORT) || 465,
            secure: Number(process.env.EMAIL_PORT) === 465 || !process.env.EMAIL_PORT, // 465 is secure, others usually false (TLS)
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Envia para sua própria caixa
            replyTo: email, // Responder vai para o email do remetente
            subject: `[Terminal Portfolio] Nova mensagem de ${nome}`,
            text: `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`,
            html: `
                <div style="font-family: monospace; padding: 20px; background-color: #111; color: #00ff88; border-radius: 8px;">
                    <h3 style="color: #00cfff;">Nova mensagem via Terminal</h3>
                    <p><strong>De:</strong> ${nome} &lt;${email}&gt;</p>
                    <hr style="border-color: #333;" />
                    <p style="white-space: pre-wrap; color: #e8e8e8;">${mensagem}</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Erro ao enviar email via SMTP:", error);
        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        );
    }
}