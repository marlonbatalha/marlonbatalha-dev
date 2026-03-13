"use client";

import { useContatoForm } from "@/hooks/useContatoForm";

export default function Contato() {
  const { formData, status, handleChange, handleSubmit } = useContatoForm();

  return (
    <section
      id="contato"
      className="container mx-auto px-4 py-24 max-w-screen-xl border-t border-border/40"
    >
      <div className="text-center max-w-2xl mx-auto space-y-8">
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-primary">
          Entrar em Contato
        </h2>
        <p className="text-muted-foreground text-lg">
          Caso tenha gostado do que viu até agora, me mande um email, vamos conversar!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">

          {/* NOME */}
          <div className="space-y-1">
            <label htmlFor="nome" className="text-sm font-medium text-foreground">
              Nome
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              placeholder="Seu nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* MENSAGEM */}
          <div className="space-y-1">
            <label htmlFor="mensagem" className="text-sm font-medium text-foreground">
              Mensagem
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              required
              rows={5}
              placeholder="Sua mensagem..."
              value={formData.mensagem}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* FEEDBACK de status */}
          {status === "sucesso" && (
            <p className="text-sm text-green-500">Mensagem enviada com sucesso! 🎉</p>
          )}
          {status === "erro" && (
            <p className="text-sm text-destructive">Algo deu errado. Tente novamente.</p>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={status === "enviando"}
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            {status === "enviando" ? "Enviando..." : "Diga Olá! 👋"}
          </button>

        </form>
      </div>
    </section>
  );
}