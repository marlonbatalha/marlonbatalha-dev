import Link from 'next/link';

function ProjectCard({ title, description, tags, link }: { title: string, description: string, tags: string[], link: string }) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/40 bg-card text-card-foreground p-6 transition-all hover:border-primary/50 hover:shadow-md">
      <div>
        <h3 className="text-xl font-bold tracking-tight mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
          {description}
        </p>
      </div>
      <div className="mt-auto flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={link}
          target="_blank"
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Ver Detalhes →
        </Link>
      </div>
    </div>
  );
}

export default function Projetos() {
  const mockProjects = [
    {
      id: 1,
      title: "E-Commerce Plataforma",
      description: "Uma plataforma completa de e-commerce construída com Next.js, TypeScript, Tailwind CSS e Stripe para pagamentos.",
      tags: ["Next.js", "TypeScript", "Tailwind", "Stripe"],
      link: "#"
    },
    {
      id: 2,
      title: "API de Emissão de NFS-e",
      description: "Serviço backend para automação de emissão de Notas Fiscais de Serviço eletrônicas com integração a prefeitura utilizando o padrão nacional.",
      tags: [".NET", "C#", "SOAP/REST", "Azure SQL", "Azure Services App"],
      link: "#"
    },
    {
      id: 3,
      title: "App de Clima",
      description: "Aplicação PWA de previsão do tempo em tempo real consumindo a API OpenWeather.",
      tags: ["PWA", "API", "React Native"],
      link: "#"
    }
  ];

  return (
    <section id="projetos" className="container mx-auto px-4 py-24 max-w-screen-xl border-t border-border/40">
      <div className="space-y-4 mb-12 text-center md:text-left">
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Meus Projetos</h2>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Aqui estão alguns dos meu projetos mais recentes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map(project => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            tags={project.tags}
            link={project.link}
          />
        ))}
      </div>
    </section>
  );
}
