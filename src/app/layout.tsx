export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`antialiased`}>
        <head> Cabeçalho do projeto fixo</head>
        {children}
        <footer>roda pé fixo</footer>
      </body>
    </html>
  );
}
