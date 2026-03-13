"use client";

import { useState } from "react";

// Tipagem do formulário
type FormData = {
    nome: string;
    email: string;
    mensagem: string;
};

// Os estados possíveis do envio — como um semáforo
type Status = "idle" | "enviando" | "sucesso" | "erro";

export function useContatoForm() {
    const [formData, setFormData] = useState<FormData>({
        nome: "",
        email: "",
        mensagem: "",
    });

    const [status, setStatus] = useState<Status>("idle");

    // Um único handler para todos os campos (nome, email, mensagem) - para tratar o evento de mudança
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // Impede o reload padrão do browser
        setStatus("enviando");

        try {
            const response = await fetch("/api/contato", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Falha no envio");

            setStatus("sucesso");
            // Limpa o formulário após sucesso
            setFormData({ nome: "", email: "", mensagem: "" });

        } catch {
            setStatus("erro");
        }
    }

    return { formData, status, handleChange, handleSubmit };
}