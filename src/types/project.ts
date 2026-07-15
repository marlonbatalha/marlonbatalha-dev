export interface Project {
    id: string;
    nome: string;
    descricao: string;
    tecnologias: string[];
    linkRepositorio?: string;
    linkLive?: string;
}
