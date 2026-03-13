export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 py-6 md:px-8 mt-12 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 mx-auto md:h-16 md:flex-row px-4">
        <p className="text-sm font-medium leading-loose text-center text-muted-foreground md:text-left">
          Construído por Marlon Batalha. O código-fonte está disponível no{' '}
          <a
            href="https://github.com/marlonbatalha"
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
