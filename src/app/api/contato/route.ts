import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    const { nome, email, mensagem } = await req.json();

    if (!nome || !email || !mensagem) {
        return NextResponse.json(
            { error: "Campos obrigatórios faltando" },
            { status: 400 }
        );
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
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