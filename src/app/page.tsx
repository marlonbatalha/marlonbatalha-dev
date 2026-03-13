import Hero from '@/components/Hero';
import Projetos from '@/components/Projetos';
import Sobre from '@/components/Sobre';
import Contato from '@/components/Contato';

export default function Home() {
  return (
    <div className="scroll-smooth">
      <Hero />
      <Projetos />
      <Sobre />
      <Contato />
    </div>
  );
}