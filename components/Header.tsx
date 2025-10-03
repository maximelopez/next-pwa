import Link from 'next/link'

export default function Header() {
  return (
    <header className='header'>
      <nav className='header-nav'>
        <Link href="/">Accueil</Link>
        <Link href="/reception">Reception</Link>
        <Link href="/room">Room</Link>
        <Link href="/gallery">Gallery</Link>
      </nav>
    </header>
  )
}
