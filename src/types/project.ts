export interface Project {
    id: string;
    nome: string;
    nomeEn?: string;
    descricao: string;
    descricaoEn?: string;
    tecnologias: string[];
    linkRepositorio?: string;
    linkLive?: string;
}
