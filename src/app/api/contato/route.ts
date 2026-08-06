import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Armazena os IPs e a quantidade de requisições para Rate Limiting
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX_REQUESTS = 3; // Máximo de 3 mensagens
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // Por janela de 1 hora

// Evita que o input do usuário quebre o HTML do email ou injete headers no assunto
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function sanitizeHeaderValue(str: string): string {
    return str.replace(/[\r\n]/g, " ").trim();
}

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
        console.warn(`[contato] Rate limit excedido para IP ${ip}`);
        return NextResponse.json(
            { error: "Muitas tentativas. Tente novamente mais tarde." },
            { status: 429 }
        );
    }

    const { nome, email, mensagem } = await req.json();

    if (!nome || !email || !mensagem) {
        console.warn(`[contato] Campos faltando na requisição de IP ${ip}:`, { nome: !!nome, email: !!email, mensagem: !!mensagem });
        return NextResponse.json(
            { error: "Campos obrigatórios faltando" },
            { status: 400 }
        );
    }

    console.log(`[contato] Nova requisição de IP ${ip} — nome: ${nome}, email: ${email}`);

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

        const safeNome = sanitizeHeaderValue(nome);
        const escapedNome = escapeHtml(safeNome);
        const escapedEmail = escapeHtml(sanitizeHeaderValue(email));
        const escapedMensagem = escapeHtml(mensagem).replace(/\n/g, "<br/>");
        const firstName = escapedNome.split(" ")[0];
        const timestamp = new Date().toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            dateStyle: "short",
            timeStyle: "short",
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: process.env.EMAIL_TO || process.env.EMAIL_USER, // Caixa que recebe as mensagens do formulário
            replyTo: email, // Responder vai para o email do remetente
            subject: `[Terminal Portfolio] Nova mensagem de ${safeNome}`,
            text: `Nome: ${nome}\nEmail: ${email}\nRecebido em: ${timestamp}\n\nMensagem:\n${mensagem}`,
            html: `
<div style="background-color:#050505; padding:32px 16px; font-family:'Courier New', Consolas, Monaco, monospace;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background-color:#0d0d0d; border:1px solid #1e1e1e; border-radius:8px; overflow:hidden;">
    <tr>
      <td style="padding:16px 24px; background-color:#111111; border-bottom:1px solid #1e1e1e;">
        <span style="color:#ff5f57; font-size:12px;">●</span>
        <span style="color:#febc2e; font-size:12px;"> ●</span>
        <span style="color:#00ff88; font-size:12px;"> ●</span>
        <div style="margin-top:10px; color:#00cfff; font-size:14px; font-weight:bold;">marlonbatalha.dev — terminal</div>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <p style="color:#666; font-size:13px; margin:0 0 18px;">$ contato --nova-mensagem</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
          <tr>
            <td style="color:#a78bfa; font-size:13px; padding:4px 0; width:70px; vertical-align:top;">nome:</td>
            <td style="color:#e8e8e8; font-size:14px; padding:4px 0;">${escapedNome}</td>
          </tr>
          <tr>
            <td style="color:#a78bfa; font-size:13px; padding:4px 0; vertical-align:top;">email:</td>
            <td style="color:#00cfff; font-size:14px; padding:4px 0;"><a href="mailto:${escapedEmail}" style="color:#00cfff; text-decoration:none;">${escapedEmail}</a></td>
          </tr>
        </table>
        <div style="border-left:2px solid #00ff88; padding:12px 16px; background-color:#0a0a0a; border-radius:0 4px 4px 0;">
          <p style="color:#e8e8e8; font-size:14px; line-height:1.6; margin:0;">${escapedMensagem}</p>
        </div>
        <div style="margin-top:28px; text-align:center;">
          <a href="mailto:${escapedEmail}" style="display:inline-block; background-color:#00ff88; color:#000000; text-decoration:none; padding:10px 22px; border-radius:4px; font-size:13px; font-weight:bold;">Responder ${firstName}</a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 24px; background-color:#0a0a0a; border-top:1px solid #1e1e1e;">
        <p style="color:#444; font-size:11px; margin:0;">Recebido em ${timestamp} · via marlonbatalha.dev</p>
      </td>
    </tr>
  </table>
</div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`[contato] Email enviado com sucesso — messageId: ${info.messageId}, resposta SMTP: ${info.response}`);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("[contato] Erro ao enviar email via SMTP:", error);
        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        );
    }
}