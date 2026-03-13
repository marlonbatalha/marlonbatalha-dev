import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { nome, email, mensagem } = await req.json();

    // Validação mínima no servidor (nunca confie só no front)
    if (!nome || !email || !mensagem) {
        return NextResponse.json(
            { error: "Campos obrigatórios faltando" },
            { status: 400 }
        );
    }

    try {
        // ✉️ TODO: NodeMailer entra aqui depois
        // const transporter = nodemailer.createTransport({ ... })
        // await transporter.sendMail({ from: email, to: "seu@email.com", ... })

        console.log("Nova mensagem recebida:", { nome, email, mensagem });

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("Erro ao enviar email:", error);
        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        );
    }
}