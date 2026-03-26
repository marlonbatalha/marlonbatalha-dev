import Form from "next/form";

export default function Contact() {
  return (
    <Form action="/submit">
      <input type="query" placeholder="Nome" />
      <input type="email" placeholder="Email" />
      <textarea placeholder="Mensagem"></textarea>
      <button type="submit">Enviar</button>
    </Form>
  );
}
