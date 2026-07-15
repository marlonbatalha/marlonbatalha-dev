import React from 'react';
import { useContatoForm } from '@/hooks/useContatoForm';

export default function Contact() {
  const { formData, status, handleChange, handleSubmit } = useContatoForm();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
      <div className="flex flex-col">
        <label htmlFor="nome" className="text-sm mb-1 text-gray-300">Nome</label>
        <input
          id="nome"
          name="nome"
          type="text"
          placeholder="Seu nome"
          value={formData.nome}
          onChange={handleChange}
          required
          className="bg-transparent border border-gray-600 rounded p-2 text-white focus:border-white outline-none"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="email" className="text-sm mb-1 text-gray-300">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-transparent border border-gray-600 rounded p-2 text-white focus:border-white outline-none"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="mensagem" className="text-sm mb-1 text-gray-300">Mensagem</label>
        <textarea
          id="mensagem"
          name="mensagem"
          placeholder="Escreva sua mensagem aqui..."
          value={formData.mensagem}
          onChange={handleChange}
          required
          rows={4}
          className="bg-transparent border border-gray-600 rounded p-2 text-white focus:border-white outline-none resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={status === 'enviando'}
        className="mt-2 p-2 border border-white text-white hover:bg-white hover:text-black transition-colors rounded disabled:opacity-50"
      >
        {status === 'enviando' ? 'Enviando...' : 'Enviar'}
      </button>

      {status === 'sucesso' && (
        <p className="text-green-500 mt-2 text-sm">Mensagem enviada com sucesso!</p>
      )}
      {status === 'erro' && (
        <p className="text-red-500 mt-2 text-sm">Erro ao enviar mensagem. Tente novamente.</p>
      )}
    </form>
  );
}
