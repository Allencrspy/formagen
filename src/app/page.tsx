import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <h1>Formagen</h1>
      <p>Build a form, publish a version, share the link, and see every response.</p>
      <Link href="/app">Open your forms</Link>
    </main>
  );
}
