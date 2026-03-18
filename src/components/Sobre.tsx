export default function Sobre() {
    return (
        <section id="sobre" className="container mx-auto px-4 py-24 max-w-screen-xl border-t border-border/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-primary">Sobre Mim</h2>
                    <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                        <p>
                            Olá! Sou um <strong className="text-foreground font-semibold">Desenvolvedor Full Stack Júnior</strong> e estudante de Análise e Desenvolvimento de Sistemas (ADS). Atuo profissionalmente como desenvolvedor há cerca de 6 meses, mas minha vivência e estudos com tecnologia já somam quase 2 anos atuando inicialmente como JA com HelpDesk e Segutança da Informação.
                        </p>
                        <p>
                            Após esse periodo de aprendizado recebi a oportunidade de ser efetivado na empresa em que atuo alem de uma promoção entrando para equipe de Desenvolvimento da empresa.
                        </p>
                        <p>
                            Sou um amante da tecnologia e sempre busco aprender e me aperfeiçoar. Meu objetivo é criar soluções completas, desde o banco de dados e backend até a interface de usuário, focando em aplicações modernas e eficientes.
                        </p>
                    </div>

                    <div className="pt-4">
                        <h3 className="text-xl font-bold mb-4">Tecnologias & Ferramentas:</h3>
                        <div className="flex flex-wrap gap-2">
                            {[
                                "Next.js", "React", "TypeScript", "Tailwind CSS", "C#",
                                "Node.js", ".NET", "Prisma ORM", "PostgreSQL",
                                "SQL", "Azure", "AWS", "Oracle Cloud", "n8n"
                            ].map((tech) => (
                                <span key={tech} className="inline-flex items-center rounded-md border border-border/50 px-3 py-1 text-sm font-medium bg-secondary/50 text-secondary-foreground">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-muted rounded-2xl h-80 flex items-center justify-center border border-border/50">
                    <span className="text-muted-foreground">[Área para sua Foto]</span>
                </div>
            </div>
        </section>
    );
}
