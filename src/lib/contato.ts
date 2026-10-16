/**
 * Dados do formulário de contato, coletados pelo terminal em três etapas
 * (nome → email → mensagem) e enviados como JSON para `POST /api/contato`.
 */
export interface ContatoFormData {
    /** Nome de quem está escrevendo. Também usado no assunto do email. */
    nome: string;
    /** Email para resposta — vira o `replyTo` do email enviado. */
    email: string;
    /** Corpo da mensagem, em texto puro (o HTML é escapado na API). */
    mensagem: string;
}

/**
 * Tamanho máximo (em caracteres) de cada campo de {@link ContatoFormData}.
 *
 * Compartilhado entre o terminal, que avisa o usuário já na etapa, e a API,
 * que é a validação definitiva (o cliente pode ser burlado).
 */
export const CONTATO_LIMITES = {
    nome: 100,
    email: 254, // tamanho máximo de um endereço de email (RFC 5321)
    mensagem: 5000,
} as const satisfies Record<keyof ContatoFormData, number>;
