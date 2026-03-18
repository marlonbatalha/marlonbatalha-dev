import Link from 'next/link';

export default function Hero() {
  return (
    <section id="inicio" className="container mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center space-y-8 min-h-[80vh] justify-center">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Olá, eu sou o <span className="text-primary">Marlon</span>
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
          Desenvolvedor apaixonado por criar aplicaçãoes e solucionar problemas com a tecnologia de maneira rápida e acessível. Transformando ideias em código.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
        <Link 
          href="#projetos" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-2"
        >
          Ver Projetos
        </Link>
        <Link 
          href="#contato" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 py-2"
        >
          Entrar em Contato
        </Link>
      </div>
    </section>
  );
}
