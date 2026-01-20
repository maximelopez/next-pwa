import Link from 'next/link'

export default function Header() {
  return (
    <header className='header'>
      <nav className='header-nav'>
        <Link href="/">Accueil</Link>
        <Link href="/chat">Chat</Link>
        <Link href="/gallery">Gallerie</Link>
      </nav>
    </header>
  )
}
