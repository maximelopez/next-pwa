import Link from 'next/link'

export default function Header() {
  return (
    <header style={{ padding: "1rem", background: "#f5f5f5" }}>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link href="/">Accueil</Link>
        <Link href="/reception">Reception</Link>
        <Link href="/room">Room</Link>
        <Link href="/gallery">Gallery</Link>
      </nav>
    </header>
  )
}
